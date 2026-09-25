import { useState } from "react";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import { products } from "../data/products";

const API_URL = "https://ecommerceba-6dtt.onrender.com";

// simple function to get auth header, using token from localStorage
const getAuthConfig = () => {
  return {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("userToken"),
    },
  };
};

const menuItems = [
  { id: "profile", label: "Profile", icon: "fa-regular fa-user" },
  { id: "orders", label: "My Orders", icon: "fa-solid fa-box" },
  {
    id: "addresses",
    label: "Saved Addresses",
    icon: "fa-solid fa-location-dot",
  },
];

// empty starting values, real data will come from backend after page loads
const profileDefaults = {
  name: "",
  email: "",
  phone: "",
  dateOfBirth: "",
  gender: "",
  address: "",
};

const addressDefaults = [];

const orderDefaults = [];

const statusStyles = {
  Delivered: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  Processing: "bg-amber-50 text-amber-700 ring-amber-100",
  Shipped: "bg-sky-50 text-sky-700 ring-sky-100",
  Cancelled: "bg-rose-50 text-rose-700 ring-rose-100",
};

const inputClass =
  "mt-2 w-full rounded-lg border border-slate-200 px-3.5 py-3 text-sm outline-none focus:border-[#6C3BFF] focus:ring-4 focus:ring-[#eeeaff]";

const money = (value) => {
  if (!value) return "Rs. 0";
  return "Rs. " + value.toLocaleString("en-IN");
};

function PageIntro({ eyebrow, title, children }) {
  return (
    <div className="mb-6">
      <p className="mb-1 text-xs font-bold uppercase tracking-[0.16em] text-[#6C3BFF]">
        {eyebrow}
      </p>
      <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
        {title}
      </h1>
      {children && (
        <p className="mt-2 text-sm leading-6 text-slate-500">{children}</p>
      )}
    </div>
  );
}

function Field({ label, value, onChange, type = "text", required = true }) {
  return (
    <label className="block text-sm font-semibold text-slate-700">
      {label}
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={inputClass}
        required={required}
      />
    </label>
  );
}

function ProfilePage({ profile, editing, onEdit, onSave, onCancel }) {
  const [form, setForm] = useState(profile);

  useEffect(() => {
    setForm(profile);
  }, [profile]);

  const update = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  return (
    <>
      <PageIntro eyebrow="My account" title={`Welcome back, ${profile.name || "User"}`}>
        Manage your profile and delivery details.
      </PageIntro>
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(26,37,63,0.04)] sm:p-7">
        <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h2 className="font-bold text-slate-900">Personal Details</h2>
            <p className="mt-1 text-sm text-slate-500">
              Your contact information.
            </p>
          </div>
          {!editing && (
            <button
              onClick={onEdit}
              className="text-sm font-bold text-[#6C3BFF]"
            >
              Edit Details
            </button>
          )}
        </div>
        {editing ? (
          <form
            onSubmit={(event) => {
              event.preventDefault();
              onSave(form);
            }}
            className="mt-5 grid gap-4 sm:grid-cols-2"
          >
            <Field
              label="Full Name"
              value={form.name}
              onChange={(value) => update("name", value)}
            />
            <Field
              label="Phone Number"
              type="tel"
              value={form.phone}
              onChange={(value) => update("phone", value)}
            />
            <Field
              label="Date of Birth"
              value={form.dateOfBirth}
              onChange={(value) => update("dateOfBirth", value)}
            />
            <Field
              label="Gender"
              value={form.gender}
              onChange={(value) => update("gender", value)}
            />
            <label className="block text-sm font-semibold text-slate-700 sm:col-span-2">
              Address
              <textarea
                rows="3"
                value={form.address}
                onChange={(event) => update("address", event.target.value)}
                className={inputClass}
                required
              />
            </label>
            <div className="flex gap-3 sm:col-span-2">
              <button
                type="submit"
                className="min-h-10 rounded-lg bg-[#6C3BFF] px-4 text-sm font-bold text-white"
              >
                Save Details
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="min-h-10 rounded-lg border border-slate-200 px-4 text-sm font-bold text-slate-700"
              >
                Cancel
              </button>
            </div>
          </form>
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
                  {value || "-"}
                </dd>
              </div>
            ))}
          </dl>
        )}
      </section>
    </>
  );
}

function AddressForm({ address, profile, onSave, onCancel }) {
  const [form, setForm] = useState(
    address || {
      type: "Home",
      name: profile.name,
      phone: profile.phone,
      address: "",
      city: "",
      state: "",
      pincode: "",
    },
  );
  const update = (field, value) => {
    setForm({ ...form, [field]: value });
  };
  const fields = [
    ["name", "Full Name"],
    ["phone", "Phone Number"],
    ["city", "City"],
    ["state", "State"],
    ["pincode", "Pincode"],
  ];

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSave(form);
      }}
      className="mb-5 rounded-xl border border-[#d9ceff] bg-[#faf9ff] p-5 sm:p-7"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-bold text-slate-900">
            {address ? "Edit Address" : "Add Address"}
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Enter a complete delivery address.
          </p>
        </div>
        <button
          type="button"
          onClick={onCancel}
          aria-label="Close address form"
          className="text-slate-400"
        >
          <i className="fa-solid fa-xmark" />
        </button>
      </div>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-semibold text-slate-700">
          Address Type
          <select
            value={form.type}
            onChange={(event) => update("type", event.target.value)}
            className={`${inputClass} bg-white`}
          >
            <option>Home</option>
            <option>Work</option>
            <option>Other</option>
          </select>
        </label>
        {fields.map(([field, label]) => (
          <Field
            key={field}
            label={label}
            type={field === "phone" ? "tel" : "text"}
            value={form[field]}
            onChange={(value) => update(field, value)}
          />
        ))}
        <label className="block text-sm font-semibold text-slate-700 sm:col-span-2">
          Street Address
          <textarea
            rows="3"
            value={form.address}
            onChange={(event) => update("address", event.target.value)}
            className={inputClass}
            required
          />
        </label>
      </div>
      <div className="mt-5 flex gap-3">
        <button
          type="submit"
          className="min-h-10 rounded-lg bg-[#6C3BFF] px-4 text-sm font-bold text-white"
        >
          {address ? "Save Address" : "Add Address"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="min-h-10 rounded-lg border border-slate-200 px-4 text-sm font-bold text-slate-700"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

function AddressesPage({
  addresses,
  profile,
  addressFormOpen,
  editingAddress,
  onAdd,
  onEdit,
  onDelete,
  onSave,
  onCancel,
}) {
  return (
    <>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <PageIntro eyebrow="Delivery details" title="Saved Addresses">
          Choose where your Vendora orders should arrive.
        </PageIntro>
        <button
          onClick={onAdd}
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-[#6C3BFF] px-4 text-sm font-bold text-white"
        >
          <i className="fa-solid fa-plus" /> Add Address
        </button>
      </div>
      {addressFormOpen && (
        <AddressForm
          key={editingAddress?._id || "new-address"}
          address={editingAddress}
          profile={profile}
          onSave={onSave}
          onCancel={onCancel}
        />
      )}
      <div className="grid gap-4 lg:grid-cols-2">
        {addresses.map((address) => (
          <article
            key={address._id}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-[0_8px_24px_rgba(26,37,63,0.035)]"
          >
            <div className="flex items-start justify-between">
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
                onClick={() => onDelete(address._id)}
                aria-label={`Delete ${address.type} address`}
                className="text-slate-400"
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
              onClick={() => onEdit(address)}
              className="mt-5 text-sm font-bold text-[#6C3BFF]"
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
}

function OrderTracking({ order, onClose }) {
  const steps = ["Processing", "Shipped", "Out for delivery", "Delivered"];
  const currentStep = steps.indexOf(order.status);
  return (
    <div className="mt-5 rounded-xl border border-[#d9ceff] bg-[#faf9ff] p-4 text-sm text-slate-600">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-bold text-slate-800">{order.id} order update</p>
          <p className="mt-1">
            {order.status === "Cancelled"
              ? `Your ${order.product} order was cancelled.`
              : `Your ${order.product} order is currently ${order.status.toLowerCase()}.`}
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-4">
            {steps.map((step, index) => {
              const complete =
                order.status !== "Cancelled" && currentStep >= index;
              return (
                <div
                  key={step}
                  className="flex items-center gap-2 text-xs font-semibold sm:block"
                >
                  <span
                    className={`grid h-7 w-7 place-items-center rounded-full ${complete ? "bg-[#6C3BFF] text-white" : "bg-slate-100 text-slate-400"}`}
                  >
                    {complete ? <i className="fa-solid fa-check" /> : index + 1}
                  </span>{" "}
                  {step}
                </div>
              );
            })}
          </div>
        </div>
        <button
          onClick={onClose}
          aria-label="Close order details"
          className="text-slate-400"
        >
          <i className="fa-solid fa-xmark" />
        </button>
      </div>
    </div>
  );
}

function OrdersPage({ orders, selectedOrder, onTrack, onCancel, onClose }) {
  return (
    <>
      <PageIntro eyebrow="Purchase history" title="My Orders">
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
              <div className="border-t border-slate-100 pt-3 sm:border-0 sm:pt-0 sm:text-right">
                <p className="text-xs text-slate-400">Total amount</p>
                <p className="mt-1 font-bold text-slate-900">
                  {money(order.total)}
                </p>
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => onTrack(order)}
                    className="min-h-10 rounded-lg border border-slate-200 px-3.5 text-sm font-bold text-slate-700"
                  >
                    Track Order
                  </button>
                  {["Processing", "Shipped"].includes(order.status) && (
                    <button
                      onClick={() => onCancel(order.id)}
                      className="min-h-10 rounded-lg border border-rose-200 px-3.5 text-sm font-bold text-rose-600"
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
      {!orders.length && (
        <div className="mt-4 rounded-xl border border-dashed border-slate-300 bg-white py-12 text-center text-sm text-slate-500">
          No orders yet.
        </div>
      )}
      {selectedOrder && (
        <OrderTracking order={selectedOrder} onClose={onClose} />
      )}
    </>
  );
}

function Sidebar({ activePage, profile, onChange }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    navigate("/login", { replace: true });
  };

  return (
    <aside className="mb-6 lg:mb-0">
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white lg:sticky lg:top-5">
        <div className="hidden border-b border-slate-100 p-4 lg:block">
          <p className="text-sm font-bold text-slate-800">
            {profile.name}
          </p>
          <p className="text-xs text-slate-500">{profile.email}</p>
        </div>
        <nav className="flex gap-2 overflow-x-auto p-2 lg:block lg:space-y-1 lg:p-3">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onChange(item.id)}
              className={`flex min-w-max items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold ${activePage === item.id ? "bg-[#6C3BFF] text-white" : "text-slate-600 hover:bg-[#f4f1ff] hover:text-[#6C3BFF]"}`}
            >
              <i className={`${item.icon} w-4 text-center`} />
              {item.label}
            </button>
          ))}
          <button
            type="button"
            onClick={handleLogout}
            className="flex min-w-max items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold text-rose-500"
          >
            <i className="fa-solid fa-arrow-right-from-bracket w-4 text-center" />
            Logout
          </button>
        </nav>
      </div>
    </aside>
  );
}

function Account() {
  const [activePage, setActivePage] = useState("profile");
  const [profile, setProfile] = useState(profileDefaults);
  const [editingProfile, setEditingProfile] = useState(false);
  const [addresses, setAddresses] = useState(addressDefaults);
  const [addressFormOpen, setAddressFormOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [orders, setOrders] = useState(orderDefaults);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [notice, setNotice] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const showNotice = (message) => {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 2600);
  };

  // fetch profile, address and orders from backend when page loads
  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (!token) {
      setIsLoading(false);
      return;
    }

    const loadAccount = async () => {
      try {
        // get profile
        const profileRes = await axios.get(
          `${API_URL}/profile/getProfile`,
          getAuthConfig(),
        );
        setProfile((current) => ({
          ...current,
          ...profileRes.data,
          phone: profileRes.data.phone ? profileRes.data.phone.toString() : "",
        }));

        // get addresses
        const addressRes = await axios.get(
          `${API_URL}/profile/address`,
          getAuthConfig(),
        );
        setAddresses(addressRes.data.addresses || []);

        // get orders
        // NOTE: confirm this endpoint with your backend, changed it if different
        const orderRes = await axios.get(
          `${API_URL}/order/myOrders`,
          getAuthConfig(),
        );
        setOrders(orderRes.data.orders || []);
      } catch (error) {
        console.log(error);
        if (error.response && error.response.status === 401) {
          localStorage.removeItem("userToken");
          window.location.replace("/login");
        } else {
          showNotice(
            (error.response && error.response.data && error.response.data.message) ||
              "Could not load account details",
          );
        }
      }
      setIsLoading(false);
    };

    loadAccount();
  }, []);

  const pageTitle =
    menuItems.find((item) => item.id === activePage)?.label || "Profile";

  const saveAddress = async (data) => {
    try {
      let response;
      if (editingAddress) {
        response = await axios.put(
          `${API_URL}/profile/address/${editingAddress._id}`,
          data,
          getAuthConfig(),
        );
      } else {
        response = await axios.post(
          `${API_URL}/profile/address`,
          data,
          getAuthConfig(),
        );
      }
      const savedAddress = response.data.address;

      if (editingAddress) {
        setAddresses(
          addresses.map((item) =>
            item._id === editingAddress._id ? savedAddress : item,
          ),
        );
      } else {
        setAddresses([...addresses, savedAddress]);
      }
      showNotice(response.data.message || "Address saved");
      setEditingAddress(null);
      setAddressFormOpen(false);
    } catch (error) {
      console.log(error);
      showNotice(
        (error.response && error.response.data && error.response.data.message) ||
          "Could not save address",
      );
    }
  };

  const openAddAddress = () => {
    setEditingAddress(null);
    setAddressFormOpen(true);
  };
  const openEditAddress = (address) => {
    setEditingAddress(address);
    setAddressFormOpen(true);
  };
  const closeAddressForm = () => {
    setEditingAddress(null);
    setAddressFormOpen(false);
  };

  const deleteAddress = async (id) => {
    try {
      await axios.delete(`${API_URL}/profile/address/${id}`, getAuthConfig());
      setAddresses(addresses.filter((item) => item._id !== id));
      showNotice("Address removed");
    } catch (error) {
      console.log(error);
      showNotice(
        (error.response && error.response.data && error.response.data.message) ||
          "Could not remove address",
      );
    }
  };

  // NOTE: this only updates status on frontend for now, hook this up to
  // a real cancel-order API route when you have one (e.g. PUT /order/cancel/:id)
  const cancelOrder = (id) => {
    setOrders(
      orders.map((item) =>
        item.id === id ? { ...item, status: "Cancelled" } : item,
      ),
    );
    setSelectedOrder(null);
    showNotice("Order cancelled successfully");
  };

  const saveProfile = async (data) => {
    try {
      const response = await axios.put(
        `${API_URL}/profile/updateProfile`,
        {
          name: data.name,
          phone: data.phone,
          dateOfBirth: data.dateOfBirth,
        },
        getAuthConfig(),
      );

      setProfile((current) => ({
        ...current,
        ...data,
        ...(response.data.user || {}),
        phone: (
          (response.data.user && response.data.user.phone) ||
          data.phone
        )?.toString() || "",
      }));
      setEditingProfile(false);
      showNotice(response.data.message || "Profile details updated");
    } catch (error) {
      console.log(error);
      showNotice(
        (error.response && error.response.data && error.response.data.message) ||
          "Could not update profile",
      );
    }
  };

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="flex min-h-[70vh] items-center justify-center">
          <p className="text-sm font-semibold text-slate-500">Loading...</p>
        </div>
        <Footer />
      </>
    );
  }

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
            <span>{pageTitle}</span>
          </div>
          <div className="lg:grid lg:grid-cols-[238px_minmax(0,1fr)] lg:gap-8">
            <Sidebar
              activePage={activePage}
              profile={profile}
              onChange={setActivePage}
            />
            <section className="min-w-0">
              {activePage === "profile" && (
                <ProfilePage
                  profile={profile}
                  editing={editingProfile}
                  onEdit={() => setEditingProfile(true)}
                  onSave={saveProfile}
                  onCancel={() => setEditingProfile(false)}
                />
              )}
              {activePage === "orders" && (
                <OrdersPage
                  orders={orders}
                  selectedOrder={selectedOrder}
                  onTrack={setSelectedOrder}
                  onCancel={cancelOrder}
                  onClose={() => setSelectedOrder(null)}
                />
              )}
              {activePage === "addresses" && (
                <AddressesPage
                  addresses={addresses}
                  profile={profile}
                  addressFormOpen={addressFormOpen}
                  editingAddress={editingAddress}
                  onAdd={openAddAddress}
                  onEdit={openEditAddress}
                  onDelete={deleteAddress}
                  onSave={saveAddress}
                  onCancel={closeAddressForm}
                />
              )}
            </section>
          </div>
        </div>
      </main>
      {notice && (
        <div
          role="status"
          className="fixed bottom-5 right-5 z-60 rounded-lg bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-xl"
        >
          {notice}
        </div>
      )}
      <Footer />
    </>
  );
}

export default Account;