import React, { useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "../Components/Sidebar";
import Header from "../Components/Header";

function VendorLayout() {
  const [sidebarShow, setSidebarShow] = useState(true);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Sidebar visible={sidebarShow} setVisible={setSidebarShow} />

      <div
        className={`transition-all duration-300 ${
          sidebarShow ? "md:ml-[256px]" : "ml-0"
        }`}
      >
        <Header onMenuClick={() => setSidebarShow(!sidebarShow)} />

        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default VendorLayout;
