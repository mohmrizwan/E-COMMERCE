import Report from "../Components/Dashboard/Report";
import OrdersChart from "../Components/Dashboard/OrdersChart";
import CategoryChart from "../Components/Dashboard/CategoryChart";
import RecentOrders from "../Components/Dashboard/OrderDetails";
import RecentCustomers from "../Components/Dashboard/RecentCustomer";
import { useEffect, useState } from "react";
import axios from "axios";
import { apiUrl } from "../config/api.js";

const getStoredVendorName = () => {
  try {
    const vendorData = localStorage.getItem("vendorData");
    if (vendorData) {
      const parsed = JSON.parse(vendorData);
      return parsed?.name || parsed?.businessName || parsed?.ownerName || "Vendor";
    }
  } catch (e) {}
  return "Vendor";
};

const Dashboard = () => {
  const [vendorName, setVendorName] = useState(getStoredVendorName());

  useEffect(() => {
    const fetchStoreName = async () => {
      try {
        const token = localStorage.getItem("vendorToken");
        if (!token) return;
        const response = await axios.get(apiUrl("vendor/myProfile"), {
          headers: { Authorization: `Bearer ${token}` },
        });
        const ownerName =
          response.data?.vendorProfile?.ownerName ||
          response.data?.vendor?.ownerName ||
          response.data?.ownerName;
        if (ownerName) {
          setVendorName(ownerName);
          try {
            const vendorData = localStorage.getItem("vendorData");
            if (vendorData) {
              const parsed = JSON.parse(vendorData);
              parsed.name = ownerName;
              parsed.ownerName = ownerName;
              localStorage.setItem("vendorData", JSON.stringify(parsed));
            } else {
              localStorage.setItem(
                "vendorData",
                JSON.stringify({ name: ownerName, ownerName }),
              );
            }
          } catch (e) {}
        }
      } catch (e) {
        // ignore
      }
    };
    fetchStoreName();
  }, []);

  return (
    <>
      <div className="mb-6 rounded-2xl bg-[#173D35] p-6 shadow-lg shadow-[#173D35]/10">
        <p className="text-sm font-semibold uppercase tracking-wider text-[#D6B56D]">
          Vendor Dashboard
        </p>
        <h1 className="mt-2 text-2xl font-extrabold text-white sm:text-3xl">
          Welcome back, <span className="text-[#D6B56D]">{vendorName}</span>
        </h1>
        <p className="mt-2 text-sm text-gray-200 sm:text-base">
          Manage your store, products, and orders.
        </p>
      </div>

      <Report />
      <div className="mt-6 mb-4">
        <p className="text-lg font-semibold text-[#173D35]">Order&apos;s Overview </p>
      </div>
      <div className="grid min-w-0 grid-cols-1 gap-4 lg:grid-cols-[minmax(0,4fr)_minmax(220px,1fr)]">
        <div className="min-w-0 rounded-2xl border border-[#e5e7eb] bg-white shadow-sm">
          <OrdersChart />
        </div>

        <div className="min-w-0 rounded-2xl border border-[#e5e7eb] bg-white shadow-sm">
          <CategoryChart />
        </div>
      </div>
      <div className="mt-10 mb-4">
        <p className="text-lg font-semibold text-[#173D35]">Recent Orders </p>
      </div>
      <div className="rounded-2xl border border-[#e5e7eb] bg-white shadow-sm">
        <RecentOrders />
      </div>
      <div className="mt-10 mb-4">
        <p className="text-lg font-semibold text-[#173D35]">Recent Customers </p>
      </div>
      <div className="rounded-2xl border border-[#e5e7eb] bg-white shadow-sm">
        <RecentCustomers />
      </div>
    </>
  );
};

export default Dashboard;
