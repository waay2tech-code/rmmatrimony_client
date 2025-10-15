import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FiMail, FiLock } from "react-icons/fi";
import { FaUserShield } from "react-icons/fa";

const AdminLogin = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLoginChange = (e) => {
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
    setError("");
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await login(loginForm.email, loginForm.password);
      
      if (result.success) {
        // Check if the logged in user is an admin
        const type = (result.user.userType || result.user.usertype || result.user.user_type || result.user.role || "").toString().toLowerCase();
        if (type === "admin") {
          navigate("/admin");
        } else {
          setError("Access denied. Admin privileges required.");
          // We don't need to logout here as the context will handle authentication state
        }
      } else {
        setError(result.message);
      }
    } catch (err) {
      console.error("❌ Login failed:", err);
      setError("An unexpected error occurred. Please try again.");
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
        
        <h2 className="text-2xl font-bold mb-1">Admin Login</h2>
        <p className="text-gray-600 mb-6">Sign in to access admin dashboard</p>

        <form onSubmit={handleLoginSubmit} className="text-left space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Admin Email
            </label>
            <div className="flex items-center border rounded px-3 py-2">
              <FiMail className="text-gray-400 mr-2" />
              <input
                type="email"
                name="email"
                placeholder="Enter your admin email"
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

        <div className="mt-6 text-sm text-gray-600">
          <p>Not an admin?</p>
          <a
            href="/login"
            className="text-red-600 font-medium cursor-pointer hover:underline"
          >
            User Login
          </a>
          {" | "}
          <a
            href="/admin/register"
            className="text-red-600 font-medium cursor-pointer hover:underline"
          >
            Admin Register
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;