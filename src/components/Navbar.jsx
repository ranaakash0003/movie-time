import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Search, User, LogOut, Film, Bookmark } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <Film className="w-8 h-8 text-[var(--primary-color)] group-hover:scale-110 transition-transform" />
            <span className="text-2xl font-bold">
              Movie<span className="text-[var(--primary-color)]">Time</span>
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/search"
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all hover:bg-gray-800 ${
                isActive("/search") || isActive("/")
                  ? "text-[var(--primary-color)] bg-gray-800/50"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              <Search className="w-4 h-4" />
              <span>Browse</span>
            </Link>

            {user && (
              <Link
                to="/watchlist"
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all hover:bg-gray-800 ${
                  isActive("/watchlist")
                    ? "text-[var(--primary-color)] bg-gray-800/50"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                <Bookmark className="w-4 h-4" />
                <span>My List</span>
              </Link>
            )}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 px-3 py-2 rounded-lg transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span className="hidden sm:block">{user.email}</span>
                </button>

                {isProfileOpen && (
                  <>
                    {/* Backdrop */}
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setIsProfileOpen(false)}
                    />

                    {/* Dropdown Menu */}
                    <div className="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-700 rounded-lg shadow-lg z-20">
                      <div className="py-2">
                        <div className="px-4 py-2 border-b border-gray-700">
                          <p className="text-sm text-gray-400">Signed in as</p>
                          <p className="text-white font-medium truncate">
                            {user.email}
                          </p>
                        </div>

                        <Link
                          to="/watchlist"
                          className="flex items-center space-x-2 px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800 transition-colors md:hidden"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <Bookmark className="w-4 h-4" />
                          <span>My List</span>
                        </Link>

                        <button
                          onClick={handleLogout}
                          className="flex items-center space-x-2 w-full px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-lg hover:bg-gray-800 transition-all"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="bg-[var(--primary-color)] hover:bg-[var(--primary-hover)] text-white px-4 py-2 rounded-lg font-medium transition-all hover:scale-105"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-gray-800">
        <div className="flex items-center justify-around py-2">
          <Link
            to="/search"
            className={`flex flex-col items-center space-y-1 px-3 py-2 ${
              isActive("/search") || isActive("/")
                ? "text-[var(--primary-color)]"
                : "text-gray-400"
            }`}
          >
            <Search className="w-5 h-5" />
            <span className="text-xs">Browse</span>
          </Link>

          {user && (
            <Link
              to="/watchlist"
              className={`flex flex-col items-center space-y-1 px-3 py-2 ${
                isActive("/watchlist")
                  ? "text-[var(--primary-color)]"
                  : "text-gray-400"
              }`}
            >
              <Bookmark className="w-5 h-5" />
              <span className="text-xs">My List</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
