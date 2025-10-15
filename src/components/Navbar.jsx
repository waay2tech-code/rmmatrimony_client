import { Link, useLocation, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState, useRef } from "react";
import { HiMenu, HiX, HiHome, HiSearch, HiUserGroup } from "react-icons/hi";
import { AuthContext } from "../context/AuthContext";
import { FaUser, FaCog, FaSignOutAlt, FaUserShield } from "react-icons/fa";
import logo from "../assets/Logo with name.png"; // Adjust the path as necessary
import { HiBell } from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setDropdownOpen(false);
  }, [location]);

  const protectedNavigate = (path) => {
    if (user) {
      navigate(path);
    } else {
      navigate("/login");
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-3 shadow-sm sticky top-0 z-50 backdrop-blur-md bg-white/90">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="cursor-pointer flex items-center" onClick={() => navigate("/")}>
          <img 
            src={logo} 
            alt="RM Matrimony" 
            className="h-10 md:h-12 w-30 md:w-30 transition-transform duration-300 hover:scale-105"
          />
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-1">
          <Link
            to="/"
            className={`flex items-center space-x-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
              location.pathname === "/"
                ? "text-red-600 bg-red-50 font-semibold"
                : "text-gray-700 hover:text-red-600 hover:bg-gray-50"
            }`}
          >
            <HiHome className="h-4 w-4" />
            <span>Home</span>
          </Link>

          <Link
            to="/about"
            className={`flex items-center space-x-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
              location.pathname === "/about"
                ? "text-red-600 bg-red-50 font-semibold"
                : "text-gray-700 hover:text-red-600 hover:bg-gray-50"
            }`}
          >
            <span>About</span>
          </Link>

          <button
            onClick={() => protectedNavigate("/search")}
            className={`flex items-center space-x-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
              location.pathname === "/search"
                ? "text-red-600 bg-red-50 font-semibold"
                : "text-gray-700 hover:text-red-600 hover:bg-gray-50"
            }`}
          >
            <HiSearch className="h-4 w-4" />
            <span>Search</span>
          </button>

          <button
            onClick={() => protectedNavigate("/matches")}
            className={`flex items-center space-x-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
              location.pathname === "/matches"
                ? "text-red-600 bg-red-50 font-semibold"
                : "text-gray-700 hover:text-red-600 hover:bg-gray-50"
            }`}
          >
            <HiUserGroup className="h-4 w-4" />
            <span>Matches</span>
          </button>

          {/* Notification Icon */}
          {user && (
            <button
              onClick={() => navigate("/notifications")}
              className="relative mr-2 p-2 rounded-full hover:bg-gray-100 transition-all duration-300"
              title="Notifications"
            >
              <HiBell className="h-5 w-5 text-gray-700" />
              {/* Badge indicator */}
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-600 animate-ping"></span>
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-600"></span>
            </button>
          )}

          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-2 text-sm font-medium bg-gradient-to-r from-red-600 to-orange-500 text-white px-4 py-2 rounded-full hover:from-red-700 hover:to-orange-600 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                <FaUser />
                <span className="hidden lg:inline">{user.name || "Profile"}</span>
              </button>

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl py-2 z-50 border border-gray-100"
                  >
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <FaUser className="mr-2" />
                      My Profile
                    </Link>
                    <Link
                      to="/settings"
                      className="flex items-center px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <FaCog className="mr-2" />
                      Settings
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        navigate("/login");
                        setDropdownOpen(false);
                      }}
                      className="w-full text-left flex items-center px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
                    >
                      <FaSignOutAlt className="mr-2" />
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link
                to="/login"
                className="text-gray-700 hover:text-red-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-300"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Join Now
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex items-center">
          {user && (
            <button
              onClick={() => navigate("/notifications")}
              className="relative mr-3 p-2 rounded-full hover:bg-gray-100 transition-all duration-300"
              title="Notifications"
            >
              <HiBell className="h-5 w-5 text-gray-700" />
              {/* Badge indicator */}
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-600 animate-ping"></span>
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-600"></span>
            </button>
          )}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-gray-700 focus:outline-none p-2 rounded-lg hover:bg-gray-100 transition-colors duration-300"
          >
            {isMobileMenuOpen ? <HiX size={24} /> : <HiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            ref={mobileMenuRef}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden mt-2 space-y-2 px-2 pb-4"
          >
            <Link
              to="/"
              className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                location.pathname === "/"
                  ? "text-red-600 bg-red-50 font-semibold"
                  : "text-gray-700 hover:text-red-600 hover:bg-gray-50"
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/about"
              className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                location.pathname === "/about"
                  ? "text-red-600 bg-red-50 font-semibold"
                  : "text-gray-700 hover:text-red-600 hover:bg-gray-50"
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About
            </Link>
            <button
              onClick={() => {
                protectedNavigate("/search");
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left block px-4 py-3 text-gray-700 hover:text-red-600 hover:bg-gray-50 text-sm rounded-lg transition-all duration-300"
            >
              Search
            </button>
            <button
              onClick={() => {
                protectedNavigate("/matches");
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left block px-4 py-3 text-gray-700 hover:text-red-600 hover:bg-gray-50 text-sm rounded-lg transition-all duration-300"
            >
              Matches
            </button>

            {user ? (
              <>
                <Link
                  to="/profile"
                  className="block px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 text-sm rounded-lg transition-all duration-300"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  My Profile
                </Link>
                <Link
                  to="/settings"
                  className="block px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 text-sm rounded-lg transition-all duration-300"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Settings
                </Link>
                <button
                  onClick={() => {
                    logout();
                    navigate("/login");
                    setIsMobileMenuOpen(false);
                  }}
                  className="block px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 text-sm rounded-lg w-full text-left transition-all duration-300"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="space-y-2 pt-2">
                <Link
                  to="/login"
                  className="block px-4 py-3 text-gray-700 hover:text-red-600 hover:bg-gray-50 text-sm rounded-lg transition-all duration-300"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block px-4 py-3 bg-gradient-to-r from-red-600 to-orange-500 text-white rounded-lg text-sm text-center hover:from-red-700 hover:to-orange-600 transition-all duration-300 shadow-md"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Join Now
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;