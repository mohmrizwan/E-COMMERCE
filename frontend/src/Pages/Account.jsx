import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import { products } from "../data/products";
import profileImage from "../assets/images/487509508_1755531745305108_3167500546364621181_n.jpg";

const menuItems = [
  { id: "profile", label: "Profile", icon: "fa-regular fa-user" },
  { id: "orders", label: "My Orders", icon: "fa-solid fa-box" },
  {
    id: "addresses",
    label: "Saved Addresses",
    icon: "fa-solid fa-location-dot",
  },
  { id: "settings", label: "Account Settings", icon: "fa-solid fa-gear" },
];

const orders = [
  {
    id: "VND-48291",
    date: "22 Aug 2026",
    product: "AeroGlide Pro Running Sneakers",
    quantity: 1,
    price: 999,
    total: 999,
    status: "Delivered",
    image: products[0].image,
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
  },
];

const statusStyles = {
  Delivered: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  Processing: "bg-amber-50 text-amber-700 ring-amber-100",
  Shipped: "bg-sky-50 text-sky-700 ring-sky-100",
  Cancelled: "bg-rose-50 text-rose-700 ring-rose-100",
};

const initialAddresses = [
  {
    id: 1,
    type: "Home",
    name: "Rizwan",
    phone: "+91 98264 80948",
    address: "4 sector k green park colony dhar road",
    city: "Indore",
    state: "Madhya Pradesh",
    pincode: "452002",
    default: true,
  },
 
];

const money = (value) => `Rs. ${value.toLocaleString("en-IN")}`;

const Account = () => {
  const [active, setActive] = useState("profile");
  const [favourites, setFavourites] = useState([
    products[0],
    products[4],
    products[7],
    products[13],
  ]);
  const [addresses, setAddresses] = useState(initialAddresses);
  const [notice, setNotice] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [preferences, setPreferences] = useState({
    orders: true,
    offers: true,
    profile: false,
  });

  const title = useMemo(
    () => menuItems.find((item) => item.id === active)?.label ?? "Profile",
    [active],
  );
  const showNotice = (message) => {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 2600);
  };

  const deleteAddress = (id) => {
    setAddresses((items) => items.filter((address) => address.id !== id));
    showNotice("Address removed");
  };

  const navClass = (id) =>
    `flex min-w-max items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold transition-colors ${active === id ? "bg-[#6C3BFF] text-white shadow-sm shadow-[#6C3BFF]/20" : "text-slate-600 hover:bg-[#f4f1ff] hover:text-[#6C3BFF]"}`;

  const PageIntro = ({ eyebrow, heading, children }) => (
    <div className="mb-6">
      <p className="mb-1 text-xs font-bold uppercase tracking-[0.16em] text-[#6C3BFF]">
        {eyebrow}
      </p>
      <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
        {heading}
      </h1>
      {children && (
        <p className="mt-2 text-sm leading-6 text-slate-500">{children}</p>
      )}
    </div>
  );

  const Profile = () => (
    <>
      <PageIntro eyebrow="My account" heading="Welcome back, Aarav">
        Manage your profile, delivery details and shopping preferences.
      </PageIntro>
      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_10px_30px_rgba(26,37,63,0.04)]">
        <div className="h-24 bg-[#f2eeff] sm:h-28" />
        <div className="relative px-5 pb-6 sm:px-7">
          <img
            src={profileImage}
            alt="Aarav Sharma"
            className="absolute -top-12 h-24 w-24 rounded-full border-4 border-white object-cover shadow-md sm:-top-14 sm:h-28 sm:w-28"
          />
          <div className="flex flex-col gap-5 pt-16 sm:flex-row sm:items-end sm:justify-between sm:pt-17">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Rizwan</h2>
              <div className="mt-2 flex flex-col gap-1 text-sm text-slate-500 sm:flex-row sm:gap-4">
                <span>
                  <i className="fa-regular fa-envelope mr-2 text-[#6C3BFF]" />
                  mohmrizwan10@gmail.com
                </span>
                <span>
                  <i className="fa-solid fa-phone mr-2 text-[#6C3BFF]" />
                  +91 98264 80948
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-5 rounded-xl border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(26,37,63,0.04)] sm:p-7">
        <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h2 className="font-bold text-slate-900">Personal Details</h2>
            <p className="mt-1 text-sm text-slate-500">
              Your contact information and primary delivery address.
            </p>
          </div>
          <button
            onClick={() => showNotice("Personal details are ready to edit.")}
            className="shrink-0 text-sm font-bold text-[#6C3BFF] hover:text-[#5126d1]"
          >
            Edit Details
          </button>
        </div>
        <dl className="grid gap-x-8 gap-y-5 pt-5 text-sm sm:grid-cols-2 lg:grid-cols-3">
          {[
            ["Full Name", "Rizwan"],
            ["Email Address", "mohmrizwan10.com"],
            ["Phone Number", "+91 9826480948 "],
            ["Date of Birth", "02 December 2004"],
            ["Gender", "Male"],
            ["Address", "B-204, Palm Grove, Bengaluru, 560034"],
          ].map(([label, value]) => (
            <div key={label}>
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                {label}
              </dt>
              <dd className="mt-1.5 font-medium leading-5 text-slate-700">
                {value}
              </dd>
            </div>
          ))}
        </dl>
      </section>
    </>
  );

  const Orders = () => (
    <>
      <PageIntro eyebrow="Purchase history" heading="My Orders">
        Everything you have ordered from Vendora, in one place.
      </PageIntro>
      <div className="space-y-4">
        {orders.map((order) => (
          <article
            key={order.id}
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-[0_8px_24px_rgba(26,37,63,0.035)] sm:p-5"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3.5">
              <div>
                <p className="text-sm font-bold text-slate-800">
                  Order {order.id}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Placed on {order.date}
                </p>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-bold ring-1 ${statusStyles[order.status]}`}
              >
                {order.status}
              </span>
            </div>
            <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center">
              <img
                src={order.image}
                alt=""
                className="h-20 w-20 rounded-lg border border-slate-100 object-cover"
              />
              <div className="min-w-0 flex-1">
                <h2 className="font-bold text-slate-800">{order.product}</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Quantity: {order.quantity}{" "}
                  <span className="mx-2 text-slate-300">|</span>{" "}
                  {money(order.price)} each
                </p>
              </div>
              <div className="flex items-center justify-between gap-4 border-t border-slate-100 pt-3 sm:block sm:border-0 sm:pt-0 sm:text-right">
                <div>
                  <p className="text-xs text-slate-400">Total amount</p>
                  <p className="mt-1 font-bold text-slate-900">
                    {money(order.total)}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedOrder(order)}
                  className="min-h-10 rounded-lg border border-slate-200 px-3.5 text-sm font-bold text-slate-700 hover:border-[#6C3BFF] hover:text-[#6C3BFF]"
                >
                  View Details
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
      {selectedOrder && (
        <div className="mt-5 rounded-xl border border-[#d9ceff] bg-[#faf9ff] p-4 text-sm text-slate-600">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-bold text-slate-800">
                {selectedOrder.id} order update
              </p>
              <p className="mt-1">
                Your {selectedOrder.product} is marked as{" "}
                <strong>{selectedOrder.status}</strong>.
              </p>
            </div>
            <button
              onClick={() => setSelectedOrder(null)}
              className="text-slate-400 hover:text-slate-700"
              aria-label="Close order details"
            >
              <i className="fa-solid fa-xmark" />
            </button>
          </div>
        </div>
      )}
    </>
  );

  const Addresses = () => (
    <>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <PageIntro eyebrow="Delivery details" heading="Saved Addresses">
          Choose where your Vendora orders should arrive.
        </PageIntro>
        <button
          onClick={() =>
            showNotice(
              "Address form will open here when connected to your API.",
            )
          }
          className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-lg bg-[#6C3BFF] px-4 text-sm font-bold text-white hover:bg-[#5527d8]"
        >
          <i className="fa-solid fa-plus" /> Add Address
        </button>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {addresses.map((address) => (
          <article
            key={address.id}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-[0_8px_24px_rgba(26,37,63,0.035)]"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-[#f1edff] px-2.5 py-1 text-xs font-bold text-[#6C3BFF]">
                  {address.type}
                </span>
                {address.default && (
                  <span className="text-xs font-semibold text-emerald-600">
                    Default
                  </span>
                )}
              </div>
              <button
                onClick={() => deleteAddress(address.id)}
                className="grid h-8 w-8 place-items-center rounded-md text-slate-400 hover:bg-rose-50 hover:text-rose-500"
                aria-label={`Delete ${address.type} address`}
              >
                <i className="fa-regular fa-trash-can" />
              </button>
            </div>
            <h2 className="mt-5 font-bold text-slate-800">{address.name}</h2>
            <p className="mt-1 text-sm text-slate-500">{address.phone}</p>
            <address className="mt-3 not-italic text-sm leading-6 text-slate-600">
              {address.address}
              <br />
              {address.city}, {address.state} - {address.pincode}
            </address>
            <button
              onClick={() =>
                showNotice(
                  "Address editor will open here when connected to your API.",
                )
              }
              className="mt-5 text-sm font-bold text-[#6C3BFF] hover:text-[#5126d1]"
            >
              <i className="fa-regular fa-pen-to-square mr-2" />
              Edit Address
            </button>
          </article>
        ))}
      </div>
      {!addresses.length && (
        <div className="mt-4 rounded-xl border border-dashed border-slate-300 bg-white py-12 text-center text-sm text-slate-500">
          No saved addresses yet.
        </div>
      )}
    </>
  );

  const Settings = () => (
    <>
      <PageIntro eyebrow="Account control" heading="Account Settings">
        Control how Vendora contacts you and uses your account data.
      </PageIntro>
      <div className="space-y-4">
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-[0_8px_24px_rgba(26,37,63,0.035)]">
          <h2 className="font-bold text-slate-800">Password & security</h2>
          <p className="mt-1 text-sm text-slate-500">
            Keep your account protected with a unique password.
          </p>
          <button
            onClick={() => showNotice("Password update flow will open here.")}
            className="mt-4 min-h-10 rounded-lg border border-slate-200 px-4 text-sm font-bold text-slate-700 hover:border-[#6C3BFF] hover:text-[#6C3BFF]"
          >
            Change Password
          </button>
        </section>
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-[0_8px_24px_rgba(26,37,63,0.035)]">
          <h2 className="font-bold text-slate-800">Email & notifications</h2>
          <div className="mt-4 divide-y divide-slate-100">
            {[
              [
                "orders",
                "Order updates",
                "Delivery progress, returns and payment updates.",
              ],
              [
                "offers",
                "Offers & recommendations",
                "New arrivals, saved-item price drops and special deals.",
              ],
            ].map(([key, heading, copy]) => (
              <label
                key={key}
                className="flex cursor-pointer items-center justify-between gap-5 py-4 first:pt-0"
              >
                <span>
                  <span className="block text-sm font-semibold text-slate-700">
                    {heading}
                  </span>
                  <span className="mt-1 block text-sm leading-5 text-slate-500">
                    {copy}
                  </span>
                </span>
                <input
                  type="checkbox"
                  checked={preferences[key]}
                  onChange={() =>
                    setPreferences((current) => ({
                      ...current,
                      [key]: !current[key],
                    }))
                  }
                  className="h-5 w-5 shrink-0 accent-[#6C3BFF]"
                />
              </label>
            ))}
          </div>
        </section>
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-[0_8px_24px_rgba(26,37,63,0.035)]">
          <h2 className="font-bold text-slate-800">Privacy</h2>
          <label className="mt-4 flex cursor-pointer items-center justify-between gap-5">
            <span>
              <span className="block text-sm font-semibold text-slate-700">
                Personalised shopping
              </span>
              <span className="mt-1 block text-sm leading-5 text-slate-500">
                Use your browsing activity to personalise products and offers.
              </span>
            </span>
            <input
              type="checkbox"
              checked={preferences.profile}
              onChange={() =>
                setPreferences((current) => ({
                  ...current,
                  profile: !current.profile,
                }))
              }
              className="h-5 w-5 shrink-0 accent-[#6C3BFF]"
            />
          </label>
        </section>
        <section className="rounded-xl border border-rose-100 bg-rose-50/50 p-5">
          <h2 className="font-bold text-slate-800">Sign out</h2>
          <p className="mt-1 text-sm text-slate-500">
            End your current Vendora session on this device.
          </p>
          <Link
            to="/login"
            className="mt-4 inline-flex min-h-10 items-center rounded-lg border border-rose-200 px-4 text-sm font-bold text-rose-600 hover:bg-rose-100"
          >
            Logout
          </Link>
        </section>
      </div>
    </>
  );

  return (
    <>
      <Header />
      <main className="min-h-[70vh] bg-[#f7f8fc] py-7 font-[inter] sm:py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-5 flex items-center gap-2 text-xs text-slate-500">
            <Link to="/" className="hover:text-[#6C3BFF]">
              Home
            </Link>
            <i className="fa-solid fa-chevron-right text-[9px] text-slate-300" />
            <span>{title}</span>
          </div>
          <div className="lg:grid lg:grid-cols-[238px_minmax(0,1fr)] lg:gap-8">
            <aside className="mb-6 lg:mb-0">
              <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_10px_30px_rgba(26,37,63,0.04)] lg:sticky lg:top-5">
                <div className="hidden items-center gap-3 border-b border-slate-100 p-4 lg:flex">
                  <img
                    src={profileImage}
                    alt="Aarav Sharma"
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-slate-800">
                      Aarav Sharma
                    </p>
                    <p className="truncate text-xs text-slate-500">
                      aarav.sharma@email.com
                    </p>
                  </div>
                </div>
                <nav className="flex gap-2 overflow-x-auto p-2 lg:block lg:space-y-1 lg:overflow-visible lg:p-3">
                  {menuItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActive(item.id)}
                      className={navClass(item.id)}
                    >
                      <i className={`${item.icon} w-4 text-center`} />
                      <span>{item.label}</span>
                    </button>
                  ))}
                  <Link
                    to="/login"
                    className="flex min-w-max items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold text-rose-500 transition hover:bg-rose-50 lg:mt-2"
                  >
                    <i className="fa-solid fa-arrow-right-from-bracket w-4 text-center" />
                    Logout
                  </Link>
                </nav>
              </div>
            </aside>
            <section className="min-w-0">
              {active === "profile" && <Profile />}
              {active === "orders" && <Orders />}
              {active === "favourites" && <Favourites />}
              {active === "addresses" && <Addresses />}
              {active === "settings" && <Settings />}
            </section>
          </div>
        </div>
      </main>
      {notice && (
        <div
          role="status"
          className="fixed bottom-5 right-5 z-[60] max-w-[calc(100vw-2.5rem)] rounded-lg bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-xl"
        >
          {notice}
        </div>
      )}
      <Footer />
    </>
  );
};

export default Account;
