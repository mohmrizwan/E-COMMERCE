import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import OrderSummary from "../OrderSummary";
import Loader from "../../Components/Dotter";

const API_URL = "https://ecommerceba-6dtt.onrender.com";
const addressEndpoint = `${API_URL}/profile/address`;
const emptyAddress = {
  type: "Home",
  name: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
};
const inputClass =
  "w-full rounded-2xl border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm text-gray-700 outline-none transition focus:border-[#6c3bff] focus:bg-white focus:ring-4 focus:ring-[#6c3bff]/10";

const getAuthConfig = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("userToken")}`,
  },
});

const CheckoutAddress = ({ cart, initialAddress, onContinue }) => {
  const initialAddressId = initialAddress?._id
    ? String(initialAddress._id)
    : "";
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(
    initialAddressId,
  );
  const [form, setForm] = useState(emptyAddress);
  const [editingAddress, setEditingAddress] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let isActive = true;

    const loadAddresses = async () => {
      try {
        const response = await axios.get(addressEndpoint, getAuthConfig());
        if (!isActive) return;

        const savedAddresses = Array.isArray(response.data.addresses)
          ? response.data.addresses
          : [];
        setAddresses(savedAddresses);

        const preferredAddress =
          savedAddresses.find(
            (address) => String(address._id) === initialAddressId,
          ) ||
          savedAddresses.find(
            (address) => address.default || address.isDefault,
          ) || savedAddresses[0];
        if (preferredAddress) {
          setSelectedAddressId(String(preferredAddress._id));
        } else {
          setIsFormOpen(true);
        }
      } catch (requestError) {
        if (isActive) {
          setError(
            requestError.response?.data?.message ||
              "Could not load your saved addresses.",
          );
        }
      } finally {
        if (isActive) setIsLoading(false);
      }
    };

    loadAddresses();
    return () => {
      isActive = false;
    };
  }, [initialAddressId]);

  const selectedAddress = addresses.find(
    (address) => String(address._id) === selectedAddressId,
  );

  const updateForm = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const openAddForm = () => {
    setEditingAddress(null);
    setForm(emptyAddress);
    setIsFormOpen(true);
  };

  const openEditForm = (address) => {
    setEditingAddress(address);
    setForm({ ...emptyAddress, ...address });
    setIsFormOpen(true);
  };

  const saveAddress = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    setError("");

    try {
      const response = editingAddress
        ? await axios.put(
            `${addressEndpoint}/${editingAddress._id}`,
            form,
            getAuthConfig(),
          )
        : await axios.post(addressEndpoint, form, getAuthConfig());
      const savedAddress = response.data.address;

      setAddresses((current) =>
        editingAddress
          ? current.map((address) =>
              address._id === editingAddress._id ? savedAddress : address,
            )
          : [...current, savedAddress],
      );
      setSelectedAddressId(String(savedAddress._id));
      setEditingAddress(null);
      setIsFormOpen(false);
      setForm(emptyAddress);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message || "Could not save the address.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleContinue = () => {
    if (!cart.length || !selectedAddress) return;
    onContinue(selectedAddress);
  };

  const hasMarkedDefault = addresses.some(
    (address) => address.default || address.isDefault,
  );

  return (
    <>
      <div className="address-wrapper bg-[white] py-4">
        <div className="mx-auto w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-15">
          <div className="address-header flex items-center justify-between">
            <Link to="/" className="shrink-0">
              <p className="whitespace-nowrap font-[Inter] text-xl font-bold tracking-tight text-[#171717] sm:text-2xl">
                Vendor<span className="text-[#6c3bff]">Aflame</span>
              </p>
            </Link>
            <p className="text-sm font-[inter]">Secure Checkout</p>
          </div>
        </div>
      </div>

      <div className="address-conetnt my-6 sm:my-8 lg:my-10">
        <div className="mx-auto flex w-full flex-col gap-6 px-4 sm:gap-8 sm:px-6 md:px-8 lg:flex-row lg:items-start lg:justify-between lg:gap-10 lg:px-10 xl:px-15">
          <div className="addrss-left w-full lg:w-[60%]">
            <div className="status my-6 hidden w-full items-center justify-between gap-1 sm:my-10 sm:flex sm:gap-2">
              <div className="flex items-center gap-3">
                <span className="rounded-full border-2 border-[#6C3BFF] bg-[#E9E5FC] px-3 py-2 text-xs font-bold text-[#6C3BFF]">
                  1
                </span>
                <p className="text-sm font-bold text-[#6B7280]">Address</p>
              </div>
              <div className="h-px min-w-2 flex-1 bg-gray-300 sm:mx-2 md:mx-4" />
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-[#E9E5FC] px-3 py-2 text-xs font-bold text-[#6B7280]">
                  2
                </span>
                <p className="text-sm font-bold text-[#6B7280]">Payment</p>
              </div>
              <div className="h-px min-w-2 flex-1 bg-gray-300 sm:mx-2 md:mx-4" />
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-[#E9E5FC] px-3 py-2 text-xs font-bold text-[#6B7280]">
                  3
                </span>
                <p className="text-sm font-bold text-[#6B7280]">Confirmation</p>
              </div>
            </div>

            <section className="address-form rounded-2xl bg-white p-4 sm:p-6 md:p-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="font-[inter] text-xl font-bold text-black sm:text-2xl">
                    Shipping address
                  </h1>
                  <p className="my-2 text-xs text-[#6B7280] sm:text-sm">
                    Choose a saved address or add a new one.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={openAddForm}
                  className="shrink-0 text-sm font-bold text-[#6C3BFF]"
                >
                  <i className="fa-solid fa-plus mr-1" /> Add address
                </button>
              </div>

              {!cart.length ? (
                <div className="mt-5 rounded-xl border border-dashed border-[#dde3f0] px-4 py-10 text-center">
                  <p className="font-semibold">Your cart is empty.</p>
                  <p className="mt-2 text-sm text-[#6B7280]">
                    Add products before continuing to checkout.
                  </p>
                  <Link
                    to="/products"
                    className="mt-5 inline-flex rounded-xl bg-[#6C3BFF] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#5427d6]"
                  >
                    Continue Shopping
                  </Link>
                </div>
              ) : (
                <>
                  {isLoading ? (
                    <Loader />
                  ) : addresses.length > 0 ? (
                    <div className="mt-4 grid gap-3">
                      {addresses.map((address, index) => {
                        const addressId = String(address._id);
                        const isDefault =
                          address.default ||
                          address.isDefault ||
                          (!hasMarkedDefault && index === 0);

                        return (
                          <div
                            key={address._id}
                            className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition ${
                              selectedAddressId === addressId
                                ? "border-[#6C3BFF] bg-[#F7F5FF]"
                                : "border-[#dde3f0] hover:border-[#b6a5e7]"
                            }`}
                          >
                            <input
                              type="radio"
                              name="deliveryAddress"
                              id={`delivery-address-${addressId}`}
                              value={addressId}
                              checked={selectedAddressId === addressId}
                              onChange={() => setSelectedAddressId(addressId)}
                              className="mt-1 accent-[#6C3BFF]"
                            />
                            <div className="min-w-0 flex-1">
                              <label
                                htmlFor={`delivery-address-${addressId}`}
                                className="flex cursor-pointer flex-wrap items-center gap-2 font-semibold"
                              >
                                {address.name} · {address.type}
                                {isDefault && (
                                  <span className="rounded-full bg-[#E9E5FC] px-2 py-1 text-[10px] font-bold text-[#6C3BFF]">
                                    Default
                                  </span>
                                )}
                              </label>
                              <span className="mt-1 block text-sm text-[#6B7280]">
                                {address.phone}
                              </span>
                              <span className="mt-1 block text-sm leading-5 text-[#6B7280]">
                                {address.address}, {address.city},{" "}
                                {address.state} {address.pincode}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={(event) => {
                                event.preventDefault();
                                openEditForm(address);
                              }}
                              className="shrink-0 text-sm font-semibold text-[#6C3BFF]"
                            >
                              Edit
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="mt-4 text-sm text-[#6B7280]">
                      No saved addresses yet. Add one to continue.
                    </p>
                  )}

                  {isFormOpen && !isLoading && (
                    <form
                      onSubmit={saveAddress}
                      className="mt-5 rounded-xl border border-[#d9ceff] bg-[#faf9ff] p-4 sm:p-5"
                    >
                      <h2 className="font-bold text-[#171717]">
                        {editingAddress ? "Edit address" : "Add new address"}
                      </h2>
                      <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        <label className="text-xs font-semibold">
                          Address type
                          <select
                            value={form.type}
                            onChange={(event) =>
                              updateForm("type", event.target.value)
                            }
                            className={`${inputClass} mt-2`}
                          >
                            <option>Home</option>
                            <option>Work</option>
                            <option>Other</option>
                          </select>
                        </label>
                        {[
                          ["name", "Full name"],
                          ["phone", "Phone number"],
                          ["city", "City"],
                          ["state", "State"],
                          ["pincode", "Pincode"],
                        ].map(([field, label]) => (
                          <label key={field} className="text-xs font-semibold">
                            {label}
                            <input
                              required
                              type={field === "phone" ? "tel" : "text"}
                              value={form[field] || ""}
                              onChange={(event) =>
                                updateForm(field, event.target.value)
                              }
                              className={`${inputClass} mt-2`}
                            />
                          </label>
                        ))}
                        <label className="text-xs font-semibold sm:col-span-2">
                          Street address
                          <textarea
                            required
                            rows="3"
                            value={form.address || ""}
                            onChange={(event) =>
                              updateForm("address", event.target.value)
                            }
                            className={`${inputClass} mt-2`}
                          />
                        </label>
                      </div>
                      <div className="mt-4 flex gap-3">
                        <button
                          type="submit"
                          disabled={isSaving}
                          className="rounded-xl bg-[#6C3BFF] px-4 py-2.5 text-sm font-bold text-white disabled:opacity-60"
                        >
                          {isSaving
                            ? "Saving..."
                            : editingAddress
                              ? "Save address"
                              : "Add address"}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setIsFormOpen(false);
                            setEditingAddress(null);
                          }}
                          className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-semibold"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}

                  {error && (
                    <p role="alert" className="mt-4 text-sm text-red-600">
                      {error}
                    </p>
                  )}

                  <div className="mt-6 flex flex-col-reverse items-stretch justify-between gap-4 sm:flex-row sm:items-center">
                    <Link
                      to="/cart"
                      className="text-sm text-gray-500 transition hover:text-gray-800"
                    >
                      <i className="fa-solid fa-arrow-left" />
                      &nbsp; Back to Cart
                    </Link>
                    <button
                      type="button"
                      onClick={handleContinue}
                      disabled={!cart.length || !selectedAddress || isLoading}
                      className="w-full rounded-2xl bg-[#6C3BFF] px-5 py-3 text-center text-sm font-bold text-white transition duration-300 hover:bg-[#5a2ee0] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:px-6"
                    >
                      Continue to Payment
                    </button>
                  </div>
                </>
              )}
            </section>
          </div>
          <OrderSummary />
        </div>
      </div>
    </>
  );
};

export default CheckoutAddress;
