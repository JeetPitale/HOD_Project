import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">

        {/* Left */}
        <p className="text-sm text-gray-600 text-center md:text-left">
          © {new Date().getFullYear()}{" "}
          <span className="font-medium text-gray-800">
            Prof. (Dr.) Vishal Dahiya
          </span>
          . All rights reserved.
        </p>

        {/* Center */}
        <p className="text-sm text-gray-500 text-center">
          Academic Leadership • Research • Innovation
        </p>

        {/* Right */}
        <p className="text-sm text-gray-400 text-center md:text-right">
          Developed by{" "}
          <span className="font-medium text-gray-700">
            Yash Bachwani
          </span>{" "}
          &{" "}
          <span className="font-medium text-gray-700">
            Jeet Pitale
          </span>
        </p>

      </div>
    </footer>
  );
};

export default Footer;
