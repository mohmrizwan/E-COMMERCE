import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../../Components/Auth/AuthLayout";
import axios from "axios";
import Alert from "@mui/material/Alert";
import Fade from "@mui/material/Fade";
import Snackbar from "@mui/material/Snackbar";

const VendorForgotPassword = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const [errorMessage, setErrorMessage] = useState("");

  const onSubmit = async (values) => {
    setErrorMessage("");

    try {
      const response = await axios.post("http://localhost:3000/vendor/forgot-password", values);
      navigate("/vendor/reset-verify", {
        state: { vendorId: response.data.vendorId, email: values.email },
      });
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <AuthLayout
      eyebrow="Forgot password"
      title="Find your account"
      description="Enter your email and we will send you a verification code."
    >
      <Snackbar
        open={Boolean(errorMessage)}
        autoHideDuration={3000}
        onClose={() => setErrorMessage("")}
        TransitionComponent={Fade}
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

      <form className="grid gap-5" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-2">
          <label htmlFor="email" className="text-sm font-semibold text-gray-700">Email address</label>
          <input
            id="email"
            type="email"
            placeholder="you@business.com"
            className="w-full rounded border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
            {...register("email", {
              required: "Email is required",
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Enter a valid email" },
            })}
          />
          {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
        </div>

        <button type="submit" disabled={isSubmitting} className="rounded bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-60">
          {isSubmitting ? "Sending..." : "Send code"}
        </button>
      </form>

      <p className="mt-5 text-center text-sm text-gray-600">
        <Link to="/vendor/login" className="text-blue-600 hover:underline">Back to login</Link>
      </p>
    </AuthLayout>
  );
};

export default VendorForgotPassword;
