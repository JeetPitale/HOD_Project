import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { useNavigate } from "react-router-dom";
import { Lock, ShieldCheck, ArrowRight, AlertCircle, CheckCircle2 } from "lucide-react";

/* ==================================================================================
   ADMIN LOGIN – PREMIUM & SECURE (FIXED OTP SIMULATION)
   Simulates SMS but functionality uses a fixed secure OTP.
   ================================================================================== */

const AdminLogin = () => {
  // Steps: 'PHONE' | 'OTP'
  const [step, setStep] = useState('PHONE');

  const [mobile, setMobile] = useState("");
  const [otpInput, setOtpInput] = useState("");

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const { grantAccess } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  /* ================= SECURITY CONFIGURATION ================= */


  const AUTHORIZED_NUMBERS_HASH = [
    "b07cf287b7c054fc85b31bcc8c26aea431352300487312d891c8d185bc0a58c1",
    "e9e969c7a830507b40e1e6a0b03eaee12dd40385aab16b1323268898ae71c911"
  ];


  const FIXED_OTP_HASH = "8ff216f6077d491613a6c11441e42b4fa9374d934f25b38166f5201434aabcc3";


  const verifyHash = async (input, validHashes) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    if (Array.isArray(validHashes)) {
      return validHashes.includes(hashHex);
    }
    return hashHex === validHashes;
  };

  // 1. Request OTP (Simulated)
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);


    const isAuthorized = await verifyHash(mobile, AUTHORIZED_NUMBERS_HASH);

    setTimeout(() => {
      if (isAuthorized) {
        setIsLoading(false);
        setStep('OTP');
        toast.success("OTP sent to your mobile number");
      } else {
        setError("Access Denied. This number is not authorized.");
        setIsLoading(false);
      }
    }, 1500);
  };

  // 2. Verify OTP (Hash Check)
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Small artificial delay for realism
      await new Promise(r => setTimeout(r, 1000));

      const isValid = await verifyHash(otpInput, FIXED_OTP_HASH);

      if (isValid) {
        grantAccess();
        setShowSuccess(true);
        setTimeout(() => {
          navigate("/blog");
        }, 1200);
      } else {
        throw new Error("Invalid OTP");
      }
    } catch (err) {
      setError("Invalid OTP. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] px-4 relative overflow-hidden">

      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100 rounded-full blur-[120px] opacity-60"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-100 rounded-full blur-[120px] opacity-60"></div>

      {/* Main Card */}
      <div className="relative w-full max-w-md z-10">

        {/* Floating Icon Header */}
        <div className="flex justify-center mb-8">
          <div className="bg-white p-4 rounded-2xl shadow-xl shadow-blue-100/50 border border-white/50">
            <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 p-3 rounded-xl shadow-lg shadow-blue-500/30">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>

        {/* Card Body */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-gray-200/50 border border-white p-8 sm:p-10 transition-all duration-300 hover:shadow-3xl">

          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight font-plus-jakarta">
              Admin Portal
            </h1>
            <p className="text-gray-500 text-sm mt-2">
              {step === 'PHONE' ? "Secure Mobile Authentication" : "Enter Verification Code"}
            </p>
          </div>

          <form onSubmit={step === 'PHONE' ? handleRequestOtp : handleVerifyOtp} className="space-y-6">

            {step === 'PHONE' ? (
              // STEP 1: MOBILE INPUT
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">
                  Mobile Number
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className={`w-5 h-5 transition-colors ${error ? 'text-red-400' : 'text-gray-400 group-focus-within:text-blue-500'}`} />
                  </div>
                  <input
                    type="text"
                    required
                    maxLength={10}
                    disabled={isLoading}
                    value={mobile}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, ''); // Numbers only
                      setMobile(val);
                      setError("");
                    }}
                    className={`w-full pl-11 pr-4 py-3.5 bg-gray-50 border rounded-xl outline-none transition-all duration-200 font-medium font-mono
                      ${error
                        ? 'border-red-200 focus:border-red-500 focus:ring-4 focus:ring-red-500/10 text-red-900 placeholder-red-300'
                        : 'border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 text-gray-900 group-hover:border-gray-300'
                      }
                    `}
                    placeholder="Enter 10-digit number"
                  />
                </div>
              </div>
            ) : (
              // STEP 2: OTP INPUT
              <div className="space-y-2 animate-fadeInUp">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">
                    One-Time Password
                  </label>
                  <button
                    type="button"
                    onClick={() => { setStep('PHONE'); setMobile(""); setError(""); }}
                    className="text-xs text-blue-600 hover:underline"
                  >
                    Change Number
                  </button>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <CheckCircle2 className={`w-5 h-5 transition-colors ${error ? 'text-red-400' : 'text-gray-400 group-focus-within:text-blue-500'}`} />
                  </div>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    disabled={isLoading || showSuccess}
                    value={otpInput}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '');
                      setOtpInput(val);
                      setError("");
                    }}
                    className={`w-full pl-11 pr-4 py-3.5 bg-gray-50 border rounded-xl outline-none transition-all duration-200 font-medium font-mono tracking-widest text-center text-lg
                      ${error
                        ? 'border-red-200 focus:border-red-500 focus:ring-4 focus:ring-red-500/10 text-red-900 placeholder-red-300'
                        : 'border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 text-gray-900 group-hover:border-gray-300'
                      }
                      ${showSuccess ? 'border-green-500/50 bg-green-50/50 text-green-700' : ''}
                    `}
                    placeholder="------"
                  />
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="flex items-start gap-3 p-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm animate-shake">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || showSuccess || (step === 'PHONE' && mobile.length < 10) || (step === 'OTP' && otpInput.length < 6)}
              className={`
                relative w-full py-3.5 rounded-xl font-semibold text-white shadow-lg transition-all duration-300 overflow-hidden
                ${showSuccess
                  ? 'bg-green-500 shadow-green-500/30 ring-4 ring-green-500/20 cursor-default'
                  : 'bg-[#1e40af] hover:bg-[#1e3a8a] shadow-blue-900/20 hover:shadow-blue-900/40 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed'
                }
              `}
            >
              <div className="relative z-10 flex items-center justify-center gap-2">
                {isLoading ? (
                  showSuccess ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 animate-bounce" />
                      <span>Authenticated</span>
                    </>
                  ) : (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white/90" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Processing...</span>
                    </>
                  )
                ) : (
                  <>
                    <span>{step === 'PHONE' ? "Send Real OTP" : "Verify & Login"}</span>
                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </div>
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-xs text-gray-400 font-medium">
          Protected by <span className="text-gray-600">CyberGridX</span> protocol
        </p>

      </div>
    </div>
  );
};

export default AdminLogin;
