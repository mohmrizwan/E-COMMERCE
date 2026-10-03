import axios from "axios";

export const getShiprocketToken = async () => {
  try {
    const response = await axios.post(
      "https://apiv2.shiprocket.in/v1/external/auth/login",
      {
        email: process.env.SHIPROCKET_EMAIL,
        password: process.env.SHIPROCKET_PASSWORD,
      }
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

export const createShiprocketOrder = async (orderData) => {
  try {
    const token = await getShiprocketToken();

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

export const createShiprocketOrderFromOrder = async (orderData, pickupAddress) => {
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

    const token = await getShiprocketToken();

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

      billing_customer_name: orderData.shippingAddress.name,
      billing_last_name: "",

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

    return response.data;
  } catch (error) {
    console.log(
      "Shiprocket Order Error:",
      error.response?.data || error.message
    );

    throw error;
  }
};

export const getAvailableShiprocketCouriers = async ({
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

  const token = await getShiprocketToken();

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
  pickupPostcode,
  deliveryPostcode,
  weight,
  cod = 0,
  declaredValue,
}) => {
  const normalizedPickupPostcode = String(pickupPostcode || "").trim();
  const normalizedDeliveryPostcode = String(deliveryPostcode || "").trim();
  const courierCompanyId = String(
    process.env.SHIPROCKET_COURIER_ID || ""
  ).trim();

  if (!/^\d{6}$/.test(normalizedPickupPostcode)) {
    throw new Error("Vendor pickup address must have a valid six-digit pincode");
  }

  if (!/^\d{6}$/.test(normalizedDeliveryPostcode)) {
    throw new Error("Customer shipping address must have a valid six-digit pincode");
  }

  if (!/^\d+$/.test(courierCompanyId)) {
    throw new Error("SHIPROCKET_COURIER_ID must be configured");
  }

  const serviceability = await getAvailableShiprocketCouriers({
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
  const courier = couriers.find(
    (option) => String(option.courier_company_id) === courierCompanyId
  );

  if (!courier) {
    throw new Error("The configured Shiprocket courier is unavailable for this postcode");
  }

  const shippingAmount = Number(courier.rate ?? courier.freight_charge);

  if (!Number.isFinite(shippingAmount) || shippingAmount < 0) {
    throw new Error("Shiprocket did not return a valid delivery charge");
  }

  return {
    shippingAmount: Math.round(shippingAmount * 100) / 100,
    courierCompanyId,
    courierName: courier.courier_name || "",
    estimatedDelivery: courier.etd || courier.estimated_delivery_days || null,
    pickupPostcode: normalizedPickupPostcode,
    deliveryPostcode: normalizedDeliveryPostcode,
    weight,
  };
};

export const assignShiprocketCourier = async (shipmentId, courierCompanyId) => {
  const token = await getShiprocketToken();

  const response = await axios.post(
    "https://apiv2.shiprocket.in/v1/external/courier/assign/awb",
    {
      shipment_id: shipmentId,
      courier_id: courierCompanyId,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};

export const generateShiprocketPickup = async (shipmentId) => {
  const token = await getShiprocketToken();

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

export const getShiprocketTracking = async ({ awbCode, shipmentId }) => {
  const token = await getShiprocketToken();
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