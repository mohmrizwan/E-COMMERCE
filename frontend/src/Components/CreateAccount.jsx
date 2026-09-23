import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthShell } from "./AuthShell";
import { useForm } from "react-hook-form";
import axios from "axios";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

const CreateAccount = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch("password");

  const onSubmit = async (data) => {
    setIsLoading(true);

    try {
      console.log("Form Data:", data);

      const response = await axios.post(
        "https://ecommerceba-6dtt.onrender.com/user/create",
        data
      );

      setMessage(response.data.message);
      setErrorMessage("");

      setTimeout(() => {
        navigate("/otpVerfiy", {
          state: {
            userId: response.data.userId,
            email: data.email,
          },
        });
      }, 1500);
    } catch (error) {
      console.log("Registration Error:", error);
      console.log("Backend Response:", error.response?.data);

      setErrorMessage(
        error.response?.data?.message || "Something went wrong"
      );

      setMessage("");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthShell>
      <div className="auth-heading">
        <p className="auth-eyebrow">JOIN THE MARKETPLACE</p>

        <h2>Create your account</h2>

        <p>Join VendorAflame and start shopping or selling today.</p>
      </div>

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

      <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
        {/* Full Name */}
        <label className="field-label" htmlFor="create-name">
          Full name
        </label>

        <input
          className="auth-input"
          id="create-name"
          type="text"
          placeholder="Your full name"
          autoComplete="name"
          {...register("name", {
            required: "Name is required",
            minLength: {
              value: 3,
              message: "Name must be at least 3 characters",
            },
          })}
        />

        {errors.name && (
          <p className="text-xs font-[inter] text-red-500">
            {errors.name.message}
          </p>
        )}

        {/* Email */}
        <label className="field-label" htmlFor="create-email">
          Email address
        </label>

        <input
          className="auth-input"
          id="create-email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Enter a valid email address",
            },
          })}
        />

        {errors.email && (
          <p className="text-red-500 font-[inter] text-xs">
            {errors.email.message}
          </p>
        )}

        {/* Phone */}
        <label className="field-label" htmlFor="create-phone">
          Phone number
        </label>

        <input
          className="auth-input"
          id="create-phone"
          type="tel"
          placeholder="Enter your phone number"
          autoComplete="tel"
          {...register("phone", {
            required: "Phone is required",
            pattern: {
              value: /^[6-9]\d{9}$/,
              message: "Enter a valid 10-digit phone number",
            },
          })}
        />

        {errors.phone && (
          <p className="text-red-500 text-xs font-[inter]">
            {errors.phone.message}
          </p>
        )}

        {/* Password */}
        <label className="field-label" htmlFor="create-password">
          Password
        </label>

        <div className="password-field">
          <input
            className="auth-input"
            id="create-password"
            type={showPassword ? "text" : "password"}
            placeholder="Create a secure password"
            autoComplete="new-password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
          />

          <button
            className="password-toggle"
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        {errors.password && (
          <p className="text-red-500 text-xs font-[inter]">
            {errors.password.message}
          </p>
        )}

        {/* Confirm Password */}
        <label className="field-label" htmlFor="confirm-password">
          Confirm password
        </label>

        <input
          className="auth-input"
          id="confirm-password"
          type={showPassword ? "text" : "password"}
          placeholder="Repeat your password"
          autoComplete="new-password"
          {...register("confirmPassword", {
            required: "Confirm your password",
            validate: (value) =>
              value === password || "Passwords do not match",
          })}
        />

        {errors.confirmPassword && (
          <p className="text-red-500 text-xs font-[inter]">
            {errors.confirmPassword.message}
          </p>
        )}

        {/* Terms */}
        <label className="terms-label">
          <input
            type="checkbox"
            {...register("terms", {
              required: "You must accept the Terms & Conditions",
            })}
          />

          <span>
            I agree to the{" "}
            <Link to="/term&condition">Terms & Conditions</Link>{" "}
            and <Link to="/term&condition">Privacy Policy</Link>
          </span>
        </label>

        {errors.terms && (
          <p className="text-red-500 text-xs font-[inter]">
            {errors.terms.message}
          </p>
        )}

        {/* Submit */}
        <button className="auth-button" type="submit" disabled={isLoading}>
          {isLoading ? (
            <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            "Create Account"
          )}
        </button>
      </form>

      <p className="auth-switch">
        Already have an account? <Link to="/login">Login</Link>
      </p>

      <div className="auth-divider">
        <span>OR</span>
      </div>

      <div className="social-actions">
        <button className="social-button w-100" type="button">
          <strong className="google-icon">G</strong> Continue with Google
        </button>
      </div>
    </AuthShell>
  );
};

export default CreateAccount;

