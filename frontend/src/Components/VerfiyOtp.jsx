import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthShell } from "./AuthShell";
import { useForm } from "react-hook-form";

const VerifyOtp = () => {
  const [timeLeft, setTimeLeft] = useState(60);

  const inputRefs = useRef([]);
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email || "";
  const {
    register,
    handleSubmit,
    setValue,
    resetField,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: location.state?.name || "",
      otp: ["", "", "", "", "", ""],
    },
  });

  const otp = watch("otp") || [];

  // Countdown
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // OTP input
  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    setValue(`otp.${index}`, value, { shouldDirty: true, shouldValidate: true });

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Backspace
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Paste OTP
  const handlePaste = (e) => {
    e.preventDefault();

    const pastedData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    if (!pastedData) return;

    pastedData.split("").forEach((digit, index) => {
      setValue(`otp.${index}`, digit, {
        shouldDirty: true,
        shouldValidate: true,
      });
    });

    const nextIndex = Math.min(pastedData.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  // Verify
  const handleVerify = (data) => {
    console.log("Name:", data.name);
    console.log("Email:", email);
    console.log("OTP:", data.otp.join(""));

    // Axios API yahan connect karenge
  };

  // Resend OTP
  const handleResend = () => {
    if (timeLeft > 0) return;

    resetField("otp");
    setTimeLeft(60);

    inputRefs.current[0]?.focus();

    console.log("Resend OTP to:", email);

    // Resend OTP API yahan connect karenge
  };

  return (
    <AuthShell>
      <div className="auth-heading text-center">
        <p className="auth-eyebrow">EMAIL VERIFICATION</p>

        <h2>Verify your email</h2>

        <p>
          We’ve sent a 6-digit verification code to
          <br />

          <strong className="text-[#6C3BFF] font-[inter]">
            {email || "your email address"}
          </strong>
        </p>
      </div>

      <form className="auth-form" onSubmit={handleSubmit(handleVerify)}>
   

        {/* OTP Boxes */}
        <div className="flex justify-center gap-3 my-6">
          {otp.map((digit, index) => (
            <input
              key={index}
              {...register(`otp.${index}`, {
                required: "Enter the complete 6-digit OTP",
                pattern: {
                  value: /^\d$/,
                  message: "OTP must contain only numbers",
                },
              })}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onPaste={index === 0 ? handlePaste : undefined}
              aria-label={`OTP digit ${index + 1}`}
              className="
                w-12 h-14
                sm:w-14 sm:h-16
                text-center
                text-xl
                font-bold
                font-[inter]
                border
                border-gray-300
                rounded-xl
                outline-none
                transition
                duration-200
                focus:border-[#6C3BFF]
                focus:ring-2
                focus:ring-[#6C3BFF]/20
                bg-white
              "
              autoFocus={index === 0}
            />
          ))}
        </div>
        {errors.otp && (
          <p className="text-center text-xs font-[inter] text-red-500 -mt-4 mb-6">
            {errors.otp.find((error) => error)?.message ||
              "Enter the complete 6-digit OTP"}
          </p>
        )}

        {/* Timer */}
        <div className="text-center mb-6">
          {timeLeft > 0 ? (
            <p className="text-sm text-gray-500 font-[inter]">
              Code expires in{" "}
              <span className="font-bold text-[#6C3BFF]">
                00:{String(timeLeft).padStart(2, "0")}
              </span>
            </p>
          ) : (
            <p className="text-sm text-red-500 font-[inter]">
              OTP has expired
            </p>
          )}
        </div>

        {/* Verify Button */}
        <button
          type="submit"
          className="
            auth-button
            w-full
            transition
            duration-200
            hover:opacity-90
            disabled:opacity-50
          "
          disabled={otp.join("").length !== 6}
        >
          Verify OTP
        </button>

        {/* Resend */}
        <div className="text-center mt-5">
          <p className="text-sm text-gray-500 font-[inter]">
            Didn’t receive the code?
          </p>

          <button
            type="button"
            onClick={handleResend}
            disabled={timeLeft > 0}
            className={`
              mt-1
              text-sm
              font-bold
              font-[inter]
              transition
              ${
                timeLeft > 0
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-[#6C3BFF] hover:text-[#8c6cec]"
              }
            `}
          >
            {timeLeft > 0 ? `Resend in ${timeLeft}s` : "Resend OTP"}
          </button>
        </div>
      </form>

      {/* Back */}
      <div className="text-center mt-6">
        <Link
          to="/create-account"
          className="
            text-sm
            font-bold
            font-[inter]
            text-gray-500
            hover:text-[#6C3BFF]
            transition
            duration-200
          "
        >
          ← Back to Create Account
        </Link>
      </div>
    </AuthShell>
  );
};

export default VerifyOtp;