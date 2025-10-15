// src/pages/Register.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaPhone, FaLock } from "react-icons/fa";
import { authService } from "../services/authService";
import TermsModal from "../components/TermsModal";
import PrivacyPolicyModal from "../components/PrivacyPolicyModal";

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "",
    password: "",
    confirmPassword: "",
    agree: false,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
    // Clear specific error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleGenderSelect = (gender) => {
    setForm({ ...form, gender });
    if (errors.gender) {
      setErrors({ ...errors, gender: "" });
    }
  };

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;

    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!emailRegex.test(form.email)) newErrors.email = "Invalid email address";
    if (!phoneRegex.test(form.phone)) newErrors.phone = "Enter a 10-digit phone number";
    if (!form.gender) newErrors.gender = "Please select gender";
    if (!form.password) newErrors.password = "Password is required";
    if (form.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    if (form.password !== form.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    if (!form.agree) newErrors.agree = "You must agree to continue";

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const result = await authService.register(form);
      console.log("✅ Registered:", result);
      alert("🎉 Registration successful! Please log in.");
      navigate("/login");
    } catch (error) {
      console.error("❌ Registration error:", error.response?.data || error.message);
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.msg || 
                          "Registration failed. Please try again later.";
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-100 to-white p-4">
      <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <div className="bg-red-500 rounded-full p-3 text-white text-xl">❤️</div>
          <h2 className="text-2xl font-bold mt-2">Join RM Matrimony</h2>
          <p className="text-gray-600 text-sm mt-1">
            Start your journey to find your perfect match
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Full Name */}
          <div className="mb-4 relative">
            <FaUser className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={form.name}
              onChange={handleChange}
              disabled={loading}
              className="w-full pl-10 pr-4 py-2 border rounded focus:outline-none focus:border-red-500 disabled:bg-gray-100"
            />
            {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
          </div>

          {/* Email */}
          <div className="mb-4 relative">
            <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
              disabled={loading}
              className="w-full pl-10 pr-4 py-2 border rounded focus:outline-none focus:border-red-500 disabled:bg-gray-100"
            />
            {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
          </div>

          {/* Phone */}
          <div className="mb-4 relative">
            <FaPhone className="absolute left-3 top-3 text-gray-400" />
            <input
              type="tel"
              name="phone"
              placeholder="Enter your phone number"
              value={form.phone}
              onChange={(e) => {
                if (e.target.value.length <= 10 && /^[0-9]*$/.test(e.target.value)) {
                  handleChange(e);
                }
              }}
              disabled={loading}
              className="w-full pl-10 pr-4 py-2 border rounded focus:outline-none focus:border-red-500 disabled:bg-gray-100"
            />
            {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone}</p>}
          </div>

          {/* Gender */}
          <div className="mb-4">
            <label className="block mb-1 font-medium">Gender</label>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                type="button"
                onClick={() => handleGenderSelect("Male")}
                disabled={loading}
                className={`w-full border rounded py-2 transition ${
                  form.gender === "Male"
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
                className={`w-full border rounded py-2 transition ${
                  form.gender === "Female"
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
          <div className="mb-4 relative">
            <FaLock className="absolute left-3 top-3 text-gray-400" />
            <input
              type="password"
              name="password"
              placeholder="Create a password"
              value={form.password}
              onChange={handleChange}
              disabled={loading}
              className="w-full pl-10 pr-4 py-2 border rounded focus:outline-none focus:border-red-500 disabled:bg-gray-100"
            />
            {errors.password && (
              <p className="text-sm text-red-500 mt-1">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="mb-4 relative">
            <FaLock className="absolute left-3 top-3 text-gray-400" />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm your password"
              value={form.confirmPassword}
              onChange={handleChange}
              disabled={loading}
              className="w-full pl-10 pr-4 py-2 border rounded focus:outline-none focus:border-red-500 disabled:bg-gray-100"
            />
            {errors.confirmPassword && (
              <p className="text-sm text-red-500 mt-1">{errors.confirmPassword}</p>
            )}
          </div>

          {/* Terms */}
          <div className="mb-4 flex items-start">
            <input
              type="checkbox"
              name="agree"
              checked={form.agree}
              onChange={handleChange}
              disabled={loading}
              className="mr-2 mt-1"
            />
            <label className="text-sm text-gray-600">
              I agree to the{" "}
              <span 
                className="text-red-500 font-medium underline cursor-pointer"
                onClick={() => setShowTerms(true)}
              >
                Terms and Conditions
              </span>{" "}
              and{" "}
              <span 
                className="text-red-500 font-medium underline cursor-pointer"
                onClick={() => setShowPrivacy(true)}
              >
                Privacy Policy
              </span>
            </label>
          </div>
          {errors.agree && <p className="text-sm text-red-500 mt-1">{errors.agree}</p>}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-500 text-white py-3 rounded hover:bg-red-600 transition disabled:bg-red-400 disabled:cursor-not-allowed"
          >
            {loading ? "Creating Account..." : "Create Account →"}
          </button>
        </form>

        {/* Sign in link */}
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <span
            className="text-red-500 font-medium cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Sign in here
          </span>
        </p>
      </div>

      {/* Terms and Conditions Modal */}
      <TermsModal isOpen={showTerms} onClose={() => setShowTerms(false)} />
      
      {/* Privacy Policy Modal */}
      <PrivacyPolicyModal isOpen={showPrivacy} onClose={() => setShowPrivacy(false)} />
    </div>
  );
};

export default Register;