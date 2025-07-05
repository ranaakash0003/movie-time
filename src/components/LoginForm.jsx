import React, { useState } from "react";
import { Film } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const LoginForm = ({ onSuccess }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, signup } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      let result;
      if (isSignup) {
        result = await signup(formData.name, formData.email, formData.password);
      } else {
        result = await login(formData.email, formData.password);
      }

      if (result.success) {
        onSuccess();
      } else {
        setError(result.error);
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const fillDemoCredentials = () => {
    setFormData({
      ...formData,
      email: "demo@example.com",
      password: "password",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 w-full max-w-md border border-white/20">
        <div className="text-center mb-8">
          <Film className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
          <h1 className="text-5xl font-bold text-white mb-2">
            Movie Watchlist
          </h1>
          <p className="text-gray-300">Your personal movie collection</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {isSignup && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                placeholder="Enter your name"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              placeholder="Enter your password"
            />
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold py-3 px-4 rounded-lg hover:from-yellow-500 hover:to-orange-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Please wait..." : isSignup ? "Sign Up" : "Login"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setIsSignup(!isSignup);
              setError("");
            }}
            className="text-yellow-400 hover:text-yellow-300 transition-colors"
          >
            {isSignup
              ? "Already have an account? Login"
              : "Need an account? Sign up"}
          </button>
        </div>

        {!isSignup && (
          <div className="mt-4 p-4 bg-blue-500/20 border border-blue-500/50 rounded-lg">
            <p className="text-blue-200 text-sm text-center mb-2">
              Demo Credentials:
            </p>
            <div className="space-y-1">
              <p className="text-blue-100 text-xs text-center">
                <strong>Email:</strong> demo@example.com
              </p>
              <p className="text-blue-100 text-xs text-center">
                <strong>Password:</strong> password
              </p>
            </div>
            <button
              type="button"
              onClick={fillDemoCredentials}
              className="w-full mt-2 bg-blue-500/30 hover:bg-blue-500/40 text-blue-100 py-1 px-2 rounded text-xs transition-colors"
            >
              Fill Demo Credentials
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginForm;
