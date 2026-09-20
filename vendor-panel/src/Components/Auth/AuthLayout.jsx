import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const AuthLayout = ({ eyebrow, title, description, children }) => (
  <main className="grid min-h-dvh min-w-0 bg-[#F8FAFC] font-sans text-[#17112B] lg:grid-cols-[minmax(360px,0.82fr)_minmax(560px,1.18fr)]">
    <section className="relative hidden overflow-hidden flex-col bg-[#17112B] p-8 text-white sm:p-12 lg:flex lg:p-16 xl:p-20">
      <div className="pointer-events-none absolute -right-32 -top-32 size-96 rounded-full border border-violet-400/20 bg-violet-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 size-[28rem] rounded-full border border-fuchsia-300/10 bg-fuchsia-500/10 blur-3xl" />

      <Link to="/vendor/login" className="relative flex w-fit items-center gap-3 text-lg font-extrabold tracking-tight text-white no-underline">
        <img src="/Copilot_20260831_214454.png" alt="VendoraFlame" className="h-10 w-auto max-w-48 object-contain object-left" />
      </Link>

      <div className="relative my-auto max-w-xl py-16">
        <span className="inline-flex rounded-full border border-violet-300/20 bg-violet-400/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-violet-200">Vendor workspace</span>
        <h1 className="mt-6 max-w-[12ch] text-5xl font-extrabold leading-[1.02] tracking-[-0.04em] text-white xl:text-7xl">Build a store people remember.</h1>
        <p className="mt-6 max-w-md text-base leading-7 text-slate-300">
          Keep your catalog, orders, and customer relationships moving from one
          focused workspace.
        </p>
        <div className="mt-12 grid max-w-md grid-cols-2 gap-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
            <strong className="text-xl text-white">01</strong>
            <span className="mt-1 block text-xs leading-5 text-slate-300">Manage your storefront</span>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
            <strong className="text-xl text-white">02</strong>
            <span className="mt-1 block text-xs leading-5 text-slate-300">Grow with confidence</span>
          </div>
        </div>
      </div>

      <p className="m-0 text-xs text-slate-400">2026 VendoraFlame</p>
    </section>

    <section className="grid min-h-dvh min-w-0 place-items-center bg-[radial-gradient(circle_at_top_right,#EDE9FE_0,transparent_28rem)] px-4 py-6 sm:px-6 sm:py-8 lg:px-16 xl:px-24">
      <div className="w-full min-w-0 max-w-xl">
        <div className="mb-7 lg:hidden">
          <Link to="/vendor/login" className="flex w-fit items-center text-lg font-extrabold tracking-tight text-[#17112B] no-underline">
            <img src="/Copilot_20260831_214454.png" alt="VendoraFlame" className="h-10 w-auto max-w-48 object-contain object-left" />
          </Link>
        </div>

        <div className="rounded-3xl border border-slate-200/80 bg-white/90 p-5 shadow-[0_24px_80px_-32px_rgba(23,17,43,0.35)] backdrop-blur sm:p-8 lg:p-10">
          <div className="mb-7 sm:mb-8">
            <span className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-violet-700">{eyebrow}</span>
            <h2 className="mt-3 break-words text-2xl font-extrabold tracking-[-0.03em] text-[#17112B] sm:text-4xl">{title}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-500">{description}</p>
          </div>
          {children}
        </div>
      </div>
    </section>
  </main>
);

AuthLayout.propTypes = {
  eyebrow: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default AuthLayout;