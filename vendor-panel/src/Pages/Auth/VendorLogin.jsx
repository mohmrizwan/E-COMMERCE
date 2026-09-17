import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import AuthLayout from "../../Components/Auth/AuthLayout";
import FormField from "../../Components/Auth/FormField";
import axios from "axios";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

const VendorLogin = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: "onBlur",
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/vendor/login",
        values,
      );

      // Success message
      setMessage(response.data.message);
      setErrorMessage("");

      localStorage.setItem("vendorToken", response.data.token);
      // Wait for Snackbar to show, then go to OTP page
      setTimeout(() => {
        navigate("/dashboard", {
          state: {
            vendorId: response.data.vendorId,
            email: values.email,
          },
        });
      }, 1500);
    } catch (error) {
      console.log(error.response?.data);

      // Error message
      setErrorMessage(error.response?.data?.message || "Something went wrong");

      setMessage("");
    }
  };

  return (
    <AuthLayout
      eyebrow="Welcome back"
      title="Sign in to your store"
      description="Access your vendor workspace and keep your business moving."
    >
      {/* Success Snackbar */}
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

      <form className="grid gap-5" onSubmit={handleSubmit(onSubmit)} noValidate>
        <FormField
          label="Email address"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@business.com"
          register={register}
          error={errors.email}
          rules={{
            required: "Email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Enter a valid email address",
            },
          }}
        />

        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <label
              htmlFor="password"
              className="text-xs font-bold text-slate-700"
            >
              Password
            </label>
            <Link
              to="/vendor/forgot-password"
              className="text-xs font-bold text-violet-700 no-underline hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <input
              id="password"
              className="min-h-12 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 pr-20 text-sm text-[#17112B] outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-violet-600 focus:bg-white focus:ring-4 focus:ring-violet-600/10 aria-[invalid=true]:border-red-600"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Enter your password"
              aria-invalid={Boolean(errors.password)}
              aria-describedby={errors.password ? "password-error" : undefined}
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 border-0 bg-transparent text-xs font-extrabold text-violet-700"
              onClick={() => setShowPassword((visible) => !visible)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          {errors.password && (
            <span
              id="password-error"
              className="text-xs text-red-700"
              role="alert"
            >
              {errors.password.message}
            </span>
          )}
        </div>

        {submitError && (
          <div
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700"
            role="alert"
          >
            {submitError}
          </div>
        )}

        <button
          type="submit"
          className="min-h-13 rounded-xl border-0 bg-violet-700 px-5 font-extrabold text-white transition hover:bg-violet-800 disabled:cursor-wait disabled:opacity-60"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Signing in..." : "Sign in"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        Don&apos;t have an account?{" "}
        <Link
          className="font-bold text-violet-700 no-underline hover:underline"
          to="/vendor/signup"
        >
          Sign up
        </Link>
      </p>
    </AuthLayout>
  );
};

export default VendorLogin;
