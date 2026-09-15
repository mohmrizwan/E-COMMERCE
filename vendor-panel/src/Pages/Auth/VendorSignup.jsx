import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import AuthLayout from "../../Components/Auth/AuthLayout";
import FormField from "../../Components/Auth/FormField";
import { vendorAuthApi } from "../../services/vendorAuthApi";

const VendorSignup = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: "onBlur",
    defaultValues: {
      businessName: "",
      ownerName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });
  const password = watch("password");

  const onSubmit = async (values) => {
    setSubmitError("");

    try {
      const response = await vendorAuthApi.signup(values);
      navigate(`/vendor/verify?vendorId=${response.vendorId}&email=${encodeURIComponent(values.email)}`, { replace: true });
    } catch (error) {
      setSubmitError(error.message);
    }
  };

  return (
    <AuthLayout
      eyebrow="Start selling"
      title="Create your vendor account"
      description="Set up your business profile and take your store online."
    >
      <form className="grid gap-5" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField
            label="Business name"
            name="businessName"
            type="text"
            autoComplete="organization"
            placeholder="Your store name"
            register={register}
            error={errors.businessName}
            rules={{
              required: "Business name is required",
              minLength: { value: 2, message: "Use at least 2 characters" },
            }}
          />
          <FormField
            label="Owner name"
            name="ownerName"
            type="text"
            autoComplete="name"
            placeholder="Your full name"
            register={register}
            error={errors.ownerName}
            rules={{
              required: "Owner name is required",
              minLength: { value: 2, message: "Use at least 2 characters" },
            }}
          />
        </div>

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

        <FormField
          label="Phone number"
          name="phone"
          type="tel"
          inputMode="numeric"
          autoComplete="tel"
          placeholder="10-digit phone number"
          register={register}
          error={errors.phone}
          rules={{
            required: "Phone number is required",
            pattern: {
              value: /^\d{10}$/,
              message: "Phone number must contain exactly 10 digits",
            },
          }}
        />

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="grid gap-2">
            <label htmlFor="password" className="text-xs font-bold text-slate-700">Password</label>
            <div className="relative">
              <input
                id="password"
                className="min-h-12 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 pr-20 text-sm text-[#17112B] outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-violet-600 focus:bg-white focus:ring-4 focus:ring-violet-600/10 aria-[invalid=true]:border-red-600"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="At least 6 characters"
                aria-invalid={Boolean(errors.password)}
                aria-describedby={errors.password ? "password-error" : undefined}
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 6, message: "Use at least 6 characters" },
                })}
              />
              <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 border-0 bg-transparent text-xs font-extrabold text-violet-700" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? "Hide password" : "Show password"}>
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            {errors.password && <span id="password-error" className="text-xs text-red-700" role="alert">{errors.password.message}</span>}
          </div>

          <div className="grid gap-2">
            <label htmlFor="confirmPassword" className="text-xs font-bold text-slate-700">Confirm password</label>
            <div className="relative">
              <input
                id="confirmPassword"
                className="min-h-12 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 pr-20 text-sm text-[#17112B] outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-violet-600 focus:bg-white focus:ring-4 focus:ring-violet-600/10 aria-[invalid=true]:border-red-600"
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Repeat your password"
                aria-invalid={Boolean(errors.confirmPassword)}
                aria-describedby={errors.confirmPassword ? "confirmPassword-error" : undefined}
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) => value === password || "Passwords do not match",
                })}
              />
              <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 border-0 bg-transparent text-xs font-extrabold text-violet-700" onClick={() => setShowConfirmPassword((visible) => !visible)} aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}>
                {showConfirmPassword ? "Hide" : "Show"}
              </button>
            </div>
            {errors.confirmPassword && <span id="confirmPassword-error" className="text-xs text-red-700" role="alert">{errors.confirmPassword.message}</span>}
          </div>
        </div>

        {submitError && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700" role="alert">{submitError}</div>}

        <button type="submit" className="min-h-13 rounded-xl border-0 bg-violet-700 px-5 font-extrabold text-white transition hover:bg-violet-800 disabled:cursor-wait disabled:opacity-60" disabled={isSubmitting}>
          {isSubmitting ? "Creating account..." : "Create vendor account"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        Already have an account? <Link className="font-bold text-violet-700 no-underline hover:underline" to="/vendor/login">Log in</Link>
      </p>
    </AuthLayout>
  );
};

export default VendorSignup;