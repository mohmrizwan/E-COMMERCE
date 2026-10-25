import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "../Components/Sidebar";
import Header from "../Components/Header";

function VendorLayout() {
  const [sidebarShow, setSidebarShow] = useState(() => window.innerWidth >= 992);

  useEffect(() => {
    const handleResize = () => setSidebarShow(window.innerWidth >= 992);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Sidebar visible={sidebarShow} setVisible={setSidebarShow} />
      {sidebarShow && window.innerWidth < 992 && (
        <button
          type="button"
          className="vendor-sidebar-backdrop"
          aria-label="Close navigation menu"
          onClick={() => setSidebarShow(false)}
        />
      )}

      <div
        className="vendor-panel-main"
        style={{
          marginLeft:
            sidebarShow && window.innerWidth >= 992 ? 256 : 0,
        }}
      >
        <Header onMenuClick={() => setSidebarShow(!sidebarShow)} />

        <main className="vendor-page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default VendorLayout;
