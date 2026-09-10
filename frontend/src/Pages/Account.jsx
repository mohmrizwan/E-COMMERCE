import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import { products } from "../data/products";
import profileImage from "../assets/images/487509508_1755531745305108_3167500546364621181_n.jpg";
import { useForm } from "react-hook-form";

const menuItems = [
  { id: "profile", label: "Profile", icon: "fa-regular fa-user" },
  { id: "orders", label: "My Orders", icon: "fa-solid fa-box" },
  {
    id: "addresses",
    label: "Saved Addresses",
    icon: "fa-solid fa-location-dot",
  },
];

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

const initialProfile = {
  name: "Rizwan",
  email: "mohmrizwan10@gmail.com",
  phone: "+91 98264 80948",
  dateOfBirth: "02 December 2004",
  gender: "Male",
  address: "4 sector k green park colony dhar road",
};

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
  const [profile, setProfile] = useState(initialProfile);
  const [profileFormOpen, setProfileFormOpen] = useState(false);
  const [addressFormOpen, setAddressFormOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [notice, setNotice] = useState("");
  const [accountOrders, setAccountOrders] = useState(initialOrders);
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

  const cancelOrder = (orderId) => {
    setAccountOrders((items) =>
      items.map((order) =>
        order.id === orderId ? { ...order, status: "Cancelled" } : order,
      ),
    );
    setSelectedOrder(null);
    showNotice("Order cancelled successfully");
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

  const ProfileForm = () => {
    const {
      register,
      handleSubmit,
      formState: { errors },
    } = useForm({ defaultValues: profile });

    const onSubmit = (data) => {
      setProfile(data);
      setProfileFormOpen(false);
      showNotice("Profile details updated");
    };

    return (
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-5 grid gap-4 sm:grid-cols-2"
      >
        {[
          [
            "name",
            "Full Name",
            "text",
            "Your full name",
            {
              required: "Name is required",
              minLength: {
                value: 3,
                message: "Name must be at least 3 characters",
              },
            },
          ],
       
          [
            "phone",
            "Phone Number",
            "tel",
            "+91 00000 00000",
            {
              required: "Phone number is required",
              pattern: {
                value: /^\+?[0-9 ]{10,15}$/,
                message: "Enter a valid phone number",
              },
            },
          ],
          [
            "dateOfBirth",
            "Date of Birth",
            "text",
            "02 December 2004",
            { required: "Date of birth is required" },
          ],
        ].map(([name, label, type, placeholder, rules]) => (
          <label
            key={name}
            className="block text-sm font-semibold text-slate-700"
          >
            {label}
            <input
              type={type}
              placeholder={placeholder}
              className="mt-2 w-full rounded-lg border border-slate-200 px-3.5 py-3 text-sm font-normal outline-none focus:border-[#6C3BFF] focus:ring-4 focus:ring-[#eeeaff]"
              {...register(name, rules)}
            />
            {errors[name] && (
              <span className="mt-1 block text-xs font-normal text-rose-500">
                {errors[name].message}
              </span>
            )}
          </label>
        ))}
        
       
        <div className="flex gap-3 sm:col-span-2">
          <button
            type="submit"
            className="min-h-10 rounded-lg bg-[#6C3BFF] px-4 text-sm font-bold text-white hover:bg-[#5527d8]"
          >
            Save Details
          </button>
          <button
            type="button"
            onClick={() => setProfileFormOpen(false)}
            className="min-h-10 rounded-lg border border-slate-200 px-4 text-sm font-bold text-slate-700 hover:border-[#6C3BFF] hover:text-[#6C3BFF]"
          >
            Cancel
          </button>
        </div>
      </form>
    );
  };

  const AddressForm = () => {
    const {
      register,
      handleSubmit,
      formState: { errors },
    } = useForm({
      defaultValues: editingAddress || {
        type: "Home",
        name: profile.name,
        phone: profile.phone,
        address: "",
        city: "",
        state: "",
        pincode: "",
      },
    });

    const onSubmit = (data) => {
      if (editingAddress) {
        setAddresses((items) =>
          items.map((item) =>
            item.id === editingAddress.id ? { ...item, ...data } : item,
          ),
        );
        showNotice("Address updated");
      } else {
        setAddresses((items) => [
          ...items,
          { ...data, id: Date.now(), default: items.length === 0 },
        ]);
        showNotice("Address added");
      }
      setAddressFormOpen(false);
      setEditingAddress(null);
    };

    const fields = [
      [
        "name",
        "Full Name",
        "text",
        "Recipient name",
        {
          required: "Name is required",
          minLength: {
            value: 3,
            message: "Name must be at least 3 characters",
          },
        },
      ],
      [
        "phone",
        "Phone Number",
        "tel",
        "+91 00000 00000",
        {
          required: "Phone number is required",
          pattern: {
            value: /^\+?[0-9 ]{10,15}$/,
            message: "Enter a valid phone number",
          },
        },
      ],
      ["city", "City", "text", "City", { required: "City is required" }],
      ["state", "State", "text", "State", { required: "State is required" }],
      [
        "pincode",
        "Pincode",
        "text",
        "6-digit pincode",
        {
          required: "Pincode is required",
          pattern: {
            value: /^[0-9]{6}$/,
            message: "Enter a valid 6-digit pincode",
          },
        },
      ],
    ];

    return (
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mb-5 rounded-xl border border-[#d9ceff] bg-[#faf9ff] p-5 sm:p-7"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-bold text-slate-900">
              {editingAddress ? "Edit Address" : "Add Address"}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Enter a complete delivery address.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setAddressFormOpen(false);
              setEditingAddress(null);
            }}
            className="text-slate-400 hover:text-slate-700"
            aria-label="Close address form"
          >
            <i className="fa-solid fa-xmark" />
          </button>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-semibold text-slate-700">
            Address Type
            <select
              className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3.5 py-3 text-sm font-normal outline-none focus:border-[#6C3BFF] focus:ring-4 focus:ring-[#eeeaff]"
              {...register("type", { required: "Address type is required" })}
            >
              <option>Home</option>
              <option>Work</option>
              <option>Other</option>
            </select>
            {errors.type && (
              <span className="mt-1 block text-xs font-normal text-rose-500">
                {errors.type.message}
              </span>
            )}
          </label>
          {fields.map(([name, label, type, placeholder, rules]) => (
            <label
              key={name}
              className="block text-sm font-semibold text-slate-700"
            >
              {label}
              <input
                type={type}
                placeholder={placeholder}
                className="mt-2 w-full rounded-lg border border-slate-200 px-3.5 py-3 text-sm font-normal outline-none focus:border-[#6C3BFF] focus:ring-4 focus:ring-[#eeeaff]"
                {...register(name, rules)}
              />
              {errors[name] && (
                <span className="mt-1 block text-xs font-normal text-rose-500">
                  {errors[name].message}
                </span>
              )}
            </label>
          ))}
          <label className="block text-sm font-semibold text-slate-700 sm:col-span-2">
            Street Address
            <textarea
              rows="3"
              placeholder="House number, street and area"
              className="mt-2 w-full resize-y rounded-lg border border-slate-200 px-3.5 py-3 text-sm font-normal outline-none focus:border-[#6C3BFF] focus:ring-4 focus:ring-[#eeeaff]"
              {...register("address", {
                required: "Street address is required",
                minLength: {
                  value: 10,
                  message: "Address must be at least 10 characters",
                },
              })}
            />
            {errors.address && (
              <span className="mt-1 block text-xs font-normal text-rose-500">
                {errors.address.message}
              </span>
            )}
          </label>
        </div>
        <div className="mt-5 flex gap-3">
          <button
            type="submit"
            className="min-h-10 rounded-lg bg-[#6C3BFF] px-4 text-sm font-bold text-white hover:bg-[#5527d8]"
          >
            {editingAddress ? "Save Address" : "Add Address"}
          </button>
          <button
            type="button"
            onClick={() => {
              setAddressFormOpen(false);
              setEditingAddress(null);
            }}
            className="min-h-10 rounded-lg border border-slate-200 px-4 text-sm font-bold text-slate-700 hover:border-[#6C3BFF] hover:text-[#6C3BFF]"
          >
            Cancel
          </button>
        </div>
      </form>
    );
  };

  const Profile = () => (
    <>
      <PageIntro eyebrow="My account" heading="Welcome back, Aarav">
        Manage your profile, delivery details and shopping preferences.
      </PageIntro>

      <section className="mt-5 rounded-xl border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(26,37,63,0.04)] sm:p-7">
        <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h2 className="font-bold text-slate-900">Personal Details</h2>
            <p className="mt-1 text-sm text-slate-500">
              Your contact information and primary delivery address.
            </p>
          </div>
          <button
            onClick={() => setProfileFormOpen(true)}
            className="shrink-0 text-sm font-bold text-[#6C3BFF] hover:text-[#5126d1]"
          >
            Edit Details
          </button>
        </div>
        {profileFormOpen ? (
          <ProfileForm />
        ) : (
          <dl className="grid gap-x-8 gap-y-5 pt-5 text-sm sm:grid-cols-2 lg:grid-cols-3">
            {[
              ["Full Name", profile.name],
              ["Email Address", profile.email],
              ["Phone Number", profile.phone],
              ["Date of Birth", profile.dateOfBirth],
              ["Gender", profile.gender],
              ["Address", profile.address],
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
        )}
      </section>
    </>
  );

  const Orders = () => (
    <>
      <PageIntro eyebrow="Purchase history" heading="My Orders">
        Everything you have ordered from Vendora, in one place.
      </PageIntro>
      <div className="space-y-4">
        {accountOrders.map((order) => (
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
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3 sm:block sm:border-0 sm:pt-0 sm:text-right">
                <div>
                  <p className="text-xs text-slate-400">Total amount</p>
                  <p className="mt-1 font-bold text-slate-900">
                    {money(order.total)}
                  </p>
                </div>
                <div className="mt-3 flex flex-wrap justify-end gap-2">
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="min-h-10 rounded-lg border border-slate-200 px-3.5 text-sm font-bold text-slate-700 hover:border-[#6C3BFF] hover:text-[#6C3BFF]"
                  >
                    Track Order
                  </button>
                  {(order.status === "Processing" || order.status === "Shipped") && (
                    <button
                      onClick={() => cancelOrder(order.id)}
                      className="min-h-10 rounded-lg border border-rose-200 px-3.5 text-sm font-bold text-rose-600 hover:bg-rose-50"
                    >
                      Cancel Order
                    </button>
                  )}
                </div>
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
                {selectedOrder.status === "Cancelled"
                  ? `Your ${selectedOrder.product} order was cancelled.`
                  : `Your ${selectedOrder.product} order is currently ${selectedOrder.status.toLowerCase()}.`}
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-4">
                {["Processing", "Shipped", "Out for delivery", "Delivered"].map(
                  (step, index) => {
                    const statusOrder = {
                      Processing: 0,
                      Shipped: 1,
                      "Out for delivery": 2,
                      Delivered: 3,
                    };
                    const currentStep = statusOrder[selectedOrder.status];
                    const complete = selectedOrder.status !== "Cancelled" && currentStep >= index;
                    return (
                      <div key={step} className="flex items-center gap-2 text-xs font-semibold sm:block">
                        <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full ${complete ? "bg-[#6C3BFF] text-white" : "bg-slate-100 text-slate-400"}`}>
                          {complete ? <i className="fa-solid fa-check" /> : index + 1}
                        </span>
                        <span className={complete ? "text-slate-700" : "text-slate-400"}>{step}</span>
                      </div>
                    );
                  },
                )}
              </div>
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
          onClick={() => {
            setEditingAddress(null);
            setAddressFormOpen(true);
          }}
          className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-lg bg-[#6C3BFF] px-4 text-sm font-bold text-white hover:bg-[#5527d8]"
        >
          <i className="fa-solid fa-plus" /> Add Address
        </button>
      </div>
      {addressFormOpen && <AddressForm />}
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
              onClick={() => {
                setEditingAddress(address);
                setAddressFormOpen(true);
              }}
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
