import { useState } from "react";
import { Link } from "react-router-dom";
import { AuthShell } from "./AuthShell";
import { useForm } from "react-hook-form";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  // Form Validation
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = () => {};

  return (
    <AuthShell>
      <div className="auth-heading">
        <p className="auth-eyebrow">WELCOME BACK</p>
        <h2>Welcome back</h2>
        <p>Login to your VendorAflame account</p>
      </div>
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
            <p className="text-xs font-[inter] text-red-600 mt-1">{errors.password.message}</p>
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
       
          <Link to="#" className="auth-link">
            Forgot password?
          </Link>
        </div>
        <button className="auth-button" type="submit">
          Login
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
