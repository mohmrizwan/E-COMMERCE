import Header from "../Components/Header";
import Footer from "../Components/Footer";
import { useStorefront } from "../hooks/useStorefront.js";

const ContactUs = () => {
  const storefront = useStorefront();
  const contactMethods = [
    storefront?.contactEmail && {
      label: "Email",
      value: storefront.contactEmail,
      href: `mailto:${storefront.contactEmail}`,
      icon: "fa-regular fa-envelope",
    },
    storefront?.contactPhone && {
      label: "Phone",
      value: storefront.contactPhone,
      href: `tel:${storefront.contactPhone}`,
      icon: "fa-solid fa-phone",
    },
    storefront?.contactAddress && {
      label: "Shop Address",
      value: storefront.contactAddress,
      href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(storefront.contactAddress)}`,
      icon: "fa-solid fa-location-dot",
    },
  ].filter(Boolean);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 font-[inter]">
        <header className="border-b border-gray-200 bg-white p-6 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-[#6C3BFF] md:text-3xl">Contact Us</h1>
          <p className="mt-2 text-gray-600">Need help? Contact {storefront?.businessName || "our shop"}.</p>
        </header>

        <section className="mx-auto max-w-4xl p-6">
          <div className="rounded-md border bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-xl font-semibold text-[#6C3BFF]">Customer Support</h2>
            {contactMethods.length ? (
              <div className="space-y-4">
                {contactMethods.map((method) => (
                  <div key={method.label} className="flex items-start gap-3 text-gray-700">
                    <i className={`${method.icon} mt-1 w-5 text-[#6C3BFF]`} aria-hidden="true" />
                    <div>
                      <p className="text-sm text-gray-500">{method.label}</p>
                      <a href={method.href} className="break-words hover:text-[#6C3BFF] hover:underline">
                        {method.value}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">Shop contact details are not available yet.</p>
            )}
          </div>
        </section>

        <section className="mx-auto mb-10 max-w-4xl px-6">
          <div className="rounded-md border bg-white p-6 text-center shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800">Still need help?</h2>
            <p className="mt-2 text-gray-600">Use the shop email or phone above for order and product support.</p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default ContactUs;
