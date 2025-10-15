// src/pages/Login.jsx
import { useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { authService } from "../services/authService";
import { FaGoogle, FaTwitter, FaUser, FaEnvelope, FaPhone, FaLock } from "react-icons/fa";
import { FiMail, FiLock } from "react-icons/fi";
import ForgotPassword from "../components/ForgotPassword";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Toggle between login and register
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  // Login form state
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  
  // Register form state
  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "",
    password: "",
    confirmPassword: "",
    agree: false,
  });
  
  const [error, setError] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  
  // Handle login form changes
  const handleLoginChange = (e) => {
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
    setError("");
  };
  const handleForgotPassword = () => {
    setShowForgotPassword(true);
    setError(""); // Clear any existing errors
  };
  
  // Handle register form changes
  const handleRegisterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setRegisterForm({
      ...registerForm,
      [name]: type === "checkbox" ? checked : value,
    });
    // Clear specific error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleGenderSelect = (gender) => {
    setRegisterForm({ ...registerForm, gender });
    if (errors.gender) {
      setErrors({ ...errors, gender: "" });
    }
  };

  // Toggle between login and register
  const toggleMode = () => {
    setIsRegisterMode(!isRegisterMode);
    setError("");
    setErrors({});
    // Reset forms when switching
    setLoginForm({ email: "", password: "" });
    setRegisterForm({
      name: "",
      email: "",
      phone: "",
      gender: "",
      password: "",
      confirmPassword: "",
      agree: false,
    });
  };

  // Validate register form
  const validateRegister = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;

    if (!registerForm.name.trim()) newErrors.name = "Name is required";
    if (!emailRegex.test(registerForm.email)) newErrors.email = "Invalid email address";
    if (!phoneRegex.test(registerForm.phone)) newErrors.phone = "Enter a 10-digit phone number";
    if (!registerForm.gender) newErrors.gender = "Please select gender";
    if (!registerForm.password) newErrors.password = "Password is required";
    if (registerForm.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    if (registerForm.password !== registerForm.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    if (!registerForm.agree) newErrors.agree = "You must agree to continue";

    return newErrors;
  };

  // Handle login submit
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await login(loginForm.email, loginForm.password);
      console.log("result",result);
      
      if (result.success) {
        console.log("✅ Login successful");
        const from = location.state?.from || "/profile";
       
        console.log("from",from);
        if(result.user.usertype==="admin"){
            navigate("/admin")
        }
        else{
          navigate(from, { replace: true });
        }
       
      } else {
        alert( result.message);
        setError(result.message);
      }
    } catch (err) {
      console.error("❌ Login failed:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle register submit
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateRegister();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const result = await authService.register(registerForm);
      console.log("✅ Registered:", result);
      
      // Switch to login mode and show success message
      setIsRegisterMode(false);
      setError("");
      setErrors({});
      // Pre-fill email in login form
      setLoginForm({ email: registerForm.email, password: "" });
      alert("🎉 Registration successful! Please log in with your credentials.");
      
    } catch (err) {
      console.error("❌ Registration error:",  err.message);
       const errorMsg =err.message||
    err.response?.data?.msg ||
    err.response?.data?.message ||
    err.message ||
    "Error creating user. Please try again.";

  setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white via-[#fff5f5] to-[#fdf1f1] p-4">
     
      <div className="bg-white rounded-xl shadow-xl p-6 md:p-8 max-w-md w-full text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-red-600 rounded-full p-3">
            <span className="text-white text-2xl font-bold">❤</span>
          </div>
        </div>
        
        {/* Dynamic Header */}
        <h2 className="text-2xl font-bold mb-1">
          {isRegisterMode ? "Join RM Matrimony" : "Welcome Back"}
        </h2>
        <p className="text-gray-600 mb-6">
          {isRegisterMode 
            ? "Start your journey to find your perfect match"
            : "Sign in to continue your journey"
          }
        </p>

        {/* Conditional Form Rendering */}
        {!isRegisterMode ? (
          // LOGIN FORM
          <form onSubmit={handleLoginSubmit} className="text-left space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="flex items-center border rounded px-3 py-2">
                <FiMail className="text-gray-400 mr-2" />
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={loginForm.email}
                  onChange={handleLoginChange}
                  className="w-full outline-none"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="flex items-center border rounded px-3 py-2">
                <FiLock className="text-gray-400 mr-2" />
                <input
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={loginForm.password}
                  onChange={handleLoginChange}
                  className="w-full outline-none"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-gray-600 gap-2">
              <label className="flex items-center gap-2">
                <input type="checkbox" />
                Remember me
              </label>
              {/* <span className="text-red-600 cursor-pointer">Forgot password?</span> */}
              <button
  type="button"
  onClick={handleForgotPassword}
  className="text-red-600 cursor-pointer hover:underline"
>
  Forgot password?
</button>

            </div>
          
            {error && (
              <p className="text-red-600 text-sm text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="bg-red-600 text-white w-full py-2 rounded hover:bg-red-700 transition duration-200 disabled:bg-red-400 disabled:cursor-not-allowed"
            >
              {loading ? "Signing In..." : "Sign In →"}
            </button>
          </form>
        ) : (
          // REGISTER FORM
          <form onSubmit={handleRegisterSubmit} className="text-left space-y-4">
            {/* Full Name */}
            <div className="relative">
              <FaUser className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={registerForm.name}
                onChange={handleRegisterChange}
                disabled={loading}
                className="w-full pl-10 pr-4 py-2 border rounded focus:outline-none focus:border-red-500 disabled:bg-gray-100"
              />
              {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
            </div>

            {/* Email */}
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={registerForm.email}
                onChange={handleRegisterChange}
                disabled={loading}
                className="w-full pl-10 pr-4 py-2 border rounded focus:outline-none focus:border-red-500 disabled:bg-gray-100"
              />
              {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
            </div>

            {/* Phone */}
            <div className="relative">
              <FaPhone className="absolute left-3 top-3 text-gray-400" />
              <input
                type="tel"
                name="phone"
                placeholder="Enter your phone number"
                value={registerForm.phone}
                onChange={(e) => {
                  if (e.target.value.length <= 10 && /^[0-9]*$/.test(e.target.value)) {
                    handleRegisterChange(e);
                  }
                }}
                disabled={loading}
                className="w-full pl-10 pr-4 py-2 border rounded focus:outline-none focus:border-red-500 disabled:bg-gray-100"
              />
              {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone}</p>}
            </div>

            {/* Gender */}
            <div>
              <label className="block mb-2 font-medium text-gray-700">Gender *</label>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  type="button"
                  onClick={() => handleGenderSelect("Male")}
                  disabled={loading}
                  className={`flex-1 border rounded py-2 transition ${
                    registerForm.gender === "Male"
                      ? "bg-red-500 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  Male
                </button>
                <button
                  type="button"
                  onClick={() => handleGenderSelect("Female")}
                  disabled={loading}
                  className={`flex-1 border rounded py-2 transition ${
                    registerForm.gender === "Female"
                      ? "bg-red-500 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  Female
                </button>
              </div>
              {errors.gender && <p className="text-sm text-red-500 mt-1">{errors.gender}</p>}
            </div>

            {/* Password */}
            <div className="relative">
              <FaLock className="absolute left-3 top-3 text-gray-400" />
              <input
                type="password"
                name="password"
                placeholder="Create a password (min 6 characters)"
                value={registerForm.password}
                onChange={handleRegisterChange}
                disabled={loading}
                className="w-full pl-10 pr-4 py-2 border rounded focus:outline-none focus:border-red-500 disabled:bg-gray-100"
              />
              {errors.password && (
                <p className="text-sm text-red-500 mt-1">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <FaLock className="absolute left-3 top-3 text-gray-400" />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm your password"
                value={registerForm.confirmPassword}
                onChange={handleRegisterChange}
                disabled={loading}
                className="w-full pl-10 pr-4 py-2 border rounded focus:outline-none focus:border-red-500 disabled:bg-gray-100"
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-500 mt-1">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Terms */}
            <div className="flex items-start">
              <input
                type="checkbox"
                name="agree"
                checked={registerForm.agree}
                onChange={handleRegisterChange}
                disabled={loading}
                className="mr-2 mt-1"
              />
              <label className="text-sm text-gray-600">
                I agree to the{" "}
                <span className="text-red-500 font-medium underline cursor-pointer">
                  Terms and Conditions
                </span>{" "}
                and{" "}
                <span className="text-red-500 font-medium underline cursor-pointer">
                  Privacy Policy
                </span>
              </label>
            </div>
            {errors.agree && <p className="text-sm text-red-500 mt-1">{errors.agree}</p>}

            {/* General Error */}
            {error && (
              <p className="text-red-600 text-sm text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-500 text-white py-3 rounded hover:bg-red-600 transition disabled:bg-red-400 disabled:cursor-not-allowed"
            >
              {loading ? "Creating Account..." : "Create Account →"}
            </button>
          </form>
        )}

        {/* Social Login - Only show for login mode */}
      
        {/* Switch Mode Text */}
        <p className="mt-6 text-sm text-gray-600">
          {isRegisterMode ? (
            <>
              Already have an account?{" "}
              <span
                className="text-red-600 font-medium cursor-pointer hover:underline"
                onClick={toggleMode}
              >
                Sign in here
              </span>
            </>
          ) : (
            <>
              Don't have an account?{" "}
              <span
                className="text-red-600 font-medium cursor-pointer hover:underline"
                onClick={toggleMode}
              >
                Sign up here
              </span>
            </>
          )}
        </p>
      </div>
      {showForgotPassword && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div className="bg-white rounded-xl shadow-xl p-6 md:p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
      <ForgotPassword
        onClose={() => setShowForgotPassword(false)}
        onBackToLogin={() => setShowForgotPassword(false)}
      />
    </div>
  </div>
)}
    </div>
  );
};

export default Login;
