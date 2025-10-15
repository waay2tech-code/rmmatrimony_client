import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiMapPin, FiHeart, FiSearch, FiEye, FiFilter, FiX, FiCheck } from "react-icons/fi";
import { FaHeart, FaLock, FaCrown } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { userService } from "../services/userService";
import { actionService } from "../services/actionService";
import PremiumUpgradeModal from "../components/PremiumUpgradeModal";
import { getDefaultProfileImage, getProfileImageUrl } from '../utils/defaultImage';

const SearchPage = () => {
  const [filters, setFilters] = useState({
    age: "",
    location: "",
    religion: "",
    caste: "",
  });

  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [currentUserProfileType, setCurrentUserProfileType] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const navigate = useNavigate();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  
  // Send interest function using service
  const sendInterest = async (receiverId) => {
    try {
      await actionService.sendInterest(receiverId);
      alert("Interest sent successfully!");
    } catch (error) {
      console.error("Error sending interest:", error);
      alert(
        error.response?.data?.message || "Failed to send interest. Please try again."
      );
    }
  };

  // Fetch current user ID using service
  const fetchCurrentUser = async () => {
    try {
      const userData = await userService.getCurrentUser();
      const userId = userData.id || userData._id || userData.profile?._id || null;
      setCurrentUserId(userId);
    } catch (error) {
      console.error("Error fetching current user ID", error);
      setCurrentUserId(null);
    }
  };

  // Fetch user profile type using service
  const fetchUserProfileType = async () => {
    try {
      const profileTypeData = await userService.getUserProfileType();
      console.log("Profile type response:", profileTypeData);
      
      const isPremium = profileTypeData.profileType?.toLowerCase() === 'premium';
      setCurrentUserProfileType(isPremium);
      console.log("Is Premium User:", isPremium);
      
    } catch (error) {
      console.error("Failed to fetch profile type:", error);
      setCurrentUserProfileType(false);
    }
  };

  // Fetch profiles using service
  const fetchProfiles = async () => {
    setLoading(true);
    try {
      const profilesData = await userService.getAllUsers(filters);
      setProfiles(profilesData.users || profilesData);
    } catch (error) {
      console.error("Error fetching profiles:", error);
      alert("Error fetching profiles");
    }
    setLoading(false);
  };

  // Initialize data
  useEffect(() => {
    const initialize = async () => {
      await fetchCurrentUser();
      await fetchUserProfileType();
    };
    initialize();
  }, []);

  // Fetch profiles when currentUserId is available
  useEffect(() => {
    if (currentUserId) {
      fetchProfiles();
    }
  }, [currentUserId]);

  // Handle filter changes
  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    fetchProfiles();
  };

  // Handle like/unlike using service
  const handleLike = async (profileId) => {
    try {
      const updatedLikes = await userService.toggleLike(profileId);

      // Update the likes array locally
      setProfiles((prevProfiles) =>
        prevProfiles.map((profile) =>
          profile._id === profileId
            ? { ...profile, likes: updatedLikes.likes }
            : profile
        )
      );
    } catch (error) {
      console.error("Error toggling like:", error);
      alert("Error toggling like");
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      age: "",
      location: "",
      religion: "",
      caste: "",
    });
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 py-8 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-red-500 mx-auto mb-4"></div>
          <p className="text-red-600 text-xl font-medium">Loading profiles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-3">Find Your Perfect Match</h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Discover compatible profiles based on your preferences with our advanced matching algorithm
          </p>
        </motion.div>

        {/* Premium Banner for Non-Premium Users */}
        {!currentUserProfileType && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl shadow-xl p-6 mb-10 text-white"
          >
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <h3 className="font-bold text-xl flex items-center mb-2">
                  <FaCrown className="mr-3 text-yellow-300" /> 
                  Upgrade to Premium
                </h3>
                <p className="max-w-lg">Get unlimited access to profiles, advanced filters, and premium features</p>
              </div>
              <button 
                onClick={() => setShowUpgradeModal(true)}
                className="bg-white text-red-600 px-6 py-3 rounded-full font-semibold hover:bg-red-50 transition-all duration-300 shadow-lg"
              >
                Upgrade Now
              </button>
            </div>
          </motion.div>
        )}

        {/* Premium Status for Premium Users */}
        {currentUserProfileType && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-2xl shadow-xl p-6 mb-10 text-white text-center"
          >
            <div className="flex justify-center items-center">
              <FaCrown className="mr-3 text-white" />
              <span className="font-bold text-xl">Premium Member - Full Access Enabled</span>
            </div>
          </motion.div>
        )}

        {/* Filter Toggle Button */}
        <div className="flex justify-center mb-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center bg-white text-red-600 px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <FiFilter className="mr-2 text-lg" />
            <span className="font-medium">{showFilters ? "Hide Filters" : "Show Filters"}</span>
          </motion.button>
        </div>

        {/* Filters Section */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl shadow-xl p-6 mb-10"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Search Filters</h2>
              <button
                type="button"
                onClick={clearFilters}
                className="text-red-500 hover:text-red-700 font-medium flex items-center"
              >
                <FiX className="mr-1" /> Clear All
              </button>
            </div>
            
            <form onSubmit={handleSearch}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {["age", "location", "religion", "caste"].map((field) => (
                  <div key={field}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {field.charAt(0).toUpperCase() + field.slice(1)}
                    </label>
                    <input
                      type="text"
                      name={field}
                      placeholder={`Enter ${field}`}
                      value={filters[field]}
                      onChange={handleFilterChange}
                      className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                    />
                  </div>
                ))}
              </div>
              
              <div className="flex justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-8 py-4 rounded-full flex items-center hover:from-red-600 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl font-medium text-lg"
                >
                  <FiSearch className="mr-3" />
                  Search Profiles
                </motion.button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Profiles Section */}
        <div className="mb-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Profiles Found <span className="text-red-500">({profiles.length})</span>
            </h2>
          </div>
          
          {profiles.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="bg-white rounded-2xl shadow-lg p-10 max-w-lg mx-auto">
                <div className="text-6xl mb-6">😢</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">No Profiles Found</h3>
                <p className="text-gray-600 mb-6">Try adjusting your filters to see more results</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowFilters(true)}
                  className="bg-red-500 text-white px-6 py-3 rounded-full hover:bg-red-600 transition font-medium"
                >
                  Adjust Filters
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              layout
            >
              {profiles.map((profile, index) => {
                const isLiked =
                  Array.isArray(profile.likes) &&
                  currentUserId &&
                  profile.likes.some(
                    (id) => id.toString() === currentUserId.toString()
                  );

                return (
                  <motion.div
                    key={profile._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -10 }}
                    className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
                  >
                    {/* Profile Image */}
                    <div className="relative">
                      <img
                        src={getProfileImageUrl(profile.profilePhoto, profile.gender, profile.name)}
                        alt={profile.name || 'Profile'}
                        className="w-full h-60 object-cover"
                        onError={(e) => {
                          e.target.src = getDefaultProfileImage(profile.gender, profile.name);
                        }}
                      />

                      {/* Match Percentage Badge */}
                      <div className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                        {Math.floor(Math.random() * 20) + 80}% Match
                      </div>

                      {/* Badges */}
                      <div className="absolute top-4 right-4 flex space-x-2">
                        {profile.isVerified && (
                          <span className="bg-blue-500 text-white p-2 rounded-full shadow-lg">
                            <FiCheck className="text-xs" />
                          </span>
                        )}
                        {profile.profileType === 'premium' && (
                          <span className="bg-yellow-500 text-white p-2 rounded-full shadow-lg">
                            <FaCrown className="text-xs" />
                          </span>
                        )}
                      </div>

                      {/* Like Button */}
                      <div className="absolute bottom-4 right-4">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleLike(profile._id)}
                          className="flex items-center justify-center p-3 rounded-full bg-white shadow-lg hover:bg-red-50 transition"
                        >
                          {isLiked ? (
                            <FaHeart className="text-red-500 text-xl" />
                          ) : (
                            <FiHeart className="text-gray-600 text-xl" />
                          )}
                        </motion.button>
                      </div>
                    </div>

                    {/* Profile Info */}
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-xl font-bold text-gray-800">{profile.name}</h3>
                          {profile.memberid && (
                            <p className="text-gray-600 text-sm">
                              <span className="font-medium">ID:</span> {profile.memberid}
                            </p>
                          )}
                        </div>
                        <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                          {profile.age} yrs
                        </span>
                      </div>
                      
                      <div className="flex items-center text-gray-600 mb-2">
                        <FiMapPin className="mr-2" /> 
                        <span>{profile.location}</span>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                          {profile.religion}
                        </span>
                        <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                          {profile.caste}
                        </span>
                        <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                          {profile.occupation}
                        </span>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col space-y-3">
                        {currentUserProfileType ? (
                          <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => navigate(`/profile/${profile._id}`)}
                            className="flex items-center justify-center bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-3 rounded-full hover:from-red-600 hover:to-orange-600 transition-all duration-300 shadow"
                          >
                            <FiEye className="mr-2" /> View Full Profile
                          </motion.button>
                        ) : (
                          <button 
                            onClick={() => alert("Upgrade to Premium to view full profiles!")}
                            className="flex items-center justify-center bg-gray-200 text-gray-500 px-4 py-3 rounded-full cursor-not-allowed"
                            disabled
                          >
                            <FaLock className="mr-2" /> Premium Required
                          </button>
                        )}
                        
                        {!currentUserProfileType && (
                          <button 
                            onClick={() => setShowUpgradeModal(true)}
                            className="text-center text-red-600 hover:text-red-800 font-medium"
                          >
                            Upgrade to Premium for Full Access
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </div>
      </div>

      <PremiumUpgradeModal 
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
      />
    </div>
  );
};

export default SearchPage;