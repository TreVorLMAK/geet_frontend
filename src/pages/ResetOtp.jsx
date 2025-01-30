import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const ResetOtp = () => {
  const { state } = useLocation();
  const emailFromState = state?.email || "";
  const [email, setEmail] = useState(emailFromState);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!otp.trim()) return setError("OTP is required.");

    try {
      setLoading(true);
      const response = await fetch("http://localhost:3000/api/auth/reset-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();
      if (response.ok) {
        navigate("/set-new-password", { state: { email } });
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
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full sm:max-w-xl md:max-w-2xl lg:max-w-3xl">
          <h2 className="text-2xl font-semibold text-center text-indigo-800 mb-6">Verify OTP</h2>
          <p className="text-gray-600 text-center mb-4">We have sent an OTP to <strong>{email}</strong></p>
          <form className="space-y-6" onSubmit={handleOtpSubmit}>
            <div className="relative">
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 focus:outline-none"
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

export default ResetOtp;
