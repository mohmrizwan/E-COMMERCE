import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthLayout from "../../Components/Auth/AuthLayout";
import { vendorAuthApi } from "../../services/vendorAuthApi";

const OTP_LENGTH = 6;

const VendorVerifyOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const vendorId = params.get("vendorId");
  const email = params.get("email") || "your email address";
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const [submitError, setSubmitError] = useState("");
  const [notice, setNotice] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (!vendorId) navigate("/vendor/signup", { replace: true });
  }, [navigate, vendorId]);

  useEffect(() => {
    if (cooldown === 0) return undefined;
    const timer = window.setInterval(() => setCooldown((value) => value - 1), 1000);
    return () => window.clearInterval(timer);
  }, [cooldown]);

  const handleOtpChange = (index, value) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const nextOtp = [...otp];
    nextOtp[index] = digit;
    setOtp(nextOtp);
    setSubmitError("");
    if (digit && index < OTP_LENGTH - 1) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, event) => {
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (event) => {
    event.preventDefault();
    const pastedOtp = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (!pastedOtp) return;
    setOtp(Array.from({ length: OTP_LENGTH }, (_, index) => pastedOtp[index] || ""));
    inputRefs.current[Math.min(pastedOtp.length, OTP_LENGTH) - 1]?.focus();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const value = otp.join("");
    if (value.length !== OTP_LENGTH) {
      setSubmitError("Enter the 6-digit verification code");
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");
    try {
      await vendorAuthApi.verifyOtp({ vendorId, otp: value });
      navigate("/vendor/login", { replace: true, state: { verified: true } });
    } catch (error) {
      setSubmitError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0 || isResending) return;
    setIsResending(true);
    setSubmitError("");
    setNotice("");
    try {
      await vendorAuthApi.resendOtp({ vendorId });
      setOtp(Array(OTP_LENGTH).fill(""));
      setNotice("A new verification code has been sent.");
      setCooldown(30);
      inputRefs.current[0]?.focus();
    } catch (error) {
      setSubmitError(error.message);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <AuthLayout
      eyebrow="Almost there"
      title="Verify your email"
      description="Enter the 6-digit code we sent to finish setting up your vendor account."
    >
      <form className="grid gap-6" onSubmit={handleSubmit}>
        <div className="rounded-2xl border border-violet-100 bg-violet-50/70 p-4">
          <p className="text-xs leading-5 text-violet-900">
            We sent a verification code to <strong className="break-all">{email}</strong>. The code expires in 10 minutes.
          </p>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-700" htmlFor="otp-0">Verification code</label>
          <div className="mt-3 flex gap-2 sm:gap-3" onPaste={handlePaste}>
            {otp.map((digit, index) => (
              <input
                key={`otp-${index}`}
                ref={(element) => { inputRefs.current[index] = element; }}
                id={`otp-${index}`}
                value={digit}
                onChange={(event) => handleOtpChange(index, event.target.value)}
                onKeyDown={(event) => handleKeyDown(index, event)}
                inputMode="numeric"
                autoComplete={index === 0 ? "one-time-code" : "off"}
                maxLength={1}
                aria-label={`Verification digit ${index + 1}`}
                className="size-11 rounded-xl border border-slate-200 bg-slate-50 text-center text-lg font-extrabold text-[#17112B] outline-none transition hover:border-slate-300 focus:border-violet-600 focus:bg-white focus:ring-4 focus:ring-violet-600/10 sm:size-14"
              />
            ))}
          </div>
        </div>

        {notice && <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs text-emerald-700" role="status">{notice}</p>}
        {submitError && <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700" role="alert">{submitError}</p>}

        <button type="submit" disabled={isSubmitting} className="min-h-13 rounded-xl border-0 bg-violet-700 px-5 font-extrabold text-white transition hover:bg-violet-800 disabled:cursor-wait disabled:opacity-60">
          {isSubmitting ? "Verifying..." : "Verify email"}
        </button>
      </form>

      <div className="mt-6 flex flex-col items-center gap-3 text-center text-sm text-slate-500">
        <button type="button" onClick={handleResend} disabled={cooldown > 0 || isResending} className="border-0 bg-transparent font-bold text-violet-700 disabled:cursor-not-allowed disabled:text-slate-400">
          {isResending ? "Sending new code..." : cooldown > 0 ? `Resend code in ${cooldown}s` : "Resend code"}
        </button>
        <Link to="/vendor/signup" className="font-bold text-slate-500 no-underline hover:text-violet-700">Use a different email</Link>
      </div>
    </AuthLayout>
  );
};

export default VendorVerifyOtp;
