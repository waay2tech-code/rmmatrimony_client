// src/components/ProtectedRoute.jsx
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Spinner from "./Spinner";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  // ✅ Navigate to home page if not authenticated
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // 🚫 If admin, do not allow access to user routes; send to admin panel
  const userType = (user.userType || user.usertype || user.user_type || user.role || "").toString().toLowerCase();
  if (userType === "admin") {
    return <Navigate to="/admin" replace />;
  }

  return children;
};

export default ProtectedRoute;
