import React from "react";
import { Link } from "react-router-dom";
import Header from "../Components/Header";
import Footer from "../Components/Footer";

const NotFound = () => {
  return (
    <>
      <Header />
      <main className="mx-auto flex min-h-[60vh] max-w-6xl flex-col items-center justify-center px-5 py-16 text-center">
        <p className="text-7xl font-bold text-violet-700">404</p>
        <h1 className="mt-4 text-2xl font-bold text-slate-900">Page not found</h1>
        <p className="mt-2 text-slate-500">The page you are looking for does not exist or has been moved.</p>
        <Link to="/" className="mt-6 rounded-lg bg-violet-700 px-5 py-3 font-semibold text-white">Go home</Link>
      </main>
      <Footer />
    </>
  );
};

export default NotFound;