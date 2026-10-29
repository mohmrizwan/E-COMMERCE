import { useState } from "react";

import {
  CHeader,
  CContainer,
  CHeaderToggler,
  CHeaderNav,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CAvatar,
} from "@coreui/react";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import CIcon from "@coreui/icons-react";
import { useNavigate } from "react-router-dom";

import {
  cilMenu,
  cilUser,
  cilAccountLogout,
} from "@coreui/icons";

function Header({ onMenuClick }) {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const handleLogout = () => {
    try {
      localStorage.removeItem("vendorToken");

      setMessage("Logged out successfully");
      setErrorMessage("");

      setTimeout(() => {
        navigate("/vendor/login", {});
      }, 1000);
    } catch (error) {
      setErrorMessage("Something went wrong");
    }
  };
  return (
    <CHeader
      position="sticky"
      className="!bg-white !border-b !border-[#E5E7EB] !shadow-sm"
    >
      <CContainer fluid className="px-4 md:px-6">
        {/* ================= LEFT ================= */}
        <Snackbar
          open={Boolean(message)}
          autoHideDuration={3000}
          onClose={() => setMessage("")}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert
            onClose={() => setMessage("")}
            severity="success"
            variant="filled"
            sx={{ width: "100%" }}
          >
            {message}
          </Alert>
        </Snackbar>

        {/* Error Snackbar */}
        <Snackbar
          open={Boolean(errorMessage)}
          autoHideDuration={3000}
          onClose={() => setErrorMessage("")}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert
            onClose={() => setErrorMessage("")}
            severity="error"
            variant="filled"
            sx={{ width: "100%" }}
          >
            {errorMessage}
          </Alert>
        </Snackbar>
        <div className="flex items-center">
          {/* Mobile Menu Button */}
          <CHeaderToggler
            className="!text-[#374151] hover:!text-[#173D35] !p-2"
            onClick={onMenuClick}
          >
            <CIcon icon={cilMenu} size="lg" />
          </CHeaderToggler>

          {/* Page / Panel Name */}
          <div className="hidden md:block ml-3">
            <h5 className="mb-0 font-semibold text-[#1F2937]">Vendor Panel</h5>

            <p className="mb-0 text-xs text-[#94A3B8]">Manage your store</p>
          </div>
        </div>

        {/* ================= RIGHT ================= */}

        <CHeaderNav className="ms-auto flex items-center gap-2">
          {/* Divider */}
          <div className="hidden sm:block h-8 w-px bg-[#E5E7EB] mx-2" />

          {/* User Dropdown */}
          <CDropdown variant="nav-item">
            <CDropdownToggle
              placement="bottom-end"
              className="!flex !items-center !gap-3 !py-1 !px-2 !rounded-lg hover:!bg-[#F8FAFC] transition duration-200"
              caret={false}
            >
              {/* Avatar */}
              <CAvatar
                size="md"
                src="https://ui-avatars.com/api/?name=Vendor&background=173D35&color=D6B56D"
                className="!border-2 !border-[#D6B56D]"
              />

              {/* Vendor Name */}
              <div className="hidden sm:block text-left">
                <p className="mb-0 text-sm font-semibold text-[#1F2937]">
                  Vendor
                </p>
                <p className="mb-0 text-xs text-[#94A3B8]">Store Owner</p>
              </div>
            </CDropdownToggle>

            {/* Dropdown */}
            <CDropdownMenu className="!mt-2 !min-w-[190px] !rounded-xl !border !border-[#E5E7EB] !shadow-lg !p-2">
              {/* Profile */}
              <CDropdownItem
                href="/profile"
                className="!flex !items-center !gap-2 !rounded-lg !px-3 !py-2.5 !text-[#374151] hover:!bg-[#F0F7F5] hover:!text-[#173D35] transition duration-150"
              >
                <CIcon icon={cilUser} className="!text-[#173D35]" />
                Profile
              </CDropdownItem>

              {/* Divider */}
              <div className="my-2 border-t border-[#E5E7EB]" />

              {/* Logout */}
              <CDropdownItem
                onClick={handleLogout}
                className="!flex !items-center !gap-2 !rounded-lg !px-3 !py-2.5 !text-red-500 hover:!bg-red-50 transition duration-150"
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
