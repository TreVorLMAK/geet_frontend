import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const SetNewPassword = () => {
  const { state } = useLocation();
  const email = state?.email || ""; // Get email passed from previous page
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");

    // Validate new password and confirm password
    if (!newPassword || !confirmPassword) return setError("Both fields are required.");
    if (newPassword !== confirmPassword) return setError("Passwords do not match.");

    try {
      setLoading(true);
      const response = await fetch("https://geet-backend.onrender.com/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Password reset successfully! Redirecting to login...");
        navigate("/login"); // Redirect to login after successful password reset
      } else {
        setError(data.message || "Failed to reset password.");
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
          <h2 className="text-2xl font-semibold text-center text-indigo-800 mb-6">Set New Password</h2>
          <form className="space-y-6" onSubmit={handleResetPassword}>
            <div className="relative">
              <input
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            <div className="relative">
              <input
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 focus:outline-none"
              disabled={loading}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default SetNewPassword;
