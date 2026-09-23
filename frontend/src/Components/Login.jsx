import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthShell } from "./AuthShell";
import { useForm } from "react-hook-form";
import axios from "axios";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Form Validation
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(
        "https://ecommerceba-6dtt.onrender.com/user/login",
        data,
      );

      localStorage.setItem("userToken", response.data.token);
      setMessage(response.data.message);
      setErrorMessage("");

      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (error) {
      console.log(error)
      setErrorMessage(error.response?.data?.message || "Something went wrong");

      setMessage("");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthShell>
      <div className="auth-heading">
        <p className="auth-eyebrow">WELCOME BACK</p>
        <h2>Welcome back</h2>
        <p>Login to your VendorAflame account</p>
      </div>

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
        <label className="field-label" htmlFor="login-email">
          Email address
        </label>
        <input
          className="auth-input"
          id="login-email"
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
          <p className="text-xs font-[inter] text-red-500 mt-1">
            {" "}
            {errors.email.message}
          </p>
        )}
        <label className="field-label" htmlFor="login-password">
          Password
        </label>
        <div className="password-field">
          <input
            className="auth-input"
            id="login-password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            autoComplete="current-password"
            required
            {...register("password", {
              required: "Enter Password",
            })}
          />
          {errors.password && (
            <p className="text-xs font-[inter] text-red-600 mt-1">
              {errors.password.message}
            </p>
          )}
          <button
            className="password-toggle"
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
        <div className="form-options">
          <Link to="/forgot-password" className="auth-link">
            Forgot password?
          </Link>
        </div>
        <button className="auth-button" type="submit">
          {isLoading ? (
            <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            "Login Account"
          )}
        </button>
      </form>
      <p className="auth-switch">
        Don't have an account? <Link to="/create">Create Account</Link>
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

export default Login;
