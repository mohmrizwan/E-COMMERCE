import React, { useState } from "react";
import { Link } from "react-router-dom";
import { STORE_NAME } from "../config/brand.js";
import { useStorefront } from "../hooks/useStorefront.js";

const sections = [
  {
    title: "Introduction",
    paragraphs: [
      "These terms explain how you may browse and shop on this website. By placing an order, you agree to the terms that apply to that order.",
      "The shop name and support contact details shown here are loaded from the store profile. Your rights under applicable consumer protection laws are not limited by these terms.",
    ],
  },
  {
    title: "Accounts",
    paragraphs: [
      "Keep your account information accurate and protect your password and one-time verification codes. You are responsible for activity carried out through your account until you tell us that it may have been accessed without permission.",
      "Contact support if your account details are incorrect or you suspect unauthorized access.",
    ],
  },
  {
    title: "Products & Pricing",
    paragraphs: [
      "Product descriptions, images, availability, and prices are shown on the relevant product page. We try to keep this information current, but display differences, listing errors, or stock changes may occur.",
      "The price and delivery charge shown at checkout are the amounts used to create your order. Applicable taxes or other charges will be shown before you place the order.",
    ],
  },
  {
    title: "Orders & Payments",
    paragraphs: [
      "Submitting an order is a request to purchase the listed items. The order is confirmed after checkout completes and the store accepts and records the order. We may contact you if an item, address, or payment needs clarification.",
      "Online payments are processed through Razorpay. Payment confirmation is required before an order can be completed. Do not share your payment password, PIN, or one-time code with anyone claiming to be store support.",
    ],
  },
  {
    title: "Shipping & Delivery",
    paragraphs: [
      "Delivery availability and charges depend on the delivery address and the shipping options available at checkout. Any delivery estimate is an estimate and may change because of courier or other circumstances outside the store's control.",
      "Please provide a complete and reachable delivery address and phone number. Contact support if tracking is unavailable or an order appears delayed.",
    ],
  },
  {
    title: "Cancellations, Returns & Refunds",
    paragraphs: [
      "Cancellation, return, replacement, and refund eligibility depends on the item and the policy shown for that item or order. Check those details before ordering, and contact support with your order information to request help.",
      "Approved refunds are processed through the original payment method where possible. Processing time may depend on the payment provider or bank. Nothing in this section removes rights available under applicable law.",
    ],
  },
  {
    title: "Acceptable Use",
    paragraphs: [
      "Use the website lawfully and provide truthful information. Do not interfere with the website, attempt unauthorized access, submit fraudulent orders, or misuse another person's account or personal information.",
    ],
  },
  {
    title: "Privacy",
    paragraphs: [
      "We use account, contact, delivery, and order information to operate the store, process orders, arrange delivery, provide support, and protect the service. Payment details are handled through the payment provider's checkout flow.",
      "Only provide personal information needed for your purchase or support request. Contact the store if you need help with information associated with your account or order.",
    ],
  },
  {
    title: "Changes to These Terms",
    paragraphs: [
      "We may update these terms when the store or its processes change. The latest version will appear on this page with an updated date. Changes do not remove rights that already apply to a completed order under law.",
    ],
  },
  {
    title: "Contact Us",
    paragraphs: [
      "For questions about a product, order, payment, delivery, cancellation, return, or refund, contact the store using the email or phone number below.",
    ],
  },
];

const TermsAndConditions = () => {
  const [activeSection, setActiveSection] = useState(sections[0].title);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const storefront = useStorefront();
  const storeName = storefront?.businessName || STORE_NAME;
  const lastUpdated = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const handleScroll = (title) => {
    document.getElementById(title)?.scrollIntoView({ behavior: "smooth" });
    setActiveSection(title);
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-[Inter]">
      <header className="border-b border-gray-200 bg-white p-6 text-center shadow-sm">
        <h1 className="text-2xl font-bold text-[#6C3BFF] md:text-3xl">Terms & Conditions</h1>
        <p className="mt-2 text-gray-600">Terms for shopping with {storeName}.</p>
        <p className="mt-1 text-sm text-gray-500">Last updated: {lastUpdated}</p>
      </header>

      <div className="mx-auto flex max-w-7xl flex-col gap-6 p-6 md:flex-row">
        <aside className="md:w-1/4">
          <div className="mb-4 md:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen((open) => !open)}
              className="w-full rounded-md border bg-white px-4 py-2 font-medium text-[#6C3BFF] shadow-sm"
            >
              {mobileMenuOpen ? "Close Menu" : "Table of Contents"}
            </button>
            {mobileMenuOpen && (
              <ul className="mt-2 rounded-md border bg-white shadow-md">
                {sections.map(({ title }) => (
                  <li key={title}>
                    <button type="button" onClick={() => handleScroll(title)} className={`w-full px-4 py-2 text-left hover:bg-gray-100 ${activeSection === title ? "font-semibold text-[#6C3BFF]" : ""}`}>
                      {title}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <ul className="sticky top-20 hidden space-y-2 rounded-md border bg-white p-4 shadow-sm md:block">
            {sections.map(({ title }) => (
              <li key={title}>
                <button type="button" onClick={() => handleScroll(title)} className={`text-left hover:text-[#6C3BFF] ${activeSection === title ? "font-semibold text-[#6C3BFF]" : "text-gray-700"}`}>
                  {title}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <main className="space-y-6 md:w-3/4">
          {sections.map(({ title, paragraphs }) => (
            <section key={title} id={title} className="scroll-mt-24 rounded-md border bg-white p-6 shadow-sm">
              <h2 className="mb-3 text-xl font-bold text-[#6C3BFF]">{title}</h2>
              <div className="space-y-3 leading-relaxed text-gray-700">
                {paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </div>
              {title === "Contact Us" && (
                <div className="mt-4 flex flex-wrap gap-4">
                  {storefront?.contactEmail && <a className="text-[#6C3BFF] hover:underline" href={`mailto:${storefront.contactEmail}`}>{storefront.contactEmail}</a>}
                  {storefront?.contactPhone && <a className="text-[#6C3BFF] hover:underline" href={`tel:${storefront.contactPhone}`}>{storefront.contactPhone}</a>}
                  {!storefront?.contactEmail && !storefront?.contactPhone && <Link className="text-[#6C3BFF] hover:underline" to="/contact">Contact support</Link>}
                </div>
              )}
            </section>
          ))}
          <div className="rounded-md border bg-white p-6 text-center shadow-sm">
            <p className="mb-4 text-gray-700">By placing an order with {storeName}, you acknowledge these terms and the policies shown for your order.</p>
            <Link to="/contact" className="inline-block rounded-md bg-[#6C3BFF] px-6 py-2 text-white shadow transition hover:bg-[#5a2fe0]">Contact Support</Link>
          </div>
        </main>
      </div>

      <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="fixed bottom-6 right-6 rounded-full bg-[#6C3BFF] px-4 py-2 text-white shadow transition hover:bg-[#5a2fe0]">
        ↑ Top
      </button>
    </div>
  );
};

export default TermsAndConditions;
