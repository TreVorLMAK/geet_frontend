import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Register = () => {
  const [formValues, setFormValues] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const navigate = useNavigate();

  const validateEmail = (email) => {
    return email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formValues.username.trim()) {
      errors.username = "Username is required";
    } else if (formValues.username.length < 3) {
      errors.username = "Username must be at least 3 characters";
    }
    
    if (!formValues.email.trim()) {
      errors.email = "Email is required";
    } else if (!validateEmail(formValues.email)) {
      errors.email = "Please enter a valid email address";
    }

    const passwordRegex = /^(?=.*[!@#$%^&*])(?=.*[A-Z])(?=.*[0-9])[A-Za-z\d!@#$%^&*]{8,}$/;
    if (!formValues.password) {
      errors.password = "Password is required";
    } else if (!passwordRegex.test(formValues.password)) {
      errors.password = "Password must contain at least 8 characters, one uppercase letter, one number, and one special character";
    }

    if (!formValues.confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (formValues.password !== formValues.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    return errors;
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormValues(prev => ({ ...prev, [id]: value }));
    if (formErrors[id]) {
      setFormErrors(prev => ({ ...prev, [id]: "" }));
    }
    setApiError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formValues),
      });

      const data = await response.json();
      
      if (response.ok) {
        navigate("/verify-otp", { 
          state: { 
            email: formValues.email,
            message: "Please check your email for the OTP code" 
          } 
        });
      } else {
        setApiError(data.message || "Registration failed. Please try again.");
      }
    } catch (error) {
      setApiError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center min-h-screen p-4 bg-[#dfa674]">
        <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-2xl">
          <h2 className="mb-6 text-2xl font-bold text-center text-indigo-800">
            Create an Account
          </h2>

          {apiError && (
            <div className="p-3 mb-4 text-sm text-red-500 bg-red-100 rounded-lg">
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label htmlFor="username" className="block mb-2 font-semibold text-indigo-900">
                Username
              </label>
              <input
                type="text"
                id="username"
                className={`w-full px-4 py-2 border rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-800 ${
                  formErrors.username ? "border-red-500" : "border-gray-200"
                }`}
                placeholder="Enter your username"
                value={formValues.username}
                onChange={handleChange}
                disabled={loading}
              />
              {formErrors.username && (
                <p className="mt-1 text-sm text-red-500">{formErrors.username}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block mb-2 font-semibold text-indigo-900">
                Email
              </label>
              <input
                type="email"
                id="email"
                className={`w-full px-4 py-2 border rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-800 ${
                  formErrors.email ? "border-red-500" : "border-gray-200"
                }`}
                placeholder="Enter your email"
                value={formValues.email}
                onChange={handleChange}
                disabled={loading}
              />
              {formErrors.email && (
                <p className="mt-1 text-sm text-red-500">{formErrors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block mb-2 font-semibold text-indigo-900">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className={`w-full px-4 py-2 border rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-800 ${
                    formErrors.password ? "border-red-500" : "border-gray-200"
                  }`}
                  placeholder="Enter your password"
                  value={formValues.password}
                  onChange={handleChange}
                  disabled={loading}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-indigo-800"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              {formErrors.password && (
                <p className="mt-1 text-sm text-red-500">{formErrors.password}</p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block mb-2 font-semibold text-indigo-900">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  className={`w-full px-4 py-2 border rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-800 ${
                    formErrors.confirmPassword ? "border-red-500" : "border-gray-200"
                  }`}
                  placeholder="Confirm your password"
                  value={formValues.confirmPassword}
                  onChange={handleChange}
                  disabled={loading}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-indigo-800"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? "Hide" : "Show"}
                </button>
              </div>
              {formErrors.confirmPassword && (
                <p className="mt-1 text-sm text-red-500">{formErrors.confirmPassword}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 mt-6 font-semibold text-white transition-all duration-300 transform bg-indigo-800 rounded-lg hover:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-800 focus:ring-offset-2 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Register"}
            </button>
          </form>

          <p className="mt-6 text-center text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-indigo-800 hover:text-indigo-900">
              Sign In
            </Link>
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Register;