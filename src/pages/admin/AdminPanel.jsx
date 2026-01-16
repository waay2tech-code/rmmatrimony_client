import React, { useEffect, useState } from "react";
import { FaTrash, FaEdit, FaUserPlus, FaSearch, FaUsers, FaChevronLeft, FaChevronRight, FaUserShield, FaSignOutAlt } from "react-icons/fa";
import { userService } from "../../services/userService";
import { authService } from "../../services/authService";
import { MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import FadeIn from "../../components/FadeIn";


const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [activeTab, setActiveTab] = useState("users"); // "users" or "admins"
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(10); // Fixed at 10 rows per page
  
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    gender: "",
    mobile: "",
    phone: "",
    age: "",
  });

  useEffect(() => {
    fetchUsers();
    fetchAdmins();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await userService.getAllUsers();
      setUsers(response.users || response.data || response);
      setError("");
    } catch (err) {
      console.error("Failed to fetch users", err);
      setError("Failed to fetch users. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const response = await userService.getAllAdminUsers();
      setAdmins(response.users || response.data || response);
      setError("");
    } catch (err) {
      console.error("Failed to fetch admins", err);
      setError("Failed to fetch admins. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!newUser.name || !newUser.email || !newUser.password || !newUser.gender) {
      setError("Please fill in all required fields (name, email, password, gender)");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const userData = {
        name: newUser.name,
        email: newUser.email,
        password: newUser.password,
        gender: newUser.gender,
        phone: newUser.mobile || newUser.phone,
        age: newUser.age ? parseInt(newUser.age) : undefined,
      };

      await authService.register(userData);

      setNewUser({
        name: "",
        email: "",
        password: "",
        gender: "",
        mobile: "",
        phone: "",
        age: "",
      });

      setSuccessMessage("User registered successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
      await fetchUsers();
    }catch (err) {
  console.error("Error creating user", err);

  const errorMsg =
    err.response?.data?.msg ||
    err.response?.data?.message ||
    err.message ||
    "Error creating user. Please try again.";

  setError(errorMsg);
}

finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id) => {
    if (!editingUser.name || !editingUser.email) {
      setError("Name and email are required");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const updateData = {
        name: editingUser.name,
        email: editingUser.email,
        mobile: editingUser.mobile,
        age: editingUser.age ? parseInt(editingUser.age) : undefined,
        profileType: editingUser.profileType || "Free",
        occupation: editingUser.occupation,
        caste: editingUser.caste,
      };

      await userService.updateUserByAdmin(id, updateData);

      setEditingUser(null);
      setSuccessMessage("User updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
      await fetchUsers();
    } catch (err) {
      console.error("Update failed", err);
      setError(err.response?.data?.message || "Update failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      setLoading(true);
      setError("");

      await userService.deleteUserByAdmin(id);

      setSuccessMessage("User deleted successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
      await fetchUsers();
    } catch (err) {
      console.error("Delete failed", err);
      setError(err.response?.data?.message || "Delete failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAdmin = async (id) => {
    if (!window.confirm("Are you sure you want to delete this admin? This action cannot be undone.")) return;

    try {
      setLoading(true);
      setError("");

      await userService.deleteAdminUser(id);

      setSuccessMessage("Admin deleted successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
      await fetchAdmins();
    } catch (err) {
      console.error("Admin deletion failed", err);
      setError(err.response?.data?.message || "Admin deletion failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGenderSelect = (gender) => {
    setNewUser({ ...newUser, gender });
  };

  const filteredUsers = users.filter((user) => {
    if (searchTerm.toLowerCase() === "male") {
      return user.gender.toLowerCase() === "male";
    } else if (searchTerm.toLowerCase() === "female") {
      return user.gender.toLowerCase() === "female";
    } else {
      return [user.name, user.email, user.mobile, user.age,user.caste,user.occupation,user.profileType].join(" ").toLowerCase().includes(searchTerm.toLowerCase());
    }
  });

  // Filter admins based on search term
  const filteredAdmins = admins.filter((admin) => {
    return [admin.name, admin.email].join(" ").toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Pagination calculations for users
  const totalPages = Math.ceil(filteredUsers.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      }
    }
    
    return pageNumbers;
  };

  const handleProfileViewersClick = () => {
    navigate("/profile-views");
  };

  const handleUserClick = (userId) => {
    navigate(`/profile/${userId}`);
  };

  const handleLogout = async () => {
    if (window.confirm("Are you sure you want to logout?")) {
      await logout();
    }
  };

  // Fixed the Full Edit button navigation
  const handleFullEdit = (userId) => {
    navigate(`/admin/update-user/${userId}`);
  };

  return (
    <FadeIn className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-red-600">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 mt-2">Manage users and system settings</p>
          </div>
          <div className="flex items-center gap-4 flex-wrap">
            {user && (
              <div className="flex items-center gap-2 bg-red-50 px-4 py-2 rounded-full">
                <div className="bg-red-100 p-2 rounded-full">
                  <FaUserShield className="text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Admin</p>
                  <p className="font-medium">{user.name}</p>
                </div>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-all shadow-md hover:shadow-lg"
            >
              <FaSignOutAlt />
              <span>Logout</span>
            </button>
            <button
              onClick={() => navigate("/contact-query")}
              className="p-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition-all shadow-md hover:shadow-lg"
            >
              <MessageSquare size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6 shadow-sm">
          <p>{error}</p>
        </div>
      )}

      {successMessage && (
        <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded-lg mb-6 shadow-sm">
          <p>{successMessage}</p>
        </div>
      )}

      {/* User Registration Card */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-red-100 p-2 rounded-lg">
            <FaUserPlus className="text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-800">Register New User</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
          {[
            "name",
            "email",
            "mobile",
            "age",
            "password"
          ].map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field.charAt(0).toUpperCase() + field.slice(1)}
                {field === "name" || field === "email" || field === "password" ? " *" : ""}
              </label>
              <input
                type={field === "password" ? "password" : field === "age" ? "number" : "text"}
                placeholder={`Enter ${field}`}
                value={newUser[field]}
                onChange={(e) => setNewUser({ ...newUser, [field]: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
                disabled={loading}
                required={field === "name" || field === "email" || field === "password"}
              />
            </div>
          ))}
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Gender *</label>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => handleGenderSelect("Male")}
              disabled={loading}
              className={`flex-1 py-2 rounded-lg transition ${
                newUser.gender === "Male"
                  ? "bg-red-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              Male
            </button>
            <button
              type="button"
              onClick={() => handleGenderSelect("Female")}
              disabled={loading}
              className={`flex-1 py-2 rounded-lg transition ${
                newUser.gender === "Female"
                  ? "bg-red-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              Female
            </button>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-500">* Required fields</p>
          <button
            onClick={handleCreate}
            disabled={
              loading || !newUser.name || !newUser.email || !newUser.password || !newUser.gender
            }
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
          >
            {loading ? "Registering..." : "Register User"}
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-2xl shadow-lg p-2 mb-6">
        <div className="flex">
          <button
            className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition ${
              activeTab === "users"
                ? "bg-red-600 text-white shadow-md"
                : "text-gray-600 hover:bg-red-50"
            }`}
            onClick={() => setActiveTab("users")}
          >
            Users
          </button>
          <button
            className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition flex items-center justify-center ${
              activeTab === "admins"
                ? "bg-red-600 text-white shadow-md"
                : "text-gray-600 hover:bg-red-50"
            }`}
            onClick={() => setActiveTab("admins")}
          >
            <FaUserShield className="mr-2" />
            Admins
          </button>
        </div>
      </div>

      {/* Search and Actions */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative flex-1 max-w-md w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder={`Search by ${activeTab === "users" ? "name, email, mobile, age, caste, occupation, profile type" : "name, email"}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
            />
          </div>
          <button
            onClick={handleProfileViewersClick}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all shadow-md hover:shadow-lg whitespace-nowrap"
          >
            <FaUsers className="text-white" />
            Profile Viewers
          </button>
        </div>
      </div>

      {/* Data Table Card */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h2 className="text-xl font-bold text-gray-800">
            {activeTab === "users" ? `All Users (${filteredUsers.length})` : `All Admins (${filteredAdmins.length})`}
          </h2>
          
          {/* Pagination Info */}
          {activeTab === "users" && filteredUsers.length > 0 && (
            <div className="text-sm text-gray-600">
              Showing {startIndex + 1}-{Math.min(endIndex, filteredUsers.length)} of {filteredUsers.length} users
            </div>
          )}
        </div>

        {loading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-600"></div>
            <p className="mt-2 text-gray-600">Loading {activeTab}...</p>
          </div>
        )}

        {!loading && (
          activeTab === "users" ? (
            filteredUsers.length === 0 ? (
              <div className="text-center py-8">
                <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaUsers className="text-gray-400 text-2xl" />
                </div>
                <p className="text-gray-600">No users found.</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-600">
                      <tr>
                        <th className="py-3 px-4 text-left font-semibold">Name</th>
                        <th className="py-3 px-4 text-left font-semibold">Email</th>
                        <th className="py-3 px-4 text-left font-semibold hidden md:table-cell">Occupation</th>
                        <th className="py-3 px-4 text-left font-semibold hidden sm:table-cell">Mobile</th>
                        <th className="py-3 px-4 text-left font-semibold hidden lg:table-cell">Caste</th>
                        <th className="py-3 px-4 text-left font-semibold hidden md:table-cell">Age</th>
                        <th className="py-3 px-4 text-left font-semibold hidden md:table-cell">Gender</th>
                        <th className="py-3 px-4 text-left font-semibold hidden sm:table-cell">Profile Type</th>
                        <th className="py-3 px-4 text-left font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {currentUsers.map((user) =>
                        editingUser?._id === user._id ? (
                          <tr key={user._id} className="bg-red-50">
                            <td className="py-3 px-4">
                              <input
                                value={editingUser.name}
                                onChange={(e) =>
                                  setEditingUser({ ...editingUser, name: e.target.value })
                                }
                                className="w-full px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                disabled={loading}
                              />
                            </td>
                            <td className="py-3 px-4">
                              <input
                                value={editingUser.email}
                                onChange={(e) =>
                                  setEditingUser({ ...editingUser, email: e.target.value })
                                }
                                className="w-full px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                disabled={loading}
                              />
                            </td>
                            <td className="py-3 px-4 hidden md:table-cell">
                              <input
                                value={editingUser.occupation || ""}
                                onChange={(e) =>
                                  setEditingUser({ ...editingUser, occupation: e.target.value })
                                }
                                className="w-full px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                disabled={loading}
                              />
                            </td>
                            <td className="py-3 px-4 hidden sm:table-cell">
                              <input
                                value={editingUser.mobile || ""}
                                onChange={(e) =>
                                  setEditingUser({ ...editingUser, mobile: e.target.value })
                                }
                                className="w-full px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                disabled={loading}
                              />
                            </td>
                            <td className="py-3 px-4 hidden lg:table-cell">
                              <input
                                value={editingUser.caste || ""}
                                onChange={(e) =>
                                  setEditingUser({ ...editingUser, caste: e.target.value })
                                }
                                className="w-full px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                disabled={loading}
                              />
                            </td>
                            <td className="py-3 px-4 hidden md:table-cell">
                              <input
                                type="number"
                                value={editingUser.age || ""}
                                onChange={(e) =>
                                  setEditingUser({ ...editingUser, age: e.target.value })
                                }
                                className="w-full px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                disabled={loading}
                              />
                            </td>
                            <td className="py-3 px-4 hidden md:table-cell">
                              <span className="text-sm text-gray-600">{user.gender || "N/A"}</span>
                            </td>
                            <td className="py-3 px-4 hidden sm:table-cell">
                              <select
                                value={editingUser.profileType || "Free"}
                                onChange={(e) =>
                                  setEditingUser({ ...editingUser, profileType: e.target.value })
                                }
                                className="w-full px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                disabled={loading}
                              >
                                <option value="Free">Free</option>
                                <option value="Premium">Premium</option>
                              </select>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex flex-wrap gap-2">
                                <button
                                  onClick={() => handleUpdate(user._id)}
                                  disabled={loading}
                                  className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-green-400 text-xs font-medium transition"
                                >
                                  {loading ? "Saving..." : "Save"}
                                </button>
                                <button
                                  onClick={() => setEditingUser(null)}
                                  disabled={loading}
                                  className="px-3 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 disabled:bg-gray-200 text-xs font-medium transition"
                                >
                                  Cancel
                                </button>
                              </div>
                            </td>
                          </tr>
                        ) : (
                          <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                            <td 
                              className="py-3 px-4 font-medium text-red-600 cursor-pointer hover:underline"
                              onClick={() => handleUserClick(user._id)}
                            >
                              {user.name}
                            </td>
                            <td className="py-3 px-4">{user.email}</td>
                            <td className="py-3 px-4 hidden md:table-cell">{user.occupation || "N/A"}</td>
                            <td className="py-3 px-4 hidden sm:table-cell">{user.mobile}</td>
                            <td className="py-3 px-4 hidden lg:table-cell">{user.caste || "N/A"}</td>
                            <td className="py-3 px-4 hidden md:table-cell">{user.age || "N/A"}</td>
                            <td className="py-3 px-4 hidden md:table-cell">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                user.gender === "Male" 
                                  ? "bg-red-100 text-red-800" 
                                  : user.gender === "Female" 
                                    ? "bg-pink-100 text-pink-800" 
                                    : "bg-gray-100 text-gray-800"
                              }`}>
                                {user.gender || "N/A"}
                              </span>
                            </td>
                            <td className="py-3 px-4 hidden sm:table-cell">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                user.profileType === "Premium" 
                                  ? "bg-purple-100 text-purple-800" 
                                  : "bg-gray-100 text-gray-800"
                              }`}>
                                {user.profileType || "Free"}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex flex-wrap gap-2">
                                <button
                                  onClick={() =>
                                    setEditingUser({ ...user, profileType: user.profileType || "Free" })
                                  }
                                  disabled={loading}
                                  className="flex items-center gap-1 text-red-600 hover:text-red-800 disabled:text-red-300 text-sm font-medium"
                                >
                                  <FaEdit /> Edit
                                </button>
                                <button
                                  onClick={() => handleFullEdit(user._id)}
                                  disabled={loading}
                                  className="flex items-center gap-1 text-purple-600 hover:text-purple-800 disabled:text-purple-300 text-sm font-medium"
                                  title="Edit full user details"
                                >
                                  Full Edit
                                </button>
                                <button
                                  onClick={() => handleDelete(user._id)}
                                  disabled={loading}
                                  className="flex items-center gap-1 text-red-600 hover:text-red-800 disabled:text-red-300 text-sm font-medium"
                                >
                                  <FaTrash /> Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-6 pt-6 border-t border-gray-200">
                    <div className="text-sm text-gray-600 mb-4 md:mb-0">
                      Page {currentPage} of {totalPages}
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={handlePreviousPage}
                        disabled={currentPage === 1}
                        className="flex items-center justify-center w-9 h-9 rounded-lg bg-gray-100 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition"
                      >
                        <FaChevronLeft />
                      </button>

                      {getPageNumbers().map((page, index) => (
                        <button
                          key={index}
                          onClick={() => typeof page === 'number' && handlePageChange(page)}
                          className={`flex items-center justify-center w-9 h-9 rounded-lg ${
                            currentPage === page
                              ? "bg-red-600 text-white shadow-md"
                              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                          } ${typeof page !== 'number' ? "cursor-default bg-white" : ""}`}
                          disabled={typeof page !== 'number'}
                        >
                          {page}
                        </button>
                      ))}

                      <button
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                        className="flex items-center justify-center w-9 h-9 rounded-lg bg-gray-100 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition"
                      >
                        <FaChevronRight />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )
          ) : (
            // Admins tab content
            filteredAdmins.length === 0 ? (
              <div className="text-center py-8">
                <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaUserShield className="text-gray-400 text-2xl" />
                </div>
                <p className="text-gray-600">No admins found.</p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-gray-600">
                    <tr>
                      <th className="py-3 px-4 text-left font-semibold">Name</th>
                      <th className="py-3 px-4 text-left font-semibold">Email</th>
                      <th className="py-3 px-4 text-left font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredAdmins.map((admin) => (
                      <tr key={admin._id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-4 font-medium">{admin.name}</td>
                        <td className="py-3 px-4">{admin.email}</td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => handleDeleteAdmin(admin._id)}
                            disabled={loading}
                            className="flex items-center gap-1 text-red-600 hover:text-red-800 disabled:text-red-300 text-sm font-medium"
                          >
                            <FaTrash /> Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          )
        )}
      </div>
      </div>
    </FadeIn>
  );
};

export default AdminPanel;
