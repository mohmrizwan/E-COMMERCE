import { useState } from "react";
import { Link } from "react-router-dom";
import { AuthShell } from "./AuthShell";
import axios from "axios";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

const ForgotPassword = () => {
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const submitEmail = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await axios.post(
        "https://ecommerceba-6dtt.onrender.com/user/forgotPassword",
        { email },
      );
      setUserId(response.data.userId);
      setMessage(response.data.message);
      setStep("otp");
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Unable to send verification code.");
    } finally {
      setIsLoading(false);
    }
  };

  const submitOtp = async (event) => {
    event.preventDefault();

    if (otp.length !== 6) {
      setErrorMessage("Enter the 6-digit code sent to your email.");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await axios.post(
        "https://ecommerceba-6dtt.onrender.com/user/verifyForgotOtp",
        { userId, otp },
      );
      setMessage(response.data.message);
      setStep("password");
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Invalid verification code.");
    } finally {
      setIsLoading(false);
    }
  };

  const submitPassword = async (event) => {
    event.preventDefault();

    if (password.length < 8) {
      setErrorMessage("Your password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await axios.post(
        "https://ecommerceba-6dtt.onrender.com/user/resetPassword",
        { userId, password, confirmPassword },
      );
      setMessage(response.data.message);
      setStep("success");
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Unable to update password.");
    } finally {
      setIsLoading(false);
    }
  };

  const stepContent = {
    email: {
      eyebrow: "RESET YOUR PASSWORD",
      title: "Forgot your password?",
      description: "Enter your email and we’ll send you a verification code.",
    },
    otp: {
      eyebrow: "CHECK YOUR INBOX",
      title: "Verify your email",
      description: `We sent a 6-digit code to ${email}.`,
    },
    password: {
      eyebrow: "ALMOST DONE",
      title: "Create a new password",
      description: "Choose a strong password you have not used before.",
    },
    success: {
      eyebrow: "PASSWORD UPDATED",
      title: "You’re all set",
      description:
        "Your password has been updated. You can now log in with your new password.",
    },
  }[step];

  return (
    <AuthShell>
      <Snackbar
        open={Boolean(message)}
        autoHideDuration={3000}
        onClose={() => setMessage("")}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={() => setMessage("")} severity="success" variant="filled" sx={{ width: "100%" }}>
          {message}
        </Alert>
      </Snackbar>

      <Snackbar
        open={Boolean(errorMessage)}
        autoHideDuration={3500}
        onClose={() => setErrorMessage("")}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={() => setErrorMessage("")} severity="error" variant="filled" sx={{ width: "100%" }}>
          {errorMessage}
        </Alert>
      </Snackbar>

      <div className="auth-heading forgot-heading">
        <p className="auth-eyebrow">{stepContent.eyebrow}</p>
        <h2>{stepContent.title}</h2>
        <p>{stepContent.description}</p>
      </div>

      {step === "email" && (
        <form className="auth-form" onSubmit={submitEmail}>
          <label className="field-label" htmlFor="forgot-email">
            Email address
          </label>
          <input
            className="auth-input"
            id="forgot-email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
          <button className="auth-button" type="submit">
            {isLoading ? "Sending..." : "Send verification code"}
          </button>
        </form>
      )}

      {step === "otp" && (
        <form className="auth-form" onSubmit={submitOtp}>
          <label className="field-label" htmlFor="forgot-otp">
            Verification code
          </label>
          <input
            className="auth-input otp-input"
            id="forgot-otp"
            type="text"
            inputMode="numeric"
            maxLength="6"
            placeholder="000000"
            value={otp}
            onChange={(event) => setOtp(event.target.value.replace(/\D/g, ""))}
            required
          />
          <button className="auth-button" type="submit">
            {isLoading ? "Verifying..." : "Verify code"}
          </button>
          <button
            className="text-button"
            type="button"
            onClick={() => setStep("email")}
          >
            Use a different email
          </button>
        </form>
      )}

      {step === "password" && (
        <form className="auth-form" onSubmit={submitPassword}>
          <label className="field-label" htmlFor="new-password">
            New password
          </label>
          <div className="password-field">
            <input
              className="auth-input"
              id="new-password"
              type={showPassword ? "text" : "password"}
              placeholder="At least 8 characters"
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
            <button
              className="password-toggle"
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          <label className="field-label" htmlFor="confirm-password">
            Confirm new password
          </label>
          <input
            className="auth-input"
            id="confirm-password"
            type={showPassword ? "text" : "password"}
            placeholder="Repeat your new password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            required
          />
          <button className="auth-button" type="submit">
            {isLoading ? "Updating..." : "Update password"}
          </button>
        </form>
      )}

      {step === "success" && (
        <div className="forgot-success">
          <span className="success-mark" aria-hidden="true">
            ✓
          </span>
          <Link className="auth-button success-button" to="/login">
            Back to login
          </Link>
        </div>
      )}

      {step !== "success" && (
        <p className="auth-switch forgot-back">
          <Link to="/login">Back to login</Link>
        </p>
      )}
    </AuthShell>
  );
};

export default ForgotPassword;
