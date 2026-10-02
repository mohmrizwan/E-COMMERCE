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

export const createShiprocketOrderFromOrder = async (orderData) => {
  try {
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

      pickup_location: "Home",

      billing_customer_name: orderData.shippingAddress.name,
      billing_last_name: "",

      billing_address: orderData.shippingAddress.address,
      billing_address_2: "",

      billing_city: orderData.shippingAddress.city,
      billing_pincode: orderData.shippingAddress.pincode,
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
  const token = await getShiprocketToken();

  const response = await axios.get(
    "https://apiv2.shiprocket.in/v1/external/courier/serviceability/",
    {
      params: {
        shipment_id: shipmentId,
        pickup_postcode: pickupPostcode,
        delivery_postcode: deliveryPostcode,
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