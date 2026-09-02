import React from "react";
import Report from "../Components/Dashboard/Report";
import OrdersChart from "../Components/Dashboard/OrdersChart";
import CategoryChart from "../Components/Dashboard/CategoryChart";
import RecentOrders from "../Components/Dashboard/OrderDetails";
import RecentCustomers from "../Components/Dashboard/RecentCustomer";
const Dashboard = () => {
  return (
    <>
      <div className="">
        <h1 className="text-2xl font-extrabold">Dashboard</h1>
        <p className="text-md  text-gray-400">
          What's Happening in your store?{" "}
        </p>
      </div>

      <Report />
      <div>
        <p className="text-lg  text-gray-400">Order's Overview </p>
      </div>
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="w-full lg:w-[80%]">
          <OrdersChart />
        </div>

        <div className="w-full lg:w-[20%]">
          <CategoryChart />
        </div>
      </div>
      <div className="mt-15">
        <p className="text-lg  text-gray-400">Recent Orders </p>
      </div>
      <RecentOrders />
      <div className="mt-15">
        <p className="text-lg  text-gray-400 ">Recent Customers </p>
        <RecentCustomers />
      </div>
    </>
  );
};

export default Dashboard;
