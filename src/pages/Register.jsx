import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";

const Register = () => {
  const [formValues, setFormValues] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [formErrors, setFormErrors] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormValues({ ...formValues, [id]: value });
    setFormErrors({ ...formErrors, [id]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = {};
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const passwordStrengthPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

    if (!formValues.username.trim()) {
      errors.username = "Username is required.";
    }

    if (!formValues.email.trim() || !emailPattern.test(formValues.email)) {
      errors.email = "Please enter a valid email.";
    }

    if (!formValues.password) {
      errors.password = "Password is required.";
    } else if (!passwordStrengthPattern.test(formValues.password)) {
      errors.password =
        "Password must be at least 8 characters, contain an uppercase letter, a number, and a special character.";
    }

    if (formValues.password !== formValues.confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
    }

    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      try {
        const response = await fetch("http://localhost:3000/api/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: formValues.username,
            email: formValues.email,
            password: formValues.password,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          alert("Registration successful! Redirecting to login...");
          navigate("/login"); // Navigate to the login page
        } else {
          alert(data.message || "Registration failed.");
        }
      } catch (error) {
        console.error("Error during registration:", error);
        alert("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <>
      <Navbar />
      <br />
      <div className="bg-[#dfa674] flex items-center justify-center min-h-screen p-4">
        <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full animate-fade-in">
          <h2 className="text-2xl font-bold text-center text-indigo-800 mb-8">
            Create an Account
          </h2>
          <form className="space-y-6" onSubmit={handleSubmit} noValidate>
            <div>
              <label
                htmlFor="username"
                className="block text-indigo-900 font-semibold mb-2"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-800 transition-all duration-300 ${
                  formErrors.username ? "border-red-500" : "border-gray-200"
                }`}
                placeholder="Enter your username"
                value={formValues.username}
                onChange={handleChange}
              />
              {formErrors.username && (
                <p className="text-red-500 text-sm mt-2">{formErrors.username}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-indigo-900 font-semibold mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-800 transition-all duration-300 ${
                  formErrors.email ? "border-red-500" : "border-gray-200"
                }`}
                placeholder="Enter your email"
                value={formValues.email}
                onChange={handleChange}
              />
              {formErrors.email && (
                <p className="text-red-500 text-sm mt-2">{formErrors.email}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-indigo-900 font-semibold mb-2"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-800 transition-all duration-300 ${
                    formErrors.password ? "border-red-500" : "border-gray-200"
                  }`}
                  placeholder="Enter your password"
                  value={formValues.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute right-3 top-3 text-indigo-800"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              {formErrors.password && (
                <p className="text-red-500 text-sm mt-2">{formErrors.password}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-indigo-900 font-semibold mb-2"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-800 transition-all duration-300 ${
                  formErrors.confirmPassword ? "border-red-500" : "border-gray-200"
                }`}
                placeholder="Confirm your password"
                value={formValues.confirmPassword}
                onChange={handleChange}
              />
              {formErrors.confirmPassword && (
                <p className="text-red-500 text-sm mt-2">
                  {formErrors.confirmPassword}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-800 text-white py-3 rounded-lg font-semibold hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-indigo-800 focus:ring-offset-2 transition-all duration-300 transform hover:scale-[1.02]"
            >
              Register
            </button>
          </form>

          <p className="text-center text-gray-600 mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-indigo-800 font-semibold hover:text-blue-900 transition-colors duration-300"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
      <br />
      <Footer />
      <br />
    </>
  );
};

export default Register;
