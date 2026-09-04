import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import { products } from "../data/products";

const initialOrders = [
  {
    id: "VND-48291",
    date: "22 Aug 2026",
    product: "AeroGlide Pro Running Sneakers",
    quantity: 1,
    price: 999,
    total: 999,
    status: "Delivered",
    image: products[0].image,
    delivery: "Delivered on 27 Aug 2026",
  },
  {
    id: "VND-48157",
    date: "17 Aug 2026",
    product: "Auratone Studio Headphones",
    quantity: 1,
    price: 8999,
    total: 8999,
    status: "Processing",
    image: products[4].image,
    delivery: "Expected by 23 Aug 2026",
  },
  {
    id: "VND-47702",
    date: "08 Aug 2026",
    product: "Everyday Linen Overshirt",
    quantity: 2,
    price: 1599,
    total: 3198,
    status: "Shipped",
    image: products[7].image,
    delivery: "Expected by 20 Aug 2026",
  },
  {
    id: "VND-46218",
    date: "25 Jul 2026",
    product: "Classic Leather Crossbody",
    quantity: 1,
    price: 2399,
    total: 2399,
    status: "Cancelled",
    image: products[13].image,
    delivery: "Cancelled on 26 Jul 2026",
  },
];

const statusStyles = {
  Delivered: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  Processing: "bg-amber-50 text-amber-700 ring-amber-100",
  Shipped: "bg-sky-50 text-sky-700 ring-sky-100",
  Cancelled: "bg-rose-50 text-rose-700 ring-rose-100",
};

const tabs = ["All orders", "Processing", "Shipped", "Delivered", "Cancelled"];
const money = (value) => `Rs. ${value.toLocaleString("en-IN")}`;

const MyOrders = () => {
  const [orders, setOrders] = useState(initialOrders);
  const [activeTab, setActiveTab] = useState("All orders");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [notice, setNotice] = useState("");

  const filteredOrders = useMemo(
    () =>
      activeTab === "All orders"
        ? orders
        : orders.filter((order) => order.status === activeTab),
    [activeTab, orders],
  );

  const showNotice = (message) => {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 2600);
  };

  const cancelOrder = (order) => {
    setOrders((current) =>
      current.map((item) =>
        item.id === order.id
          ? { ...item, status: "Cancelled", delivery: "Cancellation requested" }
          : item,
      ),
    );
    setSelectedOrder({ ...order, status: "Cancelled" });
    showNotice(`Order ${order.id} has been cancelled.`);
  };

  const trackOrder = (order) => {
    setSelectedOrder(order);
    document.getElementById("order-details")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <Header />
      <main className="min-h-[70vh] bg-[#f7f8fc] py-8 font-[inter] sm:py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-center gap-2 text-xs text-slate-500">
            <Link to="/" className="hover:text-[#6C3BFF]">Home</Link>
            <i className="fa-solid fa-chevron-right text-[9px] text-slate-300" />
            <span>My Orders</span>
          </div>

          <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="mb-1 text-xs font-bold uppercase tracking-[0.16em] text-[#6C3BFF]">Purchase history</p>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">My Orders</h1>
              <p className="mt-2 text-sm text-slate-500">Track deliveries, review order details, or cancel an eligible order.</p>
            </div>
            <Link to="/products" className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-[#6C3BFF] px-4 text-sm font-bold text-white hover:bg-[#5527d8]">
              <i className="fa-solid fa-bag-shopping" /> Continue shopping
            </Link>
          </div>

          <div className="mb-5 flex gap-2 overflow-x-auto border-b border-slate-200" role="tablist" aria-label="Order status filters">
            {tabs.map((tab) => (
              <button
                key={tab}
                type="button"
                role="tab"
                aria-selected={activeTab === tab}
                onClick={() => setActiveTab(tab)}
                className={`whitespace-nowrap border-b-2 px-3 py-3 text-sm font-bold transition ${activeTab === tab ? "border-[#6C3BFF] text-[#6C3BFF]" : "border-transparent text-slate-400 hover:text-slate-700"}`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <article key={order.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-[0_8px_24px_rgba(26,37,63,0.035)] sm:p-5">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3.5">
                  <div>
                    <p className="text-sm font-bold text-slate-800">Order {order.id}</p>
                    <p className="mt-1 text-xs text-slate-500">Placed on {order.date}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-bold ring-1 ${statusStyles[order.status]}`}>{order.status}</span>
                </div>

                <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center">
                  <img src={order.image} alt={order.product} className="h-20 w-20 rounded-lg border border-slate-100 object-cover" />
                  <div className="min-w-0 flex-1">
                    <h2 className="font-bold text-slate-800">{order.product}</h2>
                    <p className="mt-1 text-sm text-slate-500">Quantity: {order.quantity} <span className="mx-2 text-slate-300">|</span> {money(order.price)} each</p>
                    <p className="mt-2 text-xs font-semibold text-slate-500"><i className="fa-solid fa-truck mr-2 text-[#6C3BFF]" />{order.delivery}</p>
                  </div>
                  <div className="flex items-center justify-between gap-5 border-t border-slate-100 pt-3 sm:block sm:border-0 sm:pt-0 sm:text-right">
                    <div><p className="text-xs text-slate-400">Total amount</p><p className="mt-1 font-bold text-slate-900">{money(order.total)}</p></div>
                    <div className="mt-3 flex gap-2 sm:justify-end">
                      <button type="button" onClick={() => setSelectedOrder(order)} className="min-h-9 rounded-lg border border-slate-200 px-3 text-xs font-bold text-slate-700 hover:border-[#6C3BFF] hover:text-[#6C3BFF]">Details</button>
                      {order.status !== "Cancelled" && order.status !== "Delivered" && <button type="button" onClick={() => trackOrder(order)} className="min-h-9 rounded-lg bg-[#6C3BFF] px-3 text-xs font-bold text-white hover:bg-[#5527d8]">Track</button>}
                      {order.status === "Processing" && <button type="button" onClick={() => cancelOrder(order)} className="min-h-9 rounded-lg border border-rose-200 px-3 text-xs font-bold text-rose-600 hover:bg-rose-50">Cancel</button>}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {!filteredOrders.length && <div className="rounded-xl border border-dashed border-slate-300 bg-white py-14 text-center text-sm text-slate-500">No orders in this category.</div>}

          {selectedOrder && (
            <section id="order-details" className="mt-6 rounded-xl border border-[#d9ceff] bg-white p-5 shadow-[0_8px_24px_rgba(26,37,63,0.035)] sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div><p className="text-xs font-bold uppercase tracking-[0.14em] text-[#6C3BFF]">Order details</p><h2 className="mt-1 text-lg font-bold text-slate-900">{selectedOrder.id}</h2></div>
                <button type="button" onClick={() => setSelectedOrder(null)} aria-label="Close order details" className="text-slate-400 hover:text-slate-700"><i className="fa-solid fa-xmark" /></button>
              </div>
              <div className="mt-5 grid gap-4 sm:grid-cols-3">
                {["Order placed", "Packed & shipped", "Delivered"].map((step, index) => {
                  const complete = selectedOrder.status === "Delivered" || (selectedOrder.status === "Shipped" && index < 2) || (selectedOrder.status === "Processing" && index === 0);
                  return <div key={step} className={`rounded-lg border p-3 ${complete ? "border-emerald-100 bg-emerald-50" : "border-slate-100 bg-slate-50"}`}><i className={`fa-solid ${complete ? "fa-circle-check text-emerald-600" : "fa-circle text-slate-300"}`} /><p className="mt-2 text-sm font-bold text-slate-700">{step}</p><p className="mt-1 text-xs text-slate-500">{complete ? "Complete" : "Upcoming"}</p></div>;
                })}
              </div>
              <p className="mt-4 text-sm text-slate-500">Current status: <strong className="text-slate-800">{selectedOrder.status}</strong></p>
            </section>
          )}
        </div>
      </main>
      {notice && <div role="status" className="fixed bottom-5 right-5 z-60 max-w-[calc(100vw-2.5rem)] rounded-lg bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-xl">{notice}</div>}
      <Footer />
    </>
  );
};

export default MyOrders;