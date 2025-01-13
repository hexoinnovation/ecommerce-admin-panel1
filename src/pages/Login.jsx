import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login({ setIsAuthenticated }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false); // To toggle password visibility
  const [rememberMe, setRememberMe] = useState(false); // To handle 'Remember Me' checkbox
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (email === "admin@gmail.com" && password === "password123") {
      setIsAuthenticated(true);
      navigate("/"); // Redirect to Dashboard
    } else {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-900 to-blue-200 flex items-center justify-center px-4">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-white rounded-xl shadow-xl">
        {/* Left Column: Login Form */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-gray-800 text-center">
            Login to Your Account
          </h2>

          {/* Error Message */}
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Input */}
            <div>
              <label
                htmlFor="email"
                className="block text-gray-700 text-sm font-semibold"
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
            <div className="relative">
              <label
                htmlFor="password"
                className="block text-gray-700 text-sm font-semibold"
              >
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className="w-full p-3 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="rememberMe"
                className="mr-2"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
              />
              <label htmlFor="rememberMe" className="text-gray-600 text-sm">
                Remember me
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 rounded-lg transition duration-300 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Login
            </button>
          </form>

          {/* Forgot Password Link */}
          <div className="mt-4 text-center">
            <a
              href="/forgot-password"
              className="text-indigo-600 text-sm hover:underline"
            >
              Forgot your password?
            </a>
          </div>

          {/* Social Login Section */}
          <div className="flex justify-between items-center mt-6">
            <div className="h-px bg-gray-300 flex-grow"></div>
            <span className="text-gray-600 px-2">OR</span>
            <div className="h-px bg-gray-300 flex-grow"></div>
          </div>

          {/* Social Media Login */}
          <div className="flex justify-between mt-4">
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

          {/* Register Link */}
          <p className="text-center mt-4 text-sm text-gray-600">
            Don't have an account?{" "}
            <a href="/register" className="text-indigo-600 hover:underline">
              Register here
            </a>
          </p>
        </div>

        {/* Right Column: Optional content */}
        <div className="hidden md:block bg-blue-800 rounded-r-xl p-8 text-center text-white">
          <h2 className="text-4xl font-semibold">Welcome Back!</h2>
          <p className="mt-4">Please log in to access your account.</p>
        </div>
      </div>
    </div>
  );
}

export default Login;
