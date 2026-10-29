import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { STORE_NAME } from "../../config/brand.js";
import { apiUrl } from "../../config/api.js";

const defaultLogo = "/Copilot_20260831_214454.png";

const AuthLayout = ({ eyebrow, title, description, children }) => {
  const [storeLogo, setStoreLogo] = useState(defaultLogo);

  useEffect(() => {
    const handleSettingsUpdated = (event) => {
      if (event.detail?.websiteLogo) setStoreLogo(event.detail.websiteLogo);
    };
    window.addEventListener("storefront:settings-updated", handleSettingsUpdated);
    fetch(apiUrl("storefront"))
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (data?.storefront?.websiteLogo) setStoreLogo(data.storefront.websiteLogo);
      })
      .catch(() => {});
    return () => window.removeEventListener("storefront:settings-updated", handleSettingsUpdated);
  }, []);

  return (
  <main className="grid min-h-dvh min-w-0 bg-[#F8FAFC] font-sans text-[#17112B] lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)]">
    <section className="relative hidden overflow-hidden flex-col bg-[#173D35] p-8 text-white sm:p-12 lg:flex lg:p-16 xl:p-20">
      <div className="pointer-events-none absolute -right-32 -top-32 size-96 rounded-full border border-[#D6B56D]/20 bg-[#D6B56D]/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 size-[28rem] rounded-full border border-white/10 bg-white/5 blur-3xl" />

      <Link to="/vendor/login" className="relative flex w-fit items-center gap-3 text-lg font-extrabold tracking-tight text-white no-underline">
        <img src={storeLogo} alt={`${STORE_NAME} logo`} className="h-10 w-auto max-w-48 object-contain object-left" />
      </Link>

      <div className="relative my-auto max-w-xl py-16">
        <span className="inline-flex rounded-full border border-[#D6B56D]/30 bg-[#D6B56D]/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-[#D6B56D]">Vendor workspace</span>
        <h1 className="mt-6 max-w-[12ch] text-5xl font-extrabold leading-[1.02] tracking-[-0.04em] text-white xl:text-7xl">Build a store people remember.</h1>
        <p className="mt-6 max-w-md text-base leading-7 text-gray-200">
          Keep your catalog, orders, and customer relationships moving from one
          focused workspace.
        </p>
        <div className="mt-12 grid max-w-md grid-cols-2 gap-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
            <strong className="text-xl text-[#D6B56D]">01</strong>
            <span className="mt-1 block text-xs leading-5 text-gray-200">Manage your storefront</span>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
            <strong className="text-xl text-[#D6B56D]">02</strong>
            <span className="mt-1 block text-xs leading-5 text-gray-200">Grow with confidence</span>
          </div>
        </div>
      </div>

      <p className="m-0 text-xs text-gray-300">2026 {STORE_NAME}</p>
    </section>

    <section className="grid min-h-dvh min-w-0 place-items-center bg-[radial-gradient(circle_at_top_right,#e8f0ee_0,transparent_28rem)] px-4 py-6 sm:px-6 sm:py-8 lg:px-16 xl:px-24">
      <div className="w-full min-w-0 max-w-xl">
        <div className="mb-7 lg:hidden">
          <Link to="/vendor/login" className="flex w-fit items-center text-lg font-extrabold tracking-tight text-[#173D35] no-underline">
            <img src={storeLogo} alt={`${STORE_NAME} logo`} className="h-10 w-auto max-w-48 object-contain object-left" />
          </Link>
        </div>

        <div className="rounded-3xl border border-slate-200/80 bg-white/90 p-5 shadow-[0_24px_80px_-32px_rgba(23,61,53,0.25)] backdrop-blur sm:p-8 lg:p-10">
          <div className="mb-7 sm:mb-8">
            <span className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#173D35]">{eyebrow}</span>
            <h2 className="mt-3 break-words text-2xl font-extrabold tracking-[-0.03em] text-[#173D35] sm:text-4xl">{title}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-500">{description}</p>
          </div>
          {children}
        </div>
      </div>
    </section>
  </main>
  );
};

AuthLayout.propTypes = {
  eyebrow: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default AuthLayout;
