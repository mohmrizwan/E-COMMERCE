import { useState } from "react";
import { Link } from "react-router-dom";
import { AuthShell } from "./AuthShell";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <AuthShell>
      <div className="auth-heading"><p className="auth-eyebrow">WELCOME BACK</p><h2>Welcome back</h2><p>Login to your VendorAflame account</p></div>
      <form className="auth-form">
        <label className="field-label" htmlFor="login-email">Email address</label>
        <input className="auth-input" id="login-email" type="email" placeholder="you@example.com" autoComplete="email" required />
        <label className="field-label" htmlFor="login-password">Password</label>
        <div className="password-field"><input className="auth-input" id="login-password" type={showPassword ? "text" : "password"} placeholder="Enter your password" autoComplete="current-password" required /><button className="password-toggle" type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? "Hide" : "Show"}</button></div>
        <div className="form-options"><label className="check-label"><input type="checkbox" /> <span>Remember me</span></label><Link to="#" className="auth-link">Forgot password?</Link></div>
        <button className="auth-button" type="submit">Login</button>
      </form>
      <p className="auth-switch">Don't have an account? <Link to="/create">Create Account</Link></p>
      <div className="auth-divider"><span>OR</span></div>
      <div className="social-actions"><button className="social-button" type="button"><strong className="google-icon">G</strong> Continue with Google</button><button className="social-button" type="button"><strong className="github-icon">GH</strong> Continue with GitHub</button></div>
    </AuthShell>
  );
};

export default Login;
