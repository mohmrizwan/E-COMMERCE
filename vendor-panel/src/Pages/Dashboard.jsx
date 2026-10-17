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
          What&apos;s Happening in your store?{" "}
        </p>
      </div>

      <Report />
      <div>
        <p className="text-lg  text-gray-400">Order&apos;s Overview </p>
      </div>
      <div className="grid min-w-0 grid-cols-1 gap-4 lg:grid-cols-[minmax(0,4fr)_minmax(220px,1fr)]">
        <div className="min-w-0">
          <OrdersChart />
        </div>

        <div className="min-w-0">
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
