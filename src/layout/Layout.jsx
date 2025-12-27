import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

const Layout = () => {
  return (
    <div
      id="page"
      className="flex flex-col min-h-screen overflow-x-hidden font-manrope text-base leading-relaxed text-gray-700 bg-gray-50"
    >
      <Header />

      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <Outlet />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Layout;
