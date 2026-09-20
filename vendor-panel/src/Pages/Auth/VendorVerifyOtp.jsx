import { useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import AuthLayout from "../../Components/Auth/AuthLayout";
import axios from "axios";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

const VendorVerifyOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const vendorId = location.state?.vendorId;
  const email = location.state?.email;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(
        "https://ecommerceba-6dtt.onrender.com/vendor/verify",
        {
          vendorId,
          otp: data.otp,
        }
      );

      setMessage(response.data.message);
      setErrorMessage("");

      // Snackbar show hone ke baad login page
      setTimeout(() => {
        navigate("/vendor/login");
      }, 1500);
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "OTP verification failed"
      );
      setMessage("");
    }
  };

  const handleResend = async () => {
    try {
      const response = await axios.post(
        "https://ecommerceba-6dtt.onrender.com/vendor/resend",
        {
          vendorId,
        }
      );

      setMessage(response.data.message || "OTP sent again");
      setErrorMessage("");
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Failed to resend OTP"
      );
      setMessage("");
    }
  };

  return (
    <>
      <AuthLayout
        eyebrow="Email Verification"
        title="Verify your email"
        description="Enter the OTP sent to your email."
      >
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5">
          <p className="text-sm text-gray-600">
            OTP sent to: <strong>{email}</strong>
          </p>

          <div>
            <label className="text-sm font-semibold text-gray-700">
              Enter OTP
            </label>

            <input
              type="text"
              placeholder="Enter 6 digit OTP"
              className="mt-2 w-full rounded border border-gray-300 px-4 py-3"
              {...register("otp", {
                required: "OTP is required",
                pattern: {
                  value: /^[0-9]{6}$/,
                  message: "OTP must be 6 digits",
                },
              })}
            />

            {errors.otp && (
              <p className="mt-1 text-sm text-red-600">
                {errors.otp.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {isSubmitting ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        <div className="mt-5 text-center">
          <button
            type="button"
            onClick={handleResend}
            className="font-semibold text-blue-600 hover:underline"
          >
            Resend OTP
          </button>
        </div>
      </AuthLayout>

      {/* Success Snackbar */}
      <Snackbar
        open={Boolean(message)}
        autoHideDuration={3000}
        onClose={() => setMessage("")}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
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
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
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
    </>
  );
};

export default VendorVerifyOtp;

