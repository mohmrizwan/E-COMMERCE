import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthLayout from "../../Components/Auth/AuthLayout";
import axios from "axios";

const VendorNewPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const vendorId = location.state?.vendorId;
  const [errorMessage, setErrorMessage] = useState("");
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm();
  const password = watch("password");

  const onSubmit = async (values) => {
    setErrorMessage("");

    try {
      await axios.post("https://ecommerceba-6dtt.onrender.com/vendor/reset-password", {
        vendorId,
        password: values.password,
        confirmPassword: values.confirmPassword,
      });
      navigate("/vendor/login");
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Could not reset password");
    }
  };

  return (
    <AuthLayout
      eyebrow="New password"
      title="Create a new password"
      description="Choose a password you can remember easily."
    >
      <form className="grid gap-5" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-2">
          <label htmlFor="password" className="text-sm font-semibold text-gray-700">New password</label>
          <input
            id="password"
            type="password"
            placeholder="At least 6 characters"
            className="w-full rounded border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
            {...register("password", {
              required: "Password is required",
              minLength: { value: 6, message: "Use at least 6 characters" },
            })}
          />
          {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
        </div>

        <div className="grid gap-2">
          <label htmlFor="confirmPassword" className="text-sm font-semibold text-gray-700">Confirm password</label>
          <input
            id="confirmPassword"
            type="password"
            placeholder="Repeat your password"
            className="w-full rounded border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
            {...register("confirmPassword", {
              required: "Please confirm your password",
              validate: (value) => value === password || "Passwords do not match",
            })}
          />
          {errors.confirmPassword && <p className="text-sm text-red-600">{errors.confirmPassword.message}</p>}
        </div>

        {errorMessage && <p className="border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{errorMessage}</p>}

        <button type="submit" disabled={isSubmitting} className="rounded bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-60">
          {isSubmitting ? "Saving..." : "Reset password"}
        </button>
      </form>

      <p className="mt-5 text-center text-sm text-gray-600">
        <Link to="/vendor/login" className="text-blue-600 hover:underline">Back to login</Link>
      </p>
    </AuthLayout>
  );
};

export default VendorNewPassword;
