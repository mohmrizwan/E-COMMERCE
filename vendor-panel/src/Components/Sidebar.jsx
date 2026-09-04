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
  return (
    <CSidebar
      position="fixed"
      visible={visible}
      onVisibleChange={setVisible} 
      className="!bg-[#17112B] !border-r !border-[#2D2545] !overflow-hidden"
    >
      {/* ================= LOGO ================= */}

      <CSidebarBrand className="!bg-[#17112B] !border-b !border-[#2D2545] px-4 py-4">
        <img
          src={logo}
          alt="VendoraFlame"
          className="w-full max-h-70 object-contain"
        />
      </CSidebarBrand>

      {/* ================= SIDEBAR ================= */}

      <CSidebarNav className="!bg-[#17112B] px-3 py-4">
        {/* ---------- MAIN ---------- */}

        <div className="px-3 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Main
          </span>
        </div>

        {/* Dashboard */}

        <CNavItem
          href="/"
          className="!text-white font-medium text-base rounded-lg hover:!bg-[#241A42] transition duration-200 mb-1"
        >
          <CIcon
            icon={cilSpeedometer}
            customClassName="nav-icon !text-violet-400"
          />
          Dashboard
        </CNavItem>

      

        {/* ---------- STORE ---------- */}

        <div className="px-3 mt-5 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Store
          </span>
        </div>

        {/* Products */}

        {/* Products */}

        <CNavGroup
          className="products-menu"
          toggler={
            <>
              <CIcon icon={cilBasket} customClassName="nav-icon" />
              Products
            </>
          }
        >
          <CNavItem
            href="/products"
            className="!text-[#6B7280] hover:!text-[#6D28D9]"
          >
            All Products
          </CNavItem>

          <CNavItem
            href="/products/add"
            className="!text-[#6B7280] hover:!text-[#6D28D9]"
          >
            Add Product
          </CNavItem>



          <CNavItem
            href="/products/inventory"
            className="!text-[#6B7280] hover:!text-[#6D28D9]"
          >
            Inventory
          </CNavItem>
          <CNavItem
            href="/products/update"
            className="!text-[#6B7280] hover:!text-[#6D28D9]"
          >
            Update Product
          </CNavItem>
        </CNavGroup>

        {/* Orders */}

        <CNavGroup
          className="products-menu"
          toggler={
            <>
              <CIcon
                icon={cilCart}
                customClassName="nav-icon !text-violet-400"
              />
              Orders
            </>
          }
        >
          <CNavItem
            href="/orders"
            className="!text-slate-400 hover:!text-white"
          >
            All Orders
          </CNavItem>

      

          <CNavItem
            href="/orders/processing"
            className="!text-slate-400 hover:!text-white"
          >
            Processing
          </CNavItem>

          <CNavItem
            href="/orders/shipped"
            className="!text-slate-400 hover:!text-white"
          >
            Shipped
          </CNavItem>

          <CNavItem
            href="/orders/delivered"
            className="!text-slate-400 hover:!text-white"
          >
            Delivered
          </CNavItem>
        </CNavGroup>

        {/* Customers */}

        <CNavItem
          href="/customers"
          className="!text-slate-300 font-medium text-base rounded-lg hover:!bg-[#241A42] hover:!text-white transition duration-200 mb-1"
        >
          <CIcon icon={cilPeople} customClassName="nav-icon !text-violet-400" />
          Customers
        </CNavItem>

        {/* Reviews */}

        <CNavItem
          href="/reviews"
          className="!text-slate-300 font-medium text-base rounded-lg hover:!bg-[#241A42] hover:!text-white transition duration-200 mb-1"
        >
          <CIcon icon={cilStar} customClassName="nav-icon !text-violet-400" />
          Reviews
        </CNavItem>

        {/* ---------- FINANCE ---------- */}

        <div className="px-3 mt-5 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Finance
          </span>
        </div>

        {/* Earnings */}

        <CNavItem
          href="/earnings"
          className="!text-slate-300 font-medium text-base rounded-lg hover:!bg-[#241A42] hover:!text-white transition duration-200 mb-1"
        >
          <CIcon icon={cilWallet} customClassName="nav-icon !text-violet-400" />
          Earnings
        </CNavItem>

        {/* Transactions */}

        <CNavItem
          href="/transactions"
          className="!text-slate-300 font-medium text-base rounded-lg hover:!bg-[#241A42] hover:!text-white transition duration-200 mb-1"
        >
          <CIcon icon={cilMoney} customClassName="nav-icon !text-violet-400" />
          Transactions
        </CNavItem>

        {/* Withdrawals */}



        {/* ---------- SUPPORT ---------- */}

        <div className="px-3 mt-5 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Support
          </span>
        </div>

        {/* Messages */}

        <CNavItem
          href="/messages"
          className="!text-slate-300 font-medium text-base rounded-lg hover:!bg-[#241A42] hover:!text-white transition duration-200 mb-1"
        >
          <CIcon
            icon={cilChatBubble}
            customClassName="nav-icon !text-violet-400"
          />
          Messages
        </CNavItem>

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
          className="!text-slate-300 font-medium text-base rounded-lg hover:!bg-[#241A42] hover:!text-white transition duration-200 mb-1"
        >
          <CIcon icon={cilUser} customClassName="nav-icon !text-violet-400" />
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
