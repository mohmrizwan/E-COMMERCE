import axios from "axios";
import crypto from "crypto";
import { getVendorShippingConfig } from "./VendorIntegrationConfig.js";
import {
  calculateShipmentParcel,
  formatServiceabilityParcel,
} from "./ShipmentParcel.js";

const normalizeShiprocketOrderResponse = (payload) => {
  const candidates = [
    payload?.data?.data,
    payload?.data,
    payload?.response?.data?.data,
    payload?.response?.data,
    payload?.response,
    payload,
  ];
  const result = candidates.find(
    (candidate) =>
      candidate &&
      typeof candidate === "object" &&
      (candidate.order_id != null ||
        candidate.orderId != null ||
        candidate.shipment_id != null ||
        candidate.shipmentId != null),
  ) || payload;

  return {
    ...result,
    order_id: result?.order_id ?? result?.orderId,
    shipment_id: result?.shipment_id ?? result?.shipmentId,
    awb_code: result?.awb_code ?? result?.awbCode ?? "",
    courier_company_id:
      result?.courier_company_id ?? result?.courierCompanyId,
    courier_name: result?.courier_name ?? result?.courierName,
  };
};

let cachedAuth = null;
let authInFlight = null;
let rejectedCredentials = null;
const AUTH_FAILURE_COOLDOWN_MS = 15 * 60 * 1000;
const TOKEN_EXPIRY_BUFFER_MS = 60 * 1000;

const credentialFingerprint = (credentials) =>
  crypto.createHash("sha256").update(JSON.stringify(credentials)).digest("hex");

const getTokenExpiry = (token) => {
  try {
    const payload = JSON.parse(Buffer.from(token.split(".")[1], "base64url").toString("utf8"));
    if (Number.isFinite(payload.exp)) {
      return Math.max(Date.now(), payload.exp * 1000 - TOKEN_EXPIRY_BUFFER_MS);
    }
  } catch {
    // If Shiprocket changes token format, use a short cache instead.
  }
  return Date.now() + 30 * 60 * 1000;
};

export const authenticateShiprocketCredentials = async (credentials, httpClient = axios) => {
  try {
    const response = await httpClient.post(
      "https://apiv2.shiprocket.in/v1/external/auth/login",
      credentials,
    );
    const token = response.data?.token;
    if (!token) {
      throw new Error("Shiprocket did not return an authentication token");
    }
    return token;
  } catch (error) {
    console.error("Shiprocket authentication failed", {
      status: error.response?.status,
      code: error.code,
      providerMessage: error.response?.data?.message || error.response?.data?.errors || error.response?.data?.error || null,
    });

    throw error;
  }
};

export const getShiprocketToken = async (vendorId) => {
  const credentials = await getVendorShippingConfig(vendorId);
  const fingerprint = credentialFingerprint(credentials);
  if (cachedAuth?.fingerprint === fingerprint && cachedAuth.expiresAt > Date.now()) {
    return cachedAuth.token;
  }
  if (
    rejectedCredentials?.fingerprint === fingerprint &&
    rejectedCredentials.retryAfter > Date.now()
  ) {
    const error = new Error("Shiprocket login is paused after a rejected attempt. Check credentials and wait before retrying.");
    error.status = rejectedCredentials.status;
    error.code = "SHIPROCKET_AUTH_COOLDOWN";
    throw error;
  }
  if (authInFlight?.fingerprint === fingerprint) return authInFlight.promise;

  const promise = authenticateShiprocketCredentials(credentials)
    .then((token) => {
      cachedAuth = { fingerprint, token, expiresAt: getTokenExpiry(token) };
      rejectedCredentials = null;
      return token;
    })
    .catch((error) => {
      if (error.response?.status === 401 || error.response?.status === 403) {
        rejectedCredentials = {
          fingerprint,
          status: error.response.status,
          retryAfter: Date.now() + AUTH_FAILURE_COOLDOWN_MS,
        };
      }
      throw error;
    })
    .finally(() => {
      if (authInFlight?.promise === promise) authInFlight = null;
    });
  authInFlight = { fingerprint, promise };
  return promise;
};

export const getShiprocketPickupLocations = async (vendorId) => {
  const token = await getShiprocketToken(vendorId);
  const response = await axios.get(
    "https://apiv2.shiprocket.in/v1/external/settings/company/pickup",
    { headers: { Authorization: `Bearer ${token}` } },
  );
  const payload = response.data?.data ?? response.data;
  const locations = Array.isArray(payload)
    ? payload
    : payload?.shipping_address ?? payload?.pickup_locations ?? [];

  return Array.isArray(locations) ? locations : [];
};

export const createShiprocketOrder = async (orderData, vendorId) => {
  try {
    const token = await getShiprocketToken(vendorId);

    const response = await axios.post(
      "https://apiv2.shiprocket.in/v1/external/orders/create/adhoc",
      orderData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Shiprocket order creation failed", {
      status: error.response?.status,
      code: error.code,
    });

    throw error;
  }
};

export const createShiprocketOrderFromOrder = async (orderData, pickupAddress, vendorId) => {
  try {
    const pickupPostcode = String(pickupAddress?.pincode || "").trim();
    const deliveryPostcode = String(
      orderData.shippingAddress?.pincode || ""
    ).trim();
    const pickupLocationName = String(
      pickupAddress?.shiprocketLocationName || ""
    ).trim();

    if (!/^\d{6}$/.test(pickupPostcode)) {
      throw new Error("Vendor pickup address must have a valid six-digit pincode");
    }

    if (!/^\d{6}$/.test(deliveryPostcode)) {
      throw new Error("Customer shipping address must have a valid six-digit pincode");
    }

    if (!pickupLocationName) {
      throw new Error("Vendor Shiprocket pickup location name is missing");
    }

    const customerNameParts = String(
      orderData.shippingAddress?.name || "",
    )
      .trim()
      .split(/\s+/)
      .filter(Boolean);
    const billingCustomerName = customerNameParts.shift();
    const billingLastName = customerNameParts.join(" ") || "NA";

    if (!billingCustomerName) {
      throw new Error("Customer shipping name is missing");
    }

    const parcel = calculateShipmentParcel(orderData.items);
    const token = await getShiprocketToken(vendorId);

    let subTotal = 0;

    const orderItems = orderData.items.map((item) => {
      const itemTotal = item.price * item.quantity;

      subTotal += itemTotal;

      return {
        name: item.productId.name,
        sku: item.productId._id.toString(),
        units: item.quantity,
        selling_price: item.price,
      };
    });

    const shiprocketData = {
      order_id: orderData._id.toString(),
      order_date: orderData.createdAt.toISOString(),

      pickup_location: pickupLocationName,

      billing_customer_name: billingCustomerName,
      billing_last_name: billingLastName,

      billing_address: orderData.shippingAddress.address,
      billing_address_2: "",

      billing_city: orderData.shippingAddress.city,
      billing_pincode: deliveryPostcode,
      billing_state: orderData.shippingAddress.state,
      billing_country: "India",

      billing_email: orderData.userId.email,
      billing_phone: orderData.shippingAddress.phone,

      shipping_is_billing: true,

      order_items: orderItems,

      payment_method:
        orderData.paymentMethod === "COD" ? "COD" : "Prepaid",

      sub_total: subTotal,

      ...parcel,
    };

    const response = await axios.post(
      "https://apiv2.shiprocket.in/v1/external/orders/create/adhoc",
      shiprocketData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const normalizedResponse = normalizeShiprocketOrderResponse(response.data);

    return {
      ...normalizedResponse,
    };
  } catch (error) {
    console.error("Shiprocket order creation failed", {
      status: error.response?.status,
      code: error.code,
    });

    throw error;
  }
};

export const getAvailableShiprocketCouriers = async ({
  vendorId,
  shipmentId,
  pickupPostcode,
  deliveryPostcode,
  weight,
  length,
  breadth,
  height,
  cod,
  declaredValue,
  mode,
}) => {
  const normalizedPickupPostcode = String(pickupPostcode || "").trim();
  const normalizedDeliveryPostcode = String(deliveryPostcode || "").trim();

  if (!/^\d{6}$/.test(normalizedPickupPostcode)) {
    throw new Error("Vendor pickup address must have a valid six-digit pincode");
  }

  if (!/^\d{6}$/.test(normalizedDeliveryPostcode)) {
    throw new Error("Customer shipping address must have a valid six-digit pincode");
  }

  const serviceabilityParcel = formatServiceabilityParcel({
    weight,
    length,
    breadth,
    height,
  });
  const token = await getShiprocketToken(vendorId);

  const response = await axios.get(
    "https://apiv2.shiprocket.in/v1/external/courier/serviceability/",
    {
      params: {
        shipment_id: shipmentId,
        pickup_postcode: normalizedPickupPostcode,
        delivery_postcode: normalizedDeliveryPostcode,
        ...serviceabilityParcel,
        cod,
        declared_value: declaredValue,
        ...(mode ? { mode } : {}),
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const matchShiprocketOrderReference = (orders, reference) => {
  const normalizedReference = String(reference || "");
  return (Array.isArray(orders) ? orders : []).filter(
    (order) => String(order?.channel_order_id || "") === normalizedReference,
  );
};

export const normalizeShiprocketOrderDetails = (details = {}, listOrder = {}) => {
  const order = details.data ?? details;
  const shipments = Array.isArray(order.shipments) ? order.shipments : [];
  const shipment = shipments[0] || order.shipments || order.shipment || {};
  return {
    orderId: String(order.id ?? listOrder.id ?? ""),
    shipmentId: String(
      shipment.id ?? shipment.shipment_id ?? order.shipment_id ?? listOrder.shipment_id ?? "",
    ),
    awbCode: String(shipment.awb ?? shipment.awb_code ?? order.awb_code ?? ""),
    courierCompanyId: String(
      shipment.courier_company_id ?? order.courier_company_id ?? "",
    ),
    courierName: String(shipment.courier ?? shipment.courier_name ?? order.courier_name ?? ""),
  };
};

/** Read-only lookup used to reconcile an ambiguous create timeout. */
export const getShiprocketOrderByReference = async (reference, vendorId) => {
  const token = await getShiprocketToken(vendorId);
  const headers = { Authorization: `Bearer ${token}` };
  const listResponse = await axios.get(
    "https://apiv2.shiprocket.in/v1/external/orders",
    { params: { search: String(reference) }, headers },
  );
  const payload = listResponse.data?.data ?? listResponse.data;
  const orders = Array.isArray(payload) ? payload : payload?.data || [];
  const matches = matchShiprocketOrderReference(orders, reference);
  if (matches.length !== 1) return { matchCount: matches.length, shipment: null };

  const listOrder = matches[0];
  if (!listOrder.id) return { matchCount: 1, shipment: null };
  const detailResponse = await axios.get(
    `https://apiv2.shiprocket.in/v1/external/orders/show/${encodeURIComponent(listOrder.id)}`,
    { headers },
  );
  return {
    matchCount: 1,
    shipment: normalizeShiprocketOrderDetails(detailResponse.data, listOrder),
  };
};

export const getShiprocketShippingQuote = async ({
  vendorId,
  pickupPostcode,
  deliveryPostcode,
  weight,
  length,
  breadth,
  height,
  cod = 0,
  declaredValue,
  isDangerous = false,
}) => {
  const normalizedPickupPostcode = String(pickupPostcode || "").trim();
  const normalizedDeliveryPostcode = String(deliveryPostcode || "").trim();
  const preferredCourierCompanyId = String(
    process.env.SHIPROCKET_COURIER_ID || ""
  ).trim();

  if (!/^\d{6}$/.test(normalizedPickupPostcode)) {
    throw new Error("Vendor pickup address must have a valid six-digit pincode");
  }

  if (!/^\d{6}$/.test(normalizedDeliveryPostcode)) {
    throw new Error("Customer shipping address must have a valid six-digit pincode");
  }

  if (preferredCourierCompanyId && !/^\d+$/.test(preferredCourierCompanyId)) {
    throw new Error("SHIPROCKET_COURIER_ID must be numeric when configured");
  }

  const serviceability = await getAvailableShiprocketCouriers({
    vendorId,
    pickupPostcode: normalizedPickupPostcode,
    deliveryPostcode: normalizedDeliveryPostcode,
    weight,
    length,
    breadth,
    height,
    cod,
    declaredValue,
    ...(isDangerous ? { mode: "Surface" } : {}),
  });
  const quote = selectShiprocketCourierQuote(serviceability, preferredCourierCompanyId, {
    pickupPostcode: normalizedPickupPostcode,
    deliveryPostcode: normalizedDeliveryPostcode,
    weight,
    length,
    breadth,
    height,
    isDangerous,
  });
  const courierOptions = (
    serviceability?.data?.available_courier_companies ||
    serviceability?.available_courier_companies || []
  )
    .filter((option) => Number(option.blocked) !== 1)
    .filter((option) => !isDangerous || option.is_surface === true || option.is_surface === 1 || option.is_surface === "1" || option.is_surface === "true")
    .map((option) => {
      const baseRate = Number(option.rate ?? option.freight_charge);
      const additionalCharges = ["other_charges", "coverage_charges", "entry_tax"]
        .reduce((total, field) => total + (Number(option[field]) || 0), 0);
      return {
        courierCompanyId: String(option.courier_company_id || ""),
        courierName: option.courier_name || "Courier partner",
        shippingAmount: Math.round((baseRate + additionalCharges) * 100) / 100,
        additionalCharges: Math.round(additionalCharges * 100) / 100,
        estimatedDelivery: option.etd || option.estimated_delivery_days || null,
        chargeWeight: Number(option.charge_weight) || null,
        isSurface: option.is_surface === true || option.is_surface === 1 || option.is_surface === "1" || option.is_surface === "true",
      };
    })
    .filter((option) => /^\d+$/.test(option.courierCompanyId) && Number.isFinite(option.shippingAmount));
  const selectedCourier = courierOptions.find(
    (option) => option.courierCompanyId === quote.courierCompanyId,
  );
  return {
    ...quote,
    shippingAmount: selectedCourier?.shippingAmount ?? quote.shippingAmount,
    additionalCharges: selectedCourier?.additionalCharges ?? 0,
    courierOptions,
  };
};

export const selectShiprocketCourierQuote = (
  serviceability,
  preferredCourierCompanyId = "",
  route = {},
) => {
  const couriers =
    serviceability?.data?.available_courier_companies ||
    serviceability?.available_courier_companies ||
    [];
  const serviceableCouriers = couriers
    .filter((option) => Number(option.blocked) !== 1)
    .filter((option) => !route.isDangerous || option.is_surface === true || option.is_surface === 1 || option.is_surface === "1" || option.is_surface === "true")
    .map((option) => ({
      option,
      courierCompanyId: String(option.courier_company_id || ""),
      shippingAmount:
        Number(option.rate ?? option.freight_charge) +
        ["other_charges", "coverage_charges", "entry_tax"]
          .reduce((total, field) => total + (Number(option[field]) || 0), 0),
    }))
    .filter(
      ({ courierCompanyId, shippingAmount }) =>
        /^\d+$/.test(courierCompanyId) &&
        Number.isFinite(shippingAmount) &&
        shippingAmount >= 0,
    );
  const courier =
    serviceableCouriers.find(
      ({ courierCompanyId }) =>
        courierCompanyId === preferredCourierCompanyId,
    ) ||
    serviceableCouriers.sort(
      (left, right) => left.shippingAmount - right.shippingAmount,
    )[0];

  if (!courier) {
    throw new Error(
      route.isDangerous
        ? "No surface courier is available for this dangerous-goods shipment"
        : "Shiprocket returned no serviceable couriers with valid rates for this route",
    );
  }

  return {
    shippingAmount: Math.round(courier.shippingAmount * 100) / 100,
    courierCompanyId: courier.courierCompanyId,
    courierName: courier.option.courier_name || "",
    estimatedDelivery:
      courier.option.etd || courier.option.estimated_delivery_days || null,
    ...route,
  };
};

export const assignShiprocketCourier = async (shipmentId, courierCompanyId, vendorId) => {
  const token = await getShiprocketToken(vendorId);
  const endpoint =
    "https://apiv2.shiprocket.in/v1/external/courier/assign/awb";
  const payload = {
    shipment_id: shipmentId,
    courier_id: courierCompanyId,
  };

  try {
    const response = await axios.post(endpoint, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Shiprocket AWB assignment failed", {
      status: error.response?.status,
      code: error.code,
    });

    throw error;
  }
};

export const generateShiprocketPickup = async (shipmentId, vendorId) => {
  const token = await getShiprocketToken(vendorId);

  const response = await axios.post(
    "https://apiv2.shiprocket.in/v1/external/courier/generate/pickup",
    { shipment_id: [shipmentId] },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};

export const getShiprocketTracking = async ({ awbCode, shipmentId, vendorId }) => {
  const token = await getShiprocketToken(vendorId);
  const trackingUrl = awbCode
    ? `https://apiv2.shiprocket.in/v1/external/courier/track/awb/${encodeURIComponent(awbCode)}`
    : `https://apiv2.shiprocket.in/v1/external/courier/track/shipment/${encodeURIComponent(shipmentId)}`;

  const response = await axios.get(trackingUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
