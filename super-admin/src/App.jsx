import { Route, Routes } from "react-router-dom";
import VendorLayout from "./Layout/Layouts";
import Dashboard from "./Pages/Dashboard";
import AllProducts from "./Pages/Products/AllProducts";
import AllOrders from "./Pages/Orders/AllOrders";
import Customers from "./Pages/Customer/Customers";
import Review from "./Pages/Review/Review";
import Earning from "./Pages/Finance/Earning";
import Transaction from "./Pages/Finance/Transaction";
import Message from "./Pages/Messages/Message";
import Profile from "./Pages/Profile/Profile";
import Setting from "./Pages/Setting/Setting";
import Vendor from "./Pages/Vendor/Vendor";

function App() {
  return (
    <Routes>
      {/* Vendor Panel Layout */}
      <Route path="/" element={<VendorLayout />}>
        {/* Dashboard */}
        <Route index element={<Dashboard />} />

        {/* Products */}
        <Route path="products" element={<AllProducts />} />
        <Route path="/orders" element={<AllOrders />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/vendors" element={<Vendor />} />
        <Route path="/reviews" element={<Review />} />
        <Route path="/earnings" element={<Earning />} />
        <Route path="/transactions" element={<Transaction />} />
        <Route path="/messages" element={<Message />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Setting />} />
        

      </Route>
    </Routes>
  );
}

export default App;
