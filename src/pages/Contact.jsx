import React, { useState } from "react";
import { saveContact } from "../services/api"; // Import our PHP Helper

/* =========================
   CONTACT – ACADEMIC STYLE
========================= */

const Contact = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: ""
  });
  const [status, setStatus] = useState(null); // 'loading', 'success', 'error'
  const [statusMsg, setStatusMsg] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    setStatusMsg("");

    const dataToSend = {
      name: `${formData.firstName} ${formData.lastName}`.trim(),
      email: formData.email,
      message: formData.message
    };

    try {
      const response = await saveContact(dataToSend);
      if (response && response.status === "success") {
        setStatus("success");
        setStatusMsg("Message saved successfully!");
        setFormData({ firstName: "", lastName: "", email: "", message: "" });
      } else {
        setStatus("error");
        setStatusMsg(response.message || "Failed to save message. Ensure Database is setup.");
      }
    } catch (err) {
      setStatus("error");
      setStatusMsg("An error occurred. Is the PHP server running?");
    }
  };

  return (
    <div className="bg-[#f7f9fc] py-24 animate-fadeInUp">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ================= HEADER ================= */}
        <div className="text-center mb-20">
          <span className="inline-block mb-4 px-4 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold tracking-wide">
            Get in Touch
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-plus-jakarta tracking-tight">
            Let’s Connect & Collaborate
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Whether you have academic queries, collaboration ideas, or general
            feedback, feel free to reach out. Your message is always welcome.
          </p>
        </div>

        {/* ================= GRID ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 mb-24">

          {/* ================= CONTACT INFO ================= */}
          <div className="bg-white rounded-3xl p-10 shadow-lg border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-10 font-plus-jakarta">
              Contact Information
            </h3>

            <div className="space-y-10">

              {/* Email */}
              <div className="flex items-start group">
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="ml-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-1">
                    Email
                  </h4>
                  <a
                    href="mailto:learn@vishaldahiya.cs.in"
                    className="text-gray-600 hover:text-blue-600 transition"
                  >
                    learn@vishaldahiya.cs.in
                  </a>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start group">
                <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center text-purple-700 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div className="ml-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-1">
                    Availability
                  </h4>
                  <p className="text-gray-600">
                    Online • Academic & Professional Engagements
                  </p>
                </div>
              </div>

              {/* Response Time */}
              <div className="flex items-start group">
                <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center text-green-700 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-1">
                    Response Time
                  </h4>
                  <p className="text-gray-600">
                    Usually within 24 hours
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* ================= FORM ================= */}
          <div className="bg-white rounded-3xl p-10 shadow-xl border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 font-plus-jakarta">
              Send a Message
            </h3>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  className="input-style"
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  className="input-style"
                />
              </div>

              <input
                type="email"
                name="email"
                placeholder="Email Address"
                required
                value={formData.email}
                onChange={handleChange}
                className="input-style"
              />

              <textarea
                rows="5"
                name="message"
                placeholder="Your message"
                required
                value={formData.message}
                onChange={handleChange}
                className="input-style resize-none"
              ></textarea>

              {status === 'error' && (
                <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                  {statusMsg}
                </div>
              )}
              {status === 'success' && (
                <div className="p-3 bg-green-100 text-green-700 rounded-lg text-sm">
                  {statusMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full bg-blue-700 text-white py-4 rounded-xl font-semibold shadow-lg hover:bg-blue-800 transition transform hover:-translate-y-0.5 disabled:opacity-50"
              >
                {status === 'loading' ? 'Saving...' : 'Send Message'}
              </button>
            </form>
          </div>

        </div>
      </div>

      {/* INPUT STYLE */}
      <style>{`
        .input-style {
          width: 100%;
          padding: 14px 16px;
          border-radius: 14px;
          border: 1px solid #e5e7eb;
          background: white;
          outline: none;
          transition: all 0.2s ease;
        }
        .input-style:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
        }
      `}</style>
    </div>
  );
};

export default Contact;
