import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../components/firebse"; // Adjust the import path based on your project structure
import { createUserWithEmailAndPassword } from "firebase/auth";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Basic validation
    if (!email || !password || !confirmPassword) {
      setError("All fields are required!");
      return;
    }
  
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }
  
    if (!termsAccepted) {
      setError("You must accept the terms and conditions!");
      return;
    }
  
    try {
      // Firebase authentication: Create user with email and password
      await createUserWithEmailAndPassword(auth, email, password);
      setError(""); // Clear error message on success
  
      // Redirect to Login page after successful registration
      navigate("/login"); 
    } catch (err) {
      // Handle Firebase errors
      if (err.code === "auth/email-already-in-use") {
        setError("This email is already in use.");
      } else if (err.code === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else if (err.code === "auth/weak-password") {
        setError("Password should be at least 6 characters.");
      } else {
        setError("Something went wrong! Please try again.");
      }
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-200 to-blue-900 flex items-center justify-center px-4">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-white rounded-xl shadow-xl">
        {/* Left Column: Visual Section */}
        <div className="flex-1 bg-blue-800 text-white p-6 md:flex md:justify-center md:items-center">
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-extrabold">Welcome!</h2>
            <p className="mt-2 text-lg">Create your account to get started.</p>
          </div>
        </div>

        {/* Right Column: Registration Form */}
        <div className="flex-1 p-6 sm:p-8 md:w-full">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
            Create Account
          </h2>

          {error && (
            <p className="text-red-500 text-sm text-center mb-4">{error}</p>
          )}

          <form onSubmit={handleSubmit}>
            {/* Email Input */}
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full p-3 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
            </div>

            {/* Password Input */}
            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-700"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                className="w-full p-3 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
              />
            </div>

            {/* Confirm Password Input */}
            <div className="mb-4">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-semibold text-gray-700"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                className="w-full p-3 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
              />
            </div>

            {/* Terms and Conditions Checkbox */}
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id="terms"
                className="h-5 w-5 text-indigo-500 focus:ring-indigo-500"
                checked={termsAccepted}
                onChange={() => setTermsAccepted(!termsAccepted)}
              />
              <label htmlFor="terms" className="ml-2 text-sm text-gray-700">
                I agree to the{" "}
                <a href="#" className="text-indigo-600 hover:underline">
                  Terms and Conditions
                </a>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 rounded-lg transition duration-300 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Register
            </button>
          </form>

          {/* Social Login Section */}
          <div className="flex justify-between items-center mt-6">
            <div className="h-px bg-gray-300 flex-grow"></div>
            <span className="text-gray-600 px-3">OR</span>
            <div className="h-px bg-gray-300 flex-grow"></div>
          </div>

          {/* Social Media Login */}
          <div className="flex justify-around mt-4">
            <button
              className="bg-blue-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-600 transition duration-300"
              onClick={() => alert("Google Login clicked")}
            >
              Google
            </button>
            <button
              className="bg-gray-800 text-white py-2 px-4 rounded-lg shadow-md hover:bg-gray-700 transition duration-300"
              onClick={() => alert("Facebook Login clicked")}
            >
              Facebook
            </button>
          </div>

          {/* Login Link */}
          <p className="text-center mt-4 text-sm text-gray-600">
            Already have an account?{" "}
            <a href="/login" className="text-indigo-600 hover:underline">
              Login here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;