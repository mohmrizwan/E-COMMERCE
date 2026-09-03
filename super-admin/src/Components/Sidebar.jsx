import React from "react";
import logo from "/Copilot_20260831_214454.png";
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
  cilStar,
  cilWallet,
  cilMoney,
  cilSettings,
  cilUser,
  cilChatBubble,
} from "@coreui/icons";

function Sidebar({ visible, setVisible }) {
  return (
    <CSidebar
      position="fixed"
      visible={visible}
      onVisibleChange={setVisible}
      className="
        !border-r
        !border-[#E6C5DE]
        !overflow-hidden
        sidebar-theme
      "
      style={{
        background:
          "linear-gradient(180deg, #70207B 0%, #8B2595 45%, #B52AC2 100%)",
      }}
    >
      {/* ================= LOGO ================= */}

      <CSidebarBrand
        className="
          !bg-transparent
          !border-b
          !border-white/20
          px-4
          py-4
        "
      >
        <img
          src={logo}
          alt="VendoraFlame"
          className="w-full max-h-20 object-contain"
        />
      </CSidebarBrand>

      {/* ================= SIDEBAR NAV ================= */}

      <CSidebarNav className="!bg-transparent px-3 py-4">
    

        {/* Dashboard */}

        <CNavItem
          href="/"
          className="
            !text-white
            font-medium
            text-base
            rounded-lg
            !bg-[#B3398A]
            hover:!bg-[#B3398A]
            transition
            duration-200
            mb-1
          "
        >
          <CIcon icon={cilSpeedometer} customClassName="nav-icon !text-white" />
          Dashboard
        </CNavItem>

        {/* Products */}

        <CNavItem href="/products" className="products-menu !text-white">
          <CIcon icon={cilBasket} customClassName="nav-icon !text-white" />
          Products
        </CNavItem>

        {/* Orders */}

        <CNavItem className="products-menu !text-white" href="/orders">
          <CIcon icon={cilCart} customClassName="nav-icon !text-white" />
          Orders
        </CNavItem>

        {/* Customers */}

        <CNavItem
          href="/customers"
          className="
            !text-white
            font-medium
            text-base
            rounded-lg
            hover:!bg-white/10
            hover:!text-white
            transition
            duration-200
            mb-1
          "
        >
          <CIcon icon={cilPeople} customClassName="nav-icon !text-white" />
          Customers
        </CNavItem>
        <CNavItem
          href="/vendors"
          className="
            !text-white
            font-medium
            text-base
            rounded-lg
            hover:!bg-white/10
            hover:!text-white
            transition
            duration-200
            mb-1
          "
        >
          <CIcon icon={cilPeople} customClassName="nav-icon !text-white" />
          Vendors
        </CNavItem>

        {/* Earnings */}

        <CNavItem
          href="/earnings"
          className="
            !text-white
            font-medium
            text-base
            rounded-lg
            hover:!bg-white/10
            hover:!text-white
            transition
            duration-200
            mb-1
          "
        >
          <CIcon icon={cilWallet} customClassName="nav-icon !text-white" />
          Earnings
        </CNavItem>

        {/* Transactions */}

        <CNavItem
          href="/transactions"
          className="
            !text-white
            font-medium
            text-base
            rounded-lg
            hover:!bg-white/10
            hover:!text-white
            transition
            duration-200
            mb-1
          "
        >
          <CIcon icon={cilMoney} customClassName="nav-icon !text-white" />
          Transactions
        </CNavItem>

        {/* Messages */}

        <CNavItem
          href="/messages"
          className="
            !text-white
            font-medium
            text-base
            rounded-lg
            hover:!bg-white/10
            hover:!text-white
            transition
            duration-200
            mb-1
          "
        >
          <CIcon icon={cilChatBubble} customClassName="nav-icon !text-white" />
          Messages
        </CNavItem>

        {/* Profile */}

        <CNavItem
          href="/profile"
          className="
            !text-white
            font-medium
            text-base
            rounded-lg
            hover:!bg-white/10
            hover:!text-white
            transition
            duration-200
            mb-1
          "
        >
          <CIcon icon={cilUser} customClassName="nav-icon !text-white" />
          Profile
        </CNavItem>

        {/* Settings */}

        <CNavItem
          href="/settings"
          className="
            !text-white
            font-medium
            text-base
            rounded-lg
            hover:!bg-white/10
            hover:!text-white
            transition
            duration-200
            mb-1
          "
        >
          <CIcon icon={cilSettings} customClassName="nav-icon !text-white" />
          Settings
        </CNavItem>
      </CSidebarNav>
    </CSidebar>
  );
}

export default Sidebar;
