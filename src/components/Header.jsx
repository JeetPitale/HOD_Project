import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Blog", path: "/blog" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">

          {/* Logo / Name */}
          <Link to="/" className="flex flex-col leading-tight">
            <span className="text-lg font-semibold text-gray-900 tracking-wide">
              Dr. Vishal Dahiya
            </span>
            <span className="text-xs text-gray-500">
              Leadership • Vision • Excellence
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `text-sm font-medium transition ${isActive
                    ? "text-blue-700 border-b-2 border-blue-700 pb-1"
                    : "text-gray-600 hover:text-blue-700"
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}

            {isAdmin ? (
              <button
                onClick={handleLogout}
                className="ml-4 px-5 py-2 text-sm font-medium rounded-md
                           bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="ml-4 px-5 py-2 text-sm font-medium rounded-md
                           bg-blue-700 text-white hover:bg-blue-800 transition"
              >
                Login
              </Link>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-700"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-6 py-4 space-y-4">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `block text-sm font-medium ${isActive
                    ? "text-blue-700"
                    : "text-gray-700 hover:text-blue-700"
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}

            {isAdmin ? (
              <button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="block w-full text-center px-4 py-2 rounded-md
                           bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="block w-full text-center px-4 py-2 rounded-md
                           bg-blue-700 text-white hover:bg-blue-800 transition"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
