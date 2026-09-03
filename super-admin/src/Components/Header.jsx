import React from "react";

import {
  CHeader,
  CContainer,
  CHeaderToggler,
  CHeaderNav,
  CNavItem,
  CNavLink,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CAvatar,
} from "@coreui/react";

import CIcon from "@coreui/icons-react";

import {
  cilMenu,
  cilBell,
  cilUser,
  cilSettings,
  cilAccountLogout,
} from "@coreui/icons";

function Header({ onMenuClick }) {
  return (
    <CHeader
      position="sticky"
      className="
        !bg-white
        !border-b
        !border-[#E6C5DE]
        !shadow-sm
      "
    >
      <CContainer fluid className="px-4 md:px-6">

        {/* ================= LEFT ================= */}

        <div className="flex items-center">

          {/* Mobile Menu Button */}

          <CHeaderToggler
            className="
              !text-[#7A6A76]
              hover:!text-[#B83E91]
              hover:!bg-[#FFF4FA]
              !p-2
              !rounded-lg
              transition
              duration-200
            "
            onClick={onMenuClick}
          >
            <CIcon icon={cilMenu} size="lg" />
          </CHeaderToggler>

          {/* Panel Name */}

          <div className="hidden md:block ml-3">
            <h5 className="mb-0 font-semibold text-[#111111]">
              Vendor Panel
            </h5>

            <p className="mb-0 text-xs text-[#7A6A76]">
              Manage your store
            </p>
          </div>
        </div>

        {/* ================= RIGHT ================= */}

        <CHeaderNav className="ms-auto flex items-center gap-2">

          {/* Notification */}

          <CNavItem>
            <CNavLink
              href="#"
              className="
                !flex
                !items-center
                !justify-center
                !w-10
                !h-10
                !p-0
                !rounded-lg
                !text-[#7A6A76]
                hover:!text-[#B83E91]
                hover:!bg-[#FFF4FA]
                transition
                duration-200
              "
            >
              <CIcon icon={cilBell} size="lg" />
            </CNavLink>
          </CNavItem>

          {/* Divider */}

          <div className="hidden sm:block h-8 w-px bg-[#E6C5DE] mx-2" />

          {/* User Dropdown */}

          <CDropdown variant="nav-item">

            <CDropdownToggle
              placement="bottom-end"
              className="
                !flex
                !items-center
                !gap-3
                !py-1
                !px-2
                !rounded-lg
                hover:!bg-[#FFF4FA]
                transition
                duration-200
              "
              caret={false}
            >

              {/* Avatar */}

              <CAvatar
                size="md"
                src="https://ui-avatars.com/api/?name=Vendor&background=B83E91&color=fff"
                className="!border-2 !border-[#E6C5DE]"
              />

              {/* Vendor Name */}

              <div className="hidden sm:block text-left">

                <p className="mb-0 text-sm font-semibold text-[#111111]">
                  Vendor
                </p>

                <p className="mb-0 text-xs text-[#7A6A76]">
                  Store Owner
                </p>

              </div>
            </CDropdownToggle>

            {/* ================= DROPDOWN ================= */}

            <CDropdownMenu
              className="
                !mt-2
                !min-w-[190px]
                !rounded-xl
                !border
                !border-[#E6C5DE]
                !bg-white
                !shadow-lg
                !p-2
              "
            >

              {/* Profile */}

              <CDropdownItem
                href="/profile"
                className="
                  !flex
                  !items-center
                  !gap-2
                  !rounded-lg
                  !px-3
                  !py-2.5
                  !text-[#111111]
                  hover:!bg-[#FFF4FA]
                  hover:!text-[#B83E91]
                  transition
                  duration-150
                "
              >
                <CIcon
                  icon={cilUser}
                  className="!text-[#B83E91]"
                />

                Profile
              </CDropdownItem>

              {/* Settings */}

              <CDropdownItem
                href="/settings"
                className="
                  !flex
                  !items-center
                  !gap-2
                  !rounded-lg
                  !px-3
                  !py-2.5
                  !text-[#111111]
                  hover:!bg-[#FFF4FA]
                  hover:!text-[#B83E91]
                  transition
                  duration-150
                "
              >
                <CIcon
                  icon={cilSettings}
                  className="!text-[#B83E91]"
                />

                Settings
              </CDropdownItem>

              {/* Divider */}

              <div className="my-2 border-t border-[#E6C5DE]" />

              {/* Logout */}

              <CDropdownItem
                href="#"
                className="
                  !flex
                  !items-center
                  !gap-2
                  !rounded-lg
                  !px-3
                  !py-2.5
                  !text-red-500
                  hover:!bg-red-50
                  transition
                  duration-150
                "
              >
                <CIcon icon={cilAccountLogout} />

                Logout
              </CDropdownItem>

            </CDropdownMenu>
          </CDropdown>
        </CHeaderNav>
      </CContainer>
    </CHeader>
  );
}

export default Header;
