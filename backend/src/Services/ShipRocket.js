import axios from "axios";
import { getVendorShippingConfig } from "./VendorIntegrationConfig.js";

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

export const getShiprocketToken = async (vendorId) => {
  try {
    const credentials = await getVendorShippingConfig(vendorId);
    const response = await axios.post(
      "https://apiv2.shiprocket.in/v1/external/auth/login",
      credentials,
    );

    return response.data.token;
  } catch (error) {
    console.log(
      "Shiprocket Login Error:",
      error.response?.data || error.message
    );

    throw error;
  }
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
    console.log(
      "Shiprocket Create Order Error:",
      error.response?.data || error.message
    );

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

      length: 10,
      breadth: 10,
      height: 10,
      weight: 0.5,
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

    console.log("Shiprocket create-order raw response", {
      httpStatus: response.status,
      responseData: response.data,
    });

    const normalizedResponse = normalizeShiprocketOrderResponse(response.data);
    console.log("Shiprocket create-order normalized IDs", {
      order_id: normalizedResponse.order_id,
      shipment_id: normalizedResponse.shipment_id,
    });

    return {
      ...normalizedResponse,
      rawResponse: response.data,
    };
  } catch (error) {
    console.log("Shiprocket create-order HTTP error", {
      httpStatus: error.response?.status,
      responseData: error.response?.data,
      message: error.message,
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
  cod,
  declaredValue,
}) => {
  const normalizedPickupPostcode = String(pickupPostcode || "").trim();
  const normalizedDeliveryPostcode = String(deliveryPostcode || "").trim();

  if (!/^\d{6}$/.test(normalizedPickupPostcode)) {
    throw new Error("Vendor pickup address must have a valid six-digit pincode");
  }

  if (!/^\d{6}$/.test(normalizedDeliveryPostcode)) {
    throw new Error("Customer shipping address must have a valid six-digit pincode");
  }

  const token = await getShiprocketToken(vendorId);

  const response = await axios.get(
    "https://apiv2.shiprocket.in/v1/external/courier/serviceability/",
    {
      params: {
        shipment_id: shipmentId,
        pickup_postcode: normalizedPickupPostcode,
        delivery_postcode: normalizedDeliveryPostcode,
        weight,
        cod,
        declared_value: declaredValue,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const getShiprocketShippingQuote = async ({
  vendorId,
  pickupPostcode,
  deliveryPostcode,
  weight,
  cod = 0,
  declaredValue,
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
    cod,
    declaredValue,
  });
  const couriers =
    serviceability.data?.available_courier_companies ||
    serviceability.available_courier_companies ||
    [];
  const serviceableCouriers = couriers
    .map((option) => ({
      option,
      courierCompanyId: String(option.courier_company_id || ""),
      shippingAmount: Number(option.rate ?? option.freight_charge),
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
    throw new Error("Shiprocket returned no serviceable couriers with valid rates for this route");
  }

  return {
    shippingAmount: Math.round(courier.shippingAmount * 100) / 100,
    courierCompanyId: courier.courierCompanyId,
    courierName: courier.option.courier_name || "",
    estimatedDelivery:
      courier.option.etd || courier.option.estimated_delivery_days || null,
    pickupPostcode: normalizedPickupPostcode,
    deliveryPostcode: normalizedDeliveryPostcode,
    weight,
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

  console.log("Shiprocket assign-AWB request", {
    endpoint,
    payload,
  });

  try {
    const response = await axios.post(endpoint, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    console.log("Shiprocket assign-AWB HTTP error", {
      endpoint,
      payload,
      httpStatus: error.response?.status,
      responseBody: error.response?.data,
      message: error.message,
      details:
        error.response?.data?.errors ||
        error.response?.data?.details ||
        error.response?.data?.error,
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
