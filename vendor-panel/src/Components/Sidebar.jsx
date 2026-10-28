import React, { useEffect, useState } from "react";
import defaultLogo from "/Copilot_20260831_214454.png";
import { STORE_NAME } from "../config/brand.js";
import { apiUrl } from "../config/api.js";
import "../Assets/Stylesheets/Sidebar.css";
import {
  CSidebar,
  CSidebarBrand,
  CSidebarNav,
  CNavItem,
  CNavGroup,
} from "@coreui/react";

import CIcon from "@coreui/icons-react";

import {
  cilSpeedometer,
  cilBasket,
  cilCart,
  cilPeople,
  cilChartPie,
  cilStar,
  cilWallet,
  cilMoney,
  cilTags,
  cilBell,
  cilSettings,
  cilUser,
  cilChatBubble,
  cilCreditCard,
} from "@coreui/icons";

function Sidebar({ visible, setVisible }) {
  const [storeLogo, setStoreLogo] = useState(defaultLogo);
  useEffect(() => {
    const handleSettingsUpdated = (event) => {
      if (event.detail?.websiteLogo) setStoreLogo(event.detail.websiteLogo);
    };
    window.addEventListener(
      "storefront:settings-updated",
      handleSettingsUpdated,
    );
    fetch(apiUrl("storefront"))
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (data?.storefront?.websiteLogo)
          setStoreLogo(data.storefront.websiteLogo);
      })
      .catch(() => {});
    return () =>
      window.removeEventListener(
        "storefront:settings-updated",
        handleSettingsUpdated,
      );
  }, []);
  return (
    <CSidebar
      position="fixed"
      visible={visible}
      onVisibleChange={setVisible}
      className="vendor-sidebar !bg-[#173D35] !border-r !border-[#D6B56D]/30"
    >
      {/* ================= LOGO ================= */}

      <CSidebarBrand className="!bg-[#173D35] !border-b !border-[#D6B56D]/30 px-4 py-4">
        <img
          src={storeLogo}
          alt={`${STORE_NAME} logo`}
          className="w-full max-h-70 object-contain"
        />
      </CSidebarBrand>

      {/* ================= SIDEBAR ================= */}

      <CSidebarNav className="!bg-[#173D35] px-3 py-4">
        {/* ---------- MAIN ---------- */}

        <div className="px-3 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Main
          </span>
        </div>

        {/* Dashboard */}

        <CNavItem
          href="/dashboard"
          className="!text-white font-medium text-base rounded-lg hover:!bg-[#D6B56D]/20 hover:!text-[#D6B56D] transition duration-200 mb-1"
        >
          <CIcon
            icon={cilSpeedometer}
            customClassName="nav-icon !text-[#D6B56D]"
          />
          Dashboard
        </CNavItem>

        {/* ---------- STORE ---------- */}

        <div className="px-3 mt-5 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Store
          </span>
        </div>

        <CNavGroup
          className="products-menu"
          toggler={
            <>
              <CIcon
                icon={cilBasket}
                customClassName="nav-icon !text-[#D6B56D]"
              />
              <span className="!text-white !font-medium">Products</span>
            </>
          }
        >
        <CNavItem
          href="/products"
          className="!text-gray-200 hover:!text-[#D6B56D]"
        >
          All Products
        </CNavItem>

        <CNavItem
          href="/products/add"
          className="!text-gray-200 hover:!text-[#D6B56D]"
        >
          Add Product
        </CNavItem>
        </CNavGroup>

        {/* Orders */}

        <CNavGroup
          className="products-menu"
          toggler={
            <>
              <CIcon
                icon={cilCart}
                customClassName="nav-icon !text-[#D6B56D]"
              />
              <span className="!text-white !font-medium">Orders</span>
            </>
          }
        >
          <CNavItem
            href="/orders"
            className="!text-gray-200 hover:!text-[#D6B56D]"
          >
            All Orders
          </CNavItem>

          <CNavItem
            href="/orders/processing"
            className="!text-gray-200 hover:!text-[#D6B56D]"
          >
            Processing
          </CNavItem>

          <CNavItem
            href="/orders/shipped"
            className="!text-gray-200 hover:!text-[#D6B56D]"
          >
            Shipped
          </CNavItem>

          <CNavItem
            href="/orders/delivered"
            className="!text-gray-200 hover:!text-[#D6B56D]"
          >
            Delivered
          </CNavItem>

          <CNavItem
            href="/orders/cancelled"
            className="!text-gray-200 hover:!text-[#D6B56D]"
          >
            Cancelled
          </CNavItem>
        </CNavGroup>

        {/* Customers */}

        <CNavItem
          href="/customers"
          className="!text-white font-medium text-base rounded-lg hover:!bg-[#D6B56D]/20 hover:!text-[#D6B56D] transition duration-200 mb-1"
        >
          <CIcon icon={cilPeople} customClassName="nav-icon !text-[#D6B56D]" />
          <span className="!text-white group-hover:!text-[#D6B56D]">Customers</span>
        </CNavItem>
        <CNavItem
          href="/banner"
          className="!text-white font-medium text-base rounded-lg hover:!bg-[#D6B56D]/20 hover:!text-[#D6B56D] transition duration-200 mb-1"
        >
          <CIcon icon={cilBell} customClassName="nav-icon !text-[#D6B56D]" />
          <span className="!text-white group-hover:!text-[#D6B56D]">Banner</span>
        </CNavItem>
        <CNavItem
          href="/brandAndCategory"
          className="!text-white font-medium text-base rounded-lg hover:!bg-[#D6B56D]/20 hover:!text-[#D6B56D] transition duration-200 mb-1"
        >
          <CIcon icon={cilTags} customClassName="nav-icon !text-[#D6B56D]" />
          <span className="!text-white group-hover:!text-[#D6B56D]">Brand & Category</span>
        </CNavItem>

        {/* ---------- FINANCE ---------- */}

        <div className="px-3 mt-5 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Finance
          </span>
        </div>

        {/* Transactions */}

        <CNavItem
          href="/transactions"
          className="!text-white font-medium text-base rounded-lg hover:!bg-[#D6B56D]/20 hover:!text-[#D6B56D] transition duration-200 mb-1"
        >
          <CIcon icon={cilMoney} customClassName="nav-icon !text-[#D6B56D]" />
          Transactions
        </CNavItem>

        {/* Withdrawals */}

        {/* Notifications */}

        {/* ---------- SYSTEM ---------- */}

        <div className="px-3 mt-5 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            System
          </span>
        </div>

        {/* Profile */}

        <CNavItem
          href="/profile"
          className="!text-white font-medium text-base rounded-lg hover:!bg-[#D6B56D]/20 hover:!text-[#D6B56D] transition duration-200 mb-1"
        >
          <CIcon icon={cilUser} customClassName="nav-icon !text-[#D6B56D]" />
          Profile
        </CNavItem>

        {/* Settings */}

        {/* <CNavItem
          href="/settings"
          className="!text-slate-300 font-medium text-base rounded-lg hover:!bg-[#241A42] hover:!text-white transition duration-200 mb-1"
        >
          <CIcon
            icon={cilSettings}
            customClassName="nav-icon !text-violet-400"
          />
          Settings
        </CNavItem> */}
      </CSidebarNav>
    </CSidebar>
  );
}

export default Sidebar;
