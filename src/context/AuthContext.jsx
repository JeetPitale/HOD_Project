import React, { createContext, useContext, useEffect, useState } from "react";

/* ======================================================
   AUTH CONTEXT – SIMPLE & STABLE (ADMIN ONLY)
   Frontend-only auth (Perfect for this project scope)
====================================================== */

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  /* ================= INITIALIZE AUTH ================= */
  useEffect(() => {
    const storedAdmin = localStorage.getItem("isAdmin");
    if (storedAdmin === "true") {
      setIsAdmin(true);
    }
    setLoading(false);
  }, []);

  /* ================= LOGIN ================= */
  const login = (password) => {
    // Environment-based password (safe fallback included)
    const ADMIN_PASSWORD =
      import.meta.env.VITE_ADMIN_PASSWORD || "admin123";

    if (password === ADMIN_PASSWORD) {
      setIsAdmin(true);
      localStorage.setItem("isAdmin", "true");
      return true;
    }

    return false;
  };

  /* ================= GRANT ACCESS (OTP) ================= */
  const grantAccess = () => {
    setIsAdmin(true);
    localStorage.setItem("isAdmin", "true");
  };

  /* ================= LOGOUT ================= */
  const logout = () => {
    setIsAdmin(false);
    localStorage.removeItem("isAdmin");
  };

  /* ================= CONTEXT VALUE ================= */
  const value = {
    isAdmin,
    login,
    grantAccess,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
