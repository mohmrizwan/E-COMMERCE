import { Link } from "react-router-dom";
import img from "../assets/images/new-pair-white-sneakers-isolated-white.jpg";

const Brand = ({ light = false }) => (
  <Link to="/" className={`auth-brand${light ? " auth-brand-light" : ""}`}>
    <span className="auth-brand-mark" aria-hidden="true">V</span>
    <span>VendorAflame</span>
  </Link>
);

const AuthShell = ({ children }) => (
  <main className="auth-page">
    <section className="auth-promo" aria-label="VendorAflame marketplace">
      <Brand light />
      <div className="promo-art">
        <span className="promo-orb promo-orb-one" />
        <span className="promo-orb promo-orb-two" />
        <div className="promo-product-card">
          <img src={img} alt="White premium sneaker" />
          <div className="promo-product-meta">
            <div>
              <strong>Airline Motion</strong>
              <span>From $219</span>
            </div>
            <small>Verified</small>
          </div>
        </div>
        <div className="promo-float promo-float-top"><span>New drop</span><strong>+28%</strong></div>
        <div className="promo-float promo-float-bottom"><span className="promo-check">✓</span><span>Trusted vendors</span></div>
      </div>
      <div className="promo-copy">
        <p className="promo-kicker">THE MARKETPLACE FOR WHAT'S NEXT</p>
        <h1>Everything you need to shop smarter.</h1>
        <p>Discover products from trusted vendors and enjoy a seamless shopping experience.</p>
      </div>
    </section>
    <section className="auth-panel">
      <div className="auth-mobile-brand"><Brand /></div>
      <div className="auth-card">{children}</div>
      <p className="auth-footer">2026 VendorAflame <span aria-hidden="true">·</span> Shop confidently. Sell boldly.</p>
    </section>
  </main>
);

export { AuthShell };
