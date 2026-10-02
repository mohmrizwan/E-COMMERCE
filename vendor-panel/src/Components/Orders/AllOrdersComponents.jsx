import React, { useState, useEffect } from "react";
import {
  CBadge,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormInput,
  CFormSelect,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from "@coreui/react";
import axios from "axios";
import CIcon from "@coreui/icons-react";
import { cilSearch, cilChevronBottom, cilChevronRight } from "@coreui/icons";
import ProductLoader from "../ProductLoader";

const API_URL = "https://ecommerceba-6dtt.onrender.com";

const Orders = () => {
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [orders, setOrders] = useState([]);
  const [courierOptions, setCourierOptions] = useState({});
  const [selectedCouriers, setSelectedCouriers] = useState({});
  const [trackingByOrder, setTrackingByOrder] = useState({});
  const [pickupPostcode, setPickupPostcode] = useState("");
  const [loadingOrderId, setLoadingOrderId] = useState("");
  const [notice, setNotice] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const getVendorConfig = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem("vendorToken")}`,
    },
  });

  const getMyOrders = async () => {
    try {
      const vendorToken = localStorage.getItem("vendorToken");

      const response = await axios.get(`${API_URL}/vendor/orders/myOrders`, {
        headers: {
          Authorization: `Bearer ${vendorToken}`,
        },
      });

      console.log("VENDOR ORDERS RESPONSE:", response.data);

      if (response.status === 200) {
        const backendOrders = response.data.orders || [];

        const formattedOrders = backendOrders.map((order) => {
          const vendorItems = order.items || [];

          const firstItem = vendorItems[0];

          const productNames = vendorItems
            .map((item) => item.productId?.name)
            .filter(Boolean)
            .join(", ");

          const totalItems = vendorItems.reduce(
            (total, item) => total + (item.quantity || 0),
            0,
          );

          const shippingAddress = order.shippingAddress || {};

          return {
            id: order._id,

            customer: shippingAddress.name || order.userId?.name || "Customer",

            email: order.userId?.email || shippingAddress.email || "N/A",

            phone: shippingAddress.phone || order.userId?.phone || "N/A",

            products: productNames || firstItem?.productId?.name || "Product",

            items: totalItems,

            total: `₹${order.totalAmount || 0}`,

            status: order.status || "Pending",

            date: order.createdAt
              ? new Date(order.createdAt).toLocaleDateString()
              : "N/A",

            payment: order.paymentStatus || "Pending",

            address: [
              shippingAddress.address,
              shippingAddress.city,
              shippingAddress.state,
              shippingAddress.pincode,
            ]
              .filter(Boolean)
              .join(", "),
            shipment: order.shipment || null,
          };
        });

        console.log("FORMATTED VENDOR ORDERS:", formattedOrders);

        setOrders(formattedOrders);
      }
    } catch (error) {
      console.error("Error fetching my orders:", error);
      console.log("Backend error:", error.response?.data);

      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getMyOrders();
  }, []);

  const toggleOrderDetails = (orderId) => {
    setExpandedOrderId((prev) => (prev === orderId ? null : orderId));
  };

  const runOrderAction = async (orderId, action, successMessage) => {
    setLoadingOrderId(orderId);
    setNotice("");

    try {
      await action();
      await getMyOrders();
      setNotice(successMessage);
    } catch (error) {
      setNotice(
        error.response?.data?.message || "Could not update this order.",
      );
    } finally {
      setLoadingOrderId("");
    }
  };

  const acceptOrder = (order) =>
    runOrderAction(
      order.id,
      () =>
        axios.patch(
          `${API_URL}/vendor/orders/accept/${order.id}`,
          {},
          getVendorConfig(),
        ),
      "Order accepted and shipment created.",
    );

  const markProcessing = (order) =>
    runOrderAction(
      order.id,
      () =>
        axios.patch(
          `${API_URL}/vendor/orders/processing/${order.id}`,
          {},
          getVendorConfig(),
        ),
      "Order marked as Processing.",
    );

  const loadCouriers = async (order) => {
    setLoadingOrderId(order.id);
    setNotice("");

    try {
      const response = await axios.get(
        `${API_URL}/vendor/orders/shipments/${order.shipment?._id || order.id}/couriers`,
        {
          ...getVendorConfig(),
          params: pickupPostcode ? { pickupPostcode } : undefined,
        },
      );
      setCourierOptions((current) => ({
        ...current,
        [order.id]: response.data.couriers || [],
      }));
    } catch (error) {
      setNotice(error.response?.data?.message || "Could not load couriers.");
    } finally {
      setLoadingOrderId("");
    }
  };

  const assignCourier = (order) =>
    runOrderAction(
      order.id,
      () =>
        axios.patch(
          `${API_URL}/vendor/orders/shipments/${order.shipment?._id || order.id}/courier`,
          { courierCompanyId: selectedCouriers[order.id] },
          getVendorConfig(),
        ),
      "Courier assigned and AWB generated.",
    );

  const shipOrder = (order) =>
    runOrderAction(
      order.id,
      () =>
        axios.post(
          `${API_URL}/vendor/orders/ship/${order.id}`,
          {},
          getVendorConfig(),
        ),
      "Pickup requested and order marked as Shipped.",
    );

  const loadTracking = async (order) => {
    setLoadingOrderId(order.id);
    setNotice("");

    try {
      const response = await axios.get(
        `${API_URL}/vendor/orders/shipments/${order.shipment?._id || order.id}/tracking`,
        getVendorConfig(),
      );
      setTrackingByOrder((current) => ({
        ...current,
        [order.id]: response.data.tracking,
      }));
    } catch (error) {
      setNotice(error.response?.data?.message || "Could not load tracking.");
    } finally {
      setLoadingOrderId("");
    }
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case "Delivered":
        return {
          badge: "bg-green-100 text-green-700",
          dot: "bg-green-600",
        };

      case "Processing":
        return {
          badge: "bg-blue-100 text-blue-700",
          dot: "bg-blue-600",
        };

      case "Shipped":
        return {
          badge: "bg-cyan-100 text-cyan-700",
          dot: "bg-cyan-600",
        };

      case "Cancelled":
        return {
          badge: "bg-red-100 text-red-700",
          dot: "bg-red-600",
        };

      default:
        return {
          badge: "bg-yellow-100 text-yellow-700",
          dot: "bg-yellow-600",
        };
    }
  };

  const isFinalStatus = (status) =>
    status === "Delivered" || status === "Cancelled";

  return (
    <div>
      {/* ================= Header ================= */}
      <div className="mb-4">
        <h3 className="fw-semibold mb-1">Orders</h3>

        <p className="text-body-secondary mb-0">
          Manage and track all customer orders
        </p>
      </div>

      {/* ================= Filters ================= */}
      <CCard className="border-0 shadow-sm mb-4">
        <CCardBody>
          <CRow className="g-3">
            <CCol md={6}>
              <div className="position-relative">
                <CIcon
                  icon={cilSearch}
                  className="position-absolute top-50 translate-middle-y ms-3 text-body-secondary"
                />

                <CFormInput
                  placeholder="Search by order ID or customer..."
                  className="ps-5"
                />
              </div>
            </CCol>

            <CCol md={3}>
              <CFormSelect>
                <option value="">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </CFormSelect>
            </CCol>

            <CCol md={3}>
              <CFormSelect>
                <option value="">All Dates</option>
                <option value="today">Today</option>
                <option value="7days">Last 7 Days</option>
                <option value="30days">Last 30 Days</option>
              </CFormSelect>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>

      {notice && (
        <div className="alert alert-info py-2" role="status">
          {notice}
        </div>
      )}

      {/* ================= Orders Table ================= */}
      <CCard className="border-0 shadow-sm">
        <CCardHeader className="bg-transparent border-0 px-4 py-3">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h5 className="fw-semibold mb-1">All Orders</h5>

              <small className="text-body-secondary">
                {orders.length} orders found
              </small>
            </div>
          </div>
        </CCardHeader>

        <CCardBody className="p-0">
          <CTable hover responsive align="middle" className="mb-0">
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell
                  className="ps-4"
                  style={{ width: "30px" }}
                ></CTableHeaderCell>

                <CTableHeaderCell className="text-body-secondary">
                  Order ID
                </CTableHeaderCell>

                <CTableHeaderCell className="text-body-secondary">
                  Customer
                </CTableHeaderCell>

                <CTableHeaderCell className="text-body-secondary">
                  Products
                </CTableHeaderCell>

                <CTableHeaderCell className="text-body-secondary">
                  Total
                </CTableHeaderCell>

                <CTableHeaderCell className="text-body-secondary">
                  Status
                </CTableHeaderCell>

                <CTableHeaderCell className="text-body-secondary">
                  Date
                </CTableHeaderCell>

                <CTableHeaderCell className="text-body-secondary">
                  Payment
                </CTableHeaderCell>
              </CTableRow>
            </CTableHead>

            <CTableBody>
              {isLoading && (
                <CTableRow>
                  <CTableDataCell colSpan={8} className="w-full p-0">
                    <ProductLoader />
                  </CTableDataCell>
                </CTableRow>
              )}
              {!isLoading && orders.length === 0 && (
                <CTableRow>
                  <CTableDataCell colSpan={8} className="py-4 text-center">
                    No orders found.
                  </CTableDataCell>
                </CTableRow>
              )}
              {!isLoading &&
                orders.map((order) => {
                  const isExpanded = expandedOrderId === order.id;

                  const statusStyle = getStatusStyles(order.status);

                  const locked = isFinalStatus(order.status);

                  return (
                    <React.Fragment key={order.id}>
                      {/* ===== Normal Row ===== */}

                      <CTableRow
                        onClick={() => toggleOrderDetails(order.id)}
                        className={`cursor-pointer transition-colors duration-200 border-l-[3px] ${
                          isExpanded
                            ? "bg-indigo-50 border-l-indigo-600"
                            : "border-l-transparent hover:bg-gray-50"
                        }`}
                      >
                        <CTableDataCell className="ps-4">
                          <CIcon
                            icon={
                              isExpanded ? cilChevronBottom : cilChevronRight
                            }
                            className={`transition-colors duration-200 ${
                              isExpanded ? "text-indigo-600" : "text-gray-400"
                            }`}
                          />
                        </CTableDataCell>

                        <CTableDataCell>
                          <span className="fw-semibold text-primary">
                            {order.id}
                          </span>
                        </CTableDataCell>

                        <CTableDataCell>
                          <div className="fw-semibold">{order.customer}</div>

                          <small className="text-body-secondary">
                            {order.email}
                          </small>
                        </CTableDataCell>

                        <CTableDataCell>
                          <div className="fw-medium">{order.products}</div>

                          <small className="text-body-secondary">
                            {order.items} items
                          </small>
                        </CTableDataCell>

                        <CTableDataCell>
                          <span className="fw-bold">{order.total}</span>
                        </CTableDataCell>

                        {/* ===== Status Cell ===== */}

                        <CTableDataCell>
                          <div
                            className="flex items-center gap-2"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <span
                              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${statusStyle.badge}`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`}
                              ></span>

                              {order.status}
                            </span>
                            {locked && (
                              <span className="text-xs text-gray-400 italic">
                                Final
                              </span>
                            )}
                          </div>
                        </CTableDataCell>

                        <CTableDataCell>
                          <span className="text-body-secondary">
                            {order.date}
                          </span>
                        </CTableDataCell>

                        <CTableDataCell>
                          <CBadge
                            color={
                              order.payment === "Paid" ? "success" : "warning"
                            }
                            shape="rounded-pill"
                          >
                            {order.payment}
                          </CBadge>
                        </CTableDataCell>
                      </CTableRow>

                      {/* ===== Expanded Row ===== */}

                      <CTableRow>
                        <CTableDataCell colSpan={8} className="p-0 border-0">
                          <div
                            className={`overflow-hidden transition-all duration-300 ease-in-out ${
                              isExpanded ? "max-h-[300px]" : "max-h-0"
                            }`}
                          >
                            <div className="bg-gray-50 border-t border-gray-200 px-6 py-5">
                              <CRow>
                                <CCol md={4}>
                                  <strong className="text-xs uppercase tracking-wide text-gray-500">
                                    Customer Info
                                  </strong>

                                  <p className="mb-1 mt-2">{order.customer}</p>

                                  <p className="mb-1 text-body-secondary">
                                    {order.email}
                                  </p>

                                  <p className="mb-0 text-body-secondary">
                                    {order.phone}
                                  </p>
                                </CCol>

                                <CCol md={4}>
                                  <strong className="text-xs uppercase tracking-wide text-gray-500">
                                    Shipping Address
                                  </strong>

                                  <p className="mb-0 mt-2 text-body-secondary">
                                    {order.address || "Address not available"}
                                  </p>
                                </CCol>

                                <CCol md={4}>
                                  <strong className="text-xs uppercase tracking-wide text-gray-500">
                                    Order Info
                                  </strong>

                                  <p className="mb-1 mt-2 text-body-secondary">
                                    Items: {order.items}
                                  </p>

                                  <p className="mb-1 text-body-secondary">
                                    Total: {order.total}
                                  </p>

                                  <p className="mb-0 text-body-secondary">
                                    Payment: {order.payment}
                                  </p>
                                </CCol>
                                <CCol md={12}>
                                  <div className="mt-3 border-top pt-3">
                                    <div className="d-flex flex-wrap gap-2">
                                      {order.status === "Pending" && (
                                        <button
                                          type="button"
                                          className="btn btn-sm btn-primary"
                                          disabled={loadingOrderId === order.id}
                                          onClick={() => acceptOrder(order)}
                                        >
                                          Accept order
                                        </button>
                                      )}
                                      {order.status === "Confirmed" && (
                                        <button
                                          type="button"
                                          className="btn btn-sm btn-primary"
                                          disabled={loadingOrderId === order.id}
                                          onClick={() => markProcessing(order)}
                                        >
                                          Mark Processing
                                        </button>
                                      )}
                                      {order.shipment && (
                                        <button
                                          type="button"
                                          className="btn btn-sm btn-outline-secondary"
                                          disabled={loadingOrderId === order.id}
                                          onClick={() => loadTracking(order)}
                                        >
                                          {loadingOrderId === order.id
                                            ? "Working..."
                                            : "Refresh tracking"}
                                        </button>
                                      )}
                                    </div>

                                    {order.shipment &&
                                      order.status !== "Shipped" && (
                                        <div className="mt-3">
                                          <div className="row g-2 align-items-end">
                                            <div className="col-md-4">
                                              <label
                                                className="form-label mb-1"
                                                htmlFor={`pickup-postcode-${order.id}`}
                                              >
                                                Pickup postcode
                                              </label>
                                              <CFormInput
                                                id={`pickup-postcode-${order.id}`}
                                                inputMode="numeric"
                                                maxLength={6}
                                                placeholder="Optional if server-configured"
                                                value={pickupPostcode}
                                                onChange={(event) =>
                                                  setPickupPostcode(
                                                    event.target.value.replace(
                                                      /\D/g,
                                                      "",
                                                    ),
                                                  )
                                                }
                                              />
                                            </div>
                                            <div className="col-md-auto">
                                              <button
                                                type="button"
                                                className="btn btn-sm btn-outline-primary"
                                                disabled={
                                                  loadingOrderId === order.id
                                                }
                                                onClick={() =>
                                                  loadCouriers(order)
                                                }
                                              >
                                                Get courier options
                                              </button>
                                            </div>
                                            {courierOptions[order.id]?.length >
                                              0 && (
                                              <>
                                                <div className="col-md-5">
                                                  <label
                                                    className="form-label mb-1"
                                                    htmlFor={`courier-${order.id}`}
                                                  >
                                                    Courier
                                                  </label>
                                                  <CFormSelect
                                                    id={`courier-${order.id}`}
                                                    value={
                                                      selectedCouriers[
                                                        order.id
                                                      ] || ""
                                                    }
                                                    onChange={(event) =>
                                                      setSelectedCouriers(
                                                        (current) => ({
                                                          ...current,
                                                          [order.id]:
                                                            event.target.value,
                                                        }),
                                                      )
                                                    }
                                                  >
                                                    <option value="">
                                                      Select courier
                                                    </option>
                                                    {courierOptions[
                                                      order.id
                                                    ].map((courier) => (
                                                      <option
                                                        key={
                                                          courier.courierCompanyId
                                                        }
                                                        value={
                                                          courier.courierCompanyId
                                                        }
                                                      >
                                                        {courier.courierName} ·{" "}
                                                        {courier.rate == null
                                                          ? "Rate unavailable"
                                                          : `₹${courier.rate}`}{" "}
                                                        ·{" "}
                                                        {courier.estimatedDelivery ||
                                                          "ETA unavailable"}
                                                      </option>
                                                    ))}
                                                  </CFormSelect>
                                                </div>
                                                <div className="col-md-auto">
                                                  <button
                                                    type="button"
                                                    className="btn btn-sm btn-outline-primary"
                                                    disabled={
                                                      loadingOrderId ===
                                                        order.id ||
                                                      !selectedCouriers[
                                                        order.id
                                                      ]
                                                    }
                                                    onClick={() =>
                                                      assignCourier(order)
                                                    }
                                                  >
                                                    Assign and generate AWB
                                                  </button>
                                                </div>
                                              </>
                                            )}
                                          </div>

                                          {order.shipment.awbCode && (
                                            <p className="mt-2 mb-0 small text-body-secondary">
                                              {order.shipment.courierName ||
                                                "Courier"}{" "}
                                              · AWB {order.shipment.awbCode}
                                            </p>
                                          )}

                                          {order.status === "Processing" &&
                                            order.shipment.awbCode &&
                                            order.shipment.courierCompanyId && (
                                              <button
                                                type="button"
                                                className="btn btn-sm btn-success mt-3"
                                                disabled={
                                                  loadingOrderId === order.id
                                                }
                                                onClick={() => shipOrder(order)}
                                              >
                                                Ship order
                                              </button>
                                            )}
                                        </div>
                                      )}

                                    {trackingByOrder[order.id] && (
                                      <div className="mt-3 rounded border p-3">
                                        <p className="mb-1 small">
                                          Status:{" "}
                                          <strong>
                                            {trackingByOrder[order.id]
                                              .currentStatus || order.status}
                                          </strong>
                                        </p>
                                        <p className="mb-1 small">
                                          Courier:{" "}
                                          {trackingByOrder[order.id]
                                            .courierName || "Not assigned"}{" "}
                                          · AWB{" "}
                                          {trackingByOrder[order.id].awbCode ||
                                            "Not assigned"}
                                        </p>
                                        {trackingByOrder[order.id]
                                          .estimatedDelivery && (
                                          <p className="mb-1 small">
                                            Estimated delivery:{" "}
                                            {
                                              trackingByOrder[order.id]
                                                .estimatedDelivery
                                            }
                                          </p>
                                        )}
                                        {trackingByOrder[order.id].history?.map(
                                          (event, index) => (
                                            <p
                                              key={`${event.date || event.activity || "event"}-${index}`}
                                              className="mb-0 small text-body-secondary"
                                            >
                                              {[
                                                event.activity || event.status,
                                                event.location,
                                                event.date,
                                              ]
                                                .filter(Boolean)
                                                .join(" · ")}
                                            </p>
                                          ),
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </CCol>
                              </CRow>
                            </div>
                          </div>
                        </CTableDataCell>
                      </CTableRow>
                    </React.Fragment>
                  );
                })}
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>
    </div>
  );
};

export default Orders;
