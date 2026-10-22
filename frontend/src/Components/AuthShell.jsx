import { Link } from "react-router-dom";
import img from "../../../frontend/src/assets/images/images (3).jpg";
import { STORE_NAME } from "../config/brand.js";
import { useStorefront } from "../hooks/useStorefront.js";

const Brand = ({ light = false }) => {
  const storefront = useStorefront();
  const storeName = storefront?.businessName || STORE_NAME;
  return (
    <Link to="/" className={`auth-brand${light ? " auth-brand-light" : ""}`}>
      {storefront?.websiteLogo ? (
        <img
          src={storefront.websiteLogo}
          alt={storeName}
          className="h-8 w-auto max-w-32 object-contain"
        />
      ) : (
        <>
          <span className="auth-brand-mark" aria-hidden="true">V</span>
          <span>{storeName}</span>
        </>
      )}
    </Link>
  );
};

const AuthShell = ({ children }) => {
  const storefront = useStorefront();
  const storeName = storefront?.businessName || STORE_NAME;
  return (
  <main className="auth-page">
    <section className="auth-promo" aria-label={`${storeName} storefront`}>
      <Brand light />
      <div className="promo-art">
        <span className="promo-orb promo-orb-one" />
        <span className="promo-orb promo-orb-two" />
        <div className="promo-product-card">
          <img src={img} alt="White premium sneaker" />
          <div className="promo-product-meta">
            <div>
              <strong>Airline Motion</strong>
              <span>From RS 1500</span>
            </div>
            <small>Verified</small>
          </div>
        </div>
        <div className="promo-float promo-float-top"><span>New drop</span><strong>+28%</strong></div>
        <div className="promo-float promo-float-bottom"><span className="promo-check">✓</span><span>Quality products</span></div>
      </div>
      <div className="promo-copy">
        <p className="promo-kicker">WELCOME TO {storeName.toUpperCase()}</p>
        <h1>Everything you need to shop smarter.</h1>
        <p>Discover products from {storeName} and enjoy a seamless shopping experience.</p>
      </div>
    </section>
    <section className="auth-panel">
      <div className="auth-mobile-brand"><Brand /></div>
      <div className="auth-card">{children}</div>
      <p className="auth-footer">2026 {storeName} <span aria-hidden="true">·</span> Shop confidently.</p>
    </section>
  </main>
  );
};

export { AuthShell };
