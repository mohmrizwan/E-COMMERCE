import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthLayout from "../../Components/Auth/AuthLayout";
import axios from "axios";

const VendorResetVerify = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [errorMessage, setErrorMessage] = useState("");
  const vendorId = location.state?.vendorId;
  const email = location.state?.email;
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async (values) => {
    setErrorMessage("");

    try {
      await axios.post("http://localhost:3000/vendor/verify-reset-otp", {
        vendorId,
        otp: values.otp,
      });
      navigate("/vendor/new-password", { state: { vendorId } });
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Invalid verification code");
    }
  };

  return (
    <AuthLayout
      eyebrow="Verify email"
      title="Enter verification code"
      description="We sent a 6-digit code to your email."
    >
      <form className="grid gap-5" onSubmit={handleSubmit(onSubmit)}>
        <p className="text-sm text-gray-600">Code sent to: <strong>{email}</strong></p>

        <div className="grid gap-2">
          <label htmlFor="otp" className="text-sm font-semibold text-gray-700">OTP code</label>
          <input
            id="otp"
            type="text"
            inputMode="numeric"
            placeholder="Enter 6 digit code"
            className="w-full rounded border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
            {...register("otp", {
              required: "OTP is required",
              pattern: { value: /^[0-9]{6}$/, message: "OTP must be 6 digits" },
            })}
          />
          {errors.otp && <p className="text-sm text-red-600">{errors.otp.message}</p>}
        </div>

        {errorMessage && <p className="border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{errorMessage}</p>}

        <button type="submit" disabled={isSubmitting} className="rounded bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-60">
          {isSubmitting ? "Checking..." : "Verify code"}
        </button>
      </form>

      <p className="mt-5 text-center text-sm text-gray-600">
        <Link to="/vendor/forgot-password" className="text-blue-600 hover:underline">Use another email</Link>
      </p>
    </AuthLayout>
  );
};

export default VendorResetVerify;
