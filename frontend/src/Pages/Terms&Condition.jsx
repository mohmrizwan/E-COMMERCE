// src/pages/TermsAndConditions.jsx
import React, { useState } from "react";

const sections = [
  "Introduction",
  "User Accounts",
  "Orders & Payments",
  "Shipping & Delivery",
  "Returns & Refunds",
  "Products & Vendors",
  "User Responsibilities",
  "Privacy",
  "Intellectual Property",
  "Limitation of Liability",
  "Changes to Terms",
  "Contact Us",
];

const TermsAndConditions = () => {
  const [activeSection, setActiveSection] = useState("Introduction");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleScroll = (id) => {
    document.getElementById(id).scrollIntoView({ behavior: "smooth" });
    setActiveSection(id);
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-[Inter]">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 p-6 text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-[#6C3BFF]">
          Terms & Conditions
        </h1>
        <p className="mt-2 text-gray-600">
          Please read these terms carefully before using Vendora.
        </p>
        <p className="mt-1 text-sm text-gray-500">Last Updated: August 2026</p>
      </header>

      <div className="flex flex-col md:flex-row max-w-7xl mx-auto p-6 gap-6">
        {/* Table of Contents */}
        <aside className="md:w-1/4">
          {/* Mobile Dropdown */}
          <div className="md:hidden mb-4">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-full px-4 py-2 border rounded-md shadow-sm bg-white text-[#6C3BFF] font-medium"
            >
              {mobileMenuOpen ? "Close Menu" : "Table of Contents"}
            </button>
            {mobileMenuOpen && (
              <ul className="mt-2 bg-white border rounded-md shadow-md">
                {sections.map((section) => (
                  <li
                    key={section}
                    onClick={() => handleScroll(section)}
                    className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                      activeSection === section ? "text-[#6C3BFF] font-semibold" : ""
                    }`}
                  >
                    {section}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Desktop Sidebar */}
          <ul className="hidden md:block sticky top-20 space-y-2 bg-white border rounded-md shadow-sm p-4">
            {sections.map((section) => (
              <li
                key={section}
                onClick={() => handleScroll(section)}
                className={`cursor-pointer hover:text-[#6C3BFF] ${
                  activeSection === section ? "text-[#6C3BFF] font-semibold" : "text-gray-700"
                }`}
              >
                {section}
              </li>
            ))}
          </ul>
        </aside>

        {/* Terms Content */}
        <main className="md:w-3/4 space-y-12">
          {sections.map((section) => (
            <section
              key={section}
              id={section}
              className="bg-white border rounded-md shadow-sm p-6 scroll-mt-24"
            >
              <h2 className="text-xl font-bold text-[#6C3BFF] mb-3">{section}</h2>
              <p className="text-gray-700 leading-relaxed">
                {/* Demo legal content */}
                This is demo content for the <strong>{section}</strong> section. 
                Please replace with reviewed legal text before publishing.
              </p>
              <ul className="list-disc list-inside mt-2 text-gray-600 space-y-1">
                <li>Example point one for {section}.</li>
                <li>Example point two for {section}.</li>
                <li>Example point three for {section}.</li>
              </ul>
            </section>
          ))}

          {/* Footer Note */}
          <div className="bg-white border rounded-md shadow-sm p-6 text-center">
            <p className="text-gray-700 mb-4">
              By using Vendora, you acknowledge that you have read and agreed to these Terms & Conditions.
            </p>
            <button className="px-6 py-2 bg-[#6C3BFF] text-white rounded-md shadow hover:bg-[#5a2fe0] transition">
              Contact Support
            </button>
          </div>
        </main>
      </div>

      {/* Back to Top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-6 right-6 bg-[#6C3BFF] text-white px-4 py-2 rounded-full shadow hover:bg-[#5a2fe0] transition"
      >
        ↑ Top
      </button>
    </div>
  );
};

export default TermsAndConditions;
