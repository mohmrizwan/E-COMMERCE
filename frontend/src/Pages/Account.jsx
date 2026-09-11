import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import { products } from "../data/products";

const menuItems = [
  { id: "profile", label: "Profile", icon: "fa-regular fa-user" },
  { id: "orders", label: "My Orders", icon: "fa-solid fa-box" },
  {
    id: "addresses",
    label: "Saved Addresses",
    icon: "fa-solid fa-location-dot",
  },
];

const profileDefaults = {
  name: "Rizwan",
  email: "mohmrizwan10@gmail.com",
  phone: "+91 98264 80948",
  dateOfBirth: "02 December 2004",
  gender: "Male",
  address: "4 sector k green park colony dhar road",
};

const addressDefaults = [
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

const orderDefaults = [
  [
    "VND-48291",
    "22 Aug 2026",
    "AeroGlide Pro Running Sneakers",
    1,
    999,
    "Delivered",
    products[0].image,
  ],
  [
    "VND-48157",
    "17 Aug 2026",
    "Auratone Studio Headphones",
    1,
    8999,
    "Processing",
    products[4].image,
  ],
  [
    "VND-47702",
    "08 Aug 2026",
    "Everyday Linen Overshirt",
    2,
    1599,
    "Shipped",
    products[7].image,
  ],
  [
    "VND-46218",
    "25 Jul 2026",
    "Classic Leather Crossbody",
    1,
    2399,
    "Cancelled",
    products[13].image,
  ],
].map(([id, date, product, quantity, price, status, image]) => ({
  id,
  date,
  product,
  quantity,
  price,
  total: quantity * price,
  status,
  image,
}));

const statusStyles = {
  Delivered: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  Processing: "bg-amber-50 text-amber-700 ring-amber-100",
  Shipped: "bg-sky-50 text-sky-700 ring-sky-100",
  Cancelled: "bg-rose-50 text-rose-700 ring-rose-100",
};

const inputClass =
  "mt-2 w-full rounded-lg border border-slate-200 px-3.5 py-3 text-sm outline-none focus:border-[#6C3BFF] focus:ring-4 focus:ring-[#eeeaff]";
const money = (value) => `Rs. ${value.toLocaleString("en-IN")}`;

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
  const update = (field, value) =>
    setForm((current) => ({ ...current, [field]: value }));

  return (
    <>
      <PageIntro eyebrow="My account" title={`Welcome back, ${profile.name}`}>
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
                  {value}
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
  const update = (field, value) =>
    setForm((current) => ({ ...current, [field]: value }));
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
          key={editingAddress?.id || "new-address"}
          address={editingAddress}
          profile={profile}
          onSave={onSave}
          onCancel={onCancel}
        />
      )}
      <div className="grid gap-4 lg:grid-cols-2">
        {addresses.map((address) => (
          <article
            key={address.id}
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
                onClick={() => onDelete(address.id)}
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
      {selectedOrder && (
        <OrderTracking order={selectedOrder} onClose={onClose} />
      )}
    </>
  );
}

function Sidebar({ activePage, profile, onChange }) {
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
          <Link
            to="/login"
            className="flex min-w-max items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold text-rose-500"
          >
            <i className="fa-solid fa-arrow-right-from-bracket w-4 text-center" />
            Logout
          </Link>
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
  const showNotice = (message) => {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 2600);
  };
  const pageTitle =
    menuItems.find((item) => item.id === activePage)?.label || "Profile";
  const saveAddress = (data) => {
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
    setEditingAddress(null);
    setAddressFormOpen(false);
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
  const deleteAddress = (id) => {
    setAddresses((items) => items.filter((item) => item.id !== id));
    showNotice("Address removed");
  };
  const cancelOrder = (id) => {
    setOrders((items) =>
      items.map((item) =>
        item.id === id ? { ...item, status: "Cancelled" } : item,
      ),
    );
    setSelectedOrder(null);
    showNotice("Order cancelled successfully");
  };

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
                  onSave={(data) => {
                    setProfile(data);
                    setEditingProfile(false);
                    showNotice("Profile details updated");
                  }}
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
