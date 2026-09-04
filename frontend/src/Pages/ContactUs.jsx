import { useState } from "react";
import Header from "../Components/Header";
import Footer from "../Components/Footer";

const ContactUs = () => {
  const faqs = [
    {
      q: "How can I track my order?",
      a: "You can track your order from your account dashboard under 'My Orders'.",
    },
    {
      q: "How can I return a product?",
      a: "Returns can be initiated within 7 days of delivery. Please visit the Returns section.",
    },
    {
      q: "How can I contact a vendor?",
      a: "Each product page includes vendor contact details. You can reach out directly.",
    },
    {
      q: "How long does delivery take?",
      a: "Delivery usually takes 3–7 business days depending on your location.",
    },
    {
      q: "How can I cancel my order?",
      a: "Orders can be cancelled before they are shipped. Visit 'My Orders' to cancel.",
    },
  ];
  const [openFAQ, setOpenFAQ] = useState(null);
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 font-[inter]">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 p-6 text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-[#6C3BFF]">
            Contact Us
          </h1>
          <p className="mt-2 text-gray-600">
            Have a question or need help? We’re here to help.
          </p>
        </header>

        {/* Main Layout */}
        <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Side - Contact Info */}
          <div className="bg-white border rounded-md shadow-sm p-6 space-y-6">
            <h2 className="text-xl font-semibold text-[#6C3BFF] mb-4">
              Customer Support
            </h2>
            <div className="space-y-4 text-gray-700">
              <div className="flex items-center gap-3">
                <div className="text-[#6C3BFF]" />{" "}
                <span>Support Team</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-[#6C3BFF]" />{" "}
                <a
                  href="mailto:support@vendora.com"
                  className="hover:underline"
                >
                  support@vendora.com
                </a>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-[#6C3BFF]" />{" "}
                <span>+91 XXXXX XXXXX</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-[#6C3BFF]" />{" "}
                <span>Indore, MP, India</span>
              </div>
              <p>
                <strong>Business Hours:</strong> Mon – Sat, 9:00 AM – 6:00 PM
              </p>
              {/* Social Icons */}
              <div className="flex gap-4 mt-4">
                <a href="#" className="text-[#6C3BFF] hover:text-[#5a2fe0]">
                  🌐 Facebook
                </a>
                <a href="#" className="text-[#6C3BFF] hover:text-[#5a2fe0]">
                  📸 Instagram
                </a>
                <a href="#" className="text-[#6C3BFF] hover:text-[#5a2fe0]">
                  🐦 Twitter
                </a>
              </div>
            </div>
          </div>

          {/* Right Side - Contact Form */}
          <div className="bg-white border rounded-md shadow-sm p-6">
            <h2 className="text-xl font-semibold text-[#6C3BFF] mb-4">
              Send Us a Message
            </h2>
            <form className="space-y-4">
              <input
                type="text"
                placeholder="Full Name"
                className="w-full border rounded-md p-3 focus:ring-2 focus:ring-[#6C3BFF]"
              />
              <input
                type="email"
                placeholder="Email Address"
                className="w-full border rounded-md p-3 focus:ring-2 focus:ring-[#6C3BFF]"
              />
              <input
                type="tel"
                placeholder="Phone Number"
                className="w-full border rounded-md p-3 focus:ring-2 focus:ring-[#6C3BFF]"
              />
              <input
                type="text"
                placeholder="Subject"
                className="w-full border rounded-md p-3 focus:ring-2 focus:ring-[#6C3BFF]"
              />
              <textarea
                placeholder="Message"
                rows="4"
                className="w-full border rounded-md p-3 focus:ring-2 focus:ring-[#6C3BFF]"
              ></textarea>
              <button
                type="submit"
                className="w-full bg-[#6C3BFF] text-white py-2 rounded-md shadow hover:bg-[#5a2fe0] transition"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto p-6">
          <h2 className="text-xl font-semibold text-[#6C3BFF] mb-4">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-white border rounded-md shadow-sm p-4"
              >
                <button
                  onClick={() => setOpenFAQ(openFAQ === idx ? null : idx)}
                  className="w-full text-left font-medium text-gray-800 flex justify-between items-center"
                >
                  {faq.q}
                  <span className="text-[#6C3BFF]">
                    {openFAQ === idx ? "-" : "+"}
                  </span>
                </button>
                {openFAQ === idx && (
                  <p className="mt-2 text-gray-600">{faq.a}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="bg-white border rounded-md shadow-sm p-6 text-center max-w-4xl mx-auto mb-10">
          <h2 className="text-lg font-semibold text-gray-800">
            Still need help?
          </h2>
          <p className="text-gray-600 mt-2">
            Contact our support team and we’ll get back to you as soon as
            possible.
          </p>
          <button className="mt-4 px-6 py-2 bg-[#6C3BFF] text-white rounded-md shadow hover:bg-[#5a2fe0] transition">
            Contact Support
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ContactUs;
