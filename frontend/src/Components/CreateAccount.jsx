import { useState } from "react";
import { Link } from "react-router-dom";
import { AuthShell } from "./AuthShell";

const accountOptions = [
  {
    id: "customer",
    icon: "bag",
    title: "Shop on VendorAflame",
    description:
      "Discover products, compare options and purchase from trusted vendors.",
  },
  {
    id: "vendor",
    icon: "store",
    title: "Sell on VendorAflame",
    description:
      "Create a store, list products and sell to customers on VendorAflame.",
  },
];

const CreateAccount = () => {
  const [accountType, setAccountType] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <AuthShell>
      <div className="auth-heading">
        <p className="auth-eyebrow">JOIN THE MARKETPLACE</p>
        <h2>Create your account</h2>
        <p>Join VendorAflame and start shopping or selling today.</p>
      </div>
      <form className="auth-form">
        <label className="field-label" htmlFor="create-name">
          Full name
        </label>
        <input
          className="auth-input"
          id="create-name"
          type="text"
          placeholder="Your full name"
          autoComplete="name"
          required
        />
        <label className="field-label" htmlFor="create-email">
          Email address
        </label>
        <input
          className="auth-input"
          id="create-email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          required
        />
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
            required
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
        <label className="field-label" htmlFor="confirm-password">
          Confirm password
        </label>
        <input
          className="auth-input"
          id="confirm-password"
          type={showPassword ? "text" : "password"}
          placeholder="Repeat your password"
          autoComplete="new-password"
          required
        />

        <fieldset className="account-choice">
          <legend>How do you want to use VendorAflame?</legend>
          <p className="choice-help">
            Choose the experience that fits you best.
          </p>
          <div className="choice-grid">
            {accountOptions.map((option) => (
              <button
                key={option.id}
                className={`choice-card ${accountType === option.id ? "selected" : ""}`}
                type="button"
                onClick={() => setAccountType(option.id)}
                aria-pressed={accountType === option.id}
              >
                <span
                  className={`choice-icon ${option.icon}`}
                  aria-hidden="true"
                >
                  {option.icon === "bag" ? "⌂" : "□"}
                </span>
                <span className="choice-content">
                  <strong>{option.title}</strong>
                  <small>{option.description}</small>
                </span>
                {accountType === option.id && (
                  <span className="choice-check" aria-label="Selected">
                    ✓
                  </span>
                )}
              </button>
            ))}
          </div>
        </fieldset>
        <div>
          <label className="field-label" htmlFor="confirm-password">
            One Time Password (OTP)
          </label>
          <input
            className="auth-input"
            id="confirm-password"
            placeholder="One Time Password"
            autoComplete="new-password"
            required
          />
          <Link className="text-xs p-3 text-[#6C3BFF] font-[inter] font-bold hover:text-[#8c6cec] transition duration-100">Send OTP</Link>
        </div>
        <label className="terms-label">
          <input type="checkbox" required />{" "}
          <span>
            I agree to the <Link to="#">Terms & Conditions</Link> and{" "}
            <Link to="#">Privacy Policy</Link>
          </span>
        </label>
        <button className="auth-button" type="submit">
          Create Account
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
