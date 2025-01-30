import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const VerifyOTP = () => {
  const { state } = useLocation();
  const email = state?.email || "";
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");

    if (!otp.trim()) return setError("OTP is required.");

    try {
      setLoading(true);
      const response = await fetch("https://geet-backend.onrender.com/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Account verified! Redirecting to login...");
        navigate("/login");
      } else {
        setError(data.message || "Invalid OTP.");
      }
    } catch (error) {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="bg-[#dfa674] flex items-center justify-center min-h-screen p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full space-y-6">
          <h2 className="text-3xl font-semibold text-center text-indigo-800 mb-4">Verify OTP</h2>
          <p className="text-gray-600 text-center mb-6">
            We have sent an OTP to <strong>{email}</strong>
          </p>
          <form className="space-y-6" onSubmit={handleVerify}>
            <div className="relative">
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-800 transition-all duration-300"
              />
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-800 text-white py-3 rounded-lg font-semibold hover:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-800 focus:ring-offset-2 transition-all duration-300"
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default VerifyOTP;
