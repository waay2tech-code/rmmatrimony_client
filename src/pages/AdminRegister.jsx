import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api"; // Use the existing api service
import { FaUser, FaEnvelope, FaLock, FaUserShield } from "react-icons/fa";

const AdminRegister = () => {
  const navigate = useNavigate();
  
  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterForm({
      ...registerForm,
      [name]: value,
    });
    setError("");
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!registerForm.name || !registerForm.email || !registerForm.password) {
      setError("All fields are required");
      return;
    }
    
    if (registerForm.password !== registerForm.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    if (registerForm.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Use the special admin registration endpoint
      const response = await api.post('/auth/admin/register', {
        name: registerForm.name,
        email: registerForm.email,
        password: registerForm.password
      });
      
      if (response.data.msg) {
        setSuccess(true);
        // Reset form
        setRegisterForm({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
        
        // Redirect to admin login after successful registration
        setTimeout(() => {
          navigate("/admin/Suji1972$$");
        }, 2000);
      }
    } catch (err) {
      console.error("❌ Admin registration error:", err);
      const errorMsg = err.response?.data?.msg || err.response?.data?.message || "Error creating admin account. Please try again.";
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
            <FaUserShield className="text-white text-2xl" />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold mb-1">Admin Registration</h2>
        <p className="text-gray-600 mb-6">Create an admin account</p>

        {success ? (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {success.message || "Admin account created successfully! Redirecting to login..."}
          </div>
        ) : (
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
            </div>

            {/* Email */}
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
              <input
                type="email"
                name="email"
                placeholder="Enter your admin email"
                value={registerForm.email}
                onChange={handleRegisterChange}
                disabled={loading}
                className="w-full pl-10 pr-4 py-2 border rounded focus:outline-none focus:border-red-500 disabled:bg-gray-100"
              />
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
            </div>

            {/* Error Message */}
            {error && (
              <p className="text-red-600 text-sm text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition disabled:bg-red-400 disabled:cursor-not-allowed"
            >
              {loading ? "Creating Account..." : "Create Admin Account →"}
            </button>
          </form>
        )}

        <p className="mt-6 text-sm text-gray-600">
          Already have an admin account?{" "}
          <a
            href="/admin/Suji1972$$"
            className="text-red-600 font-medium cursor-pointer hover:underline"
          >
            Admin Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default AdminRegister;