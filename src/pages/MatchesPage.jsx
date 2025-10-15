import React, { useState, useContext, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaHandshake, FaCrown, FaCheck, FaEye, FaLock, FaHeart, FaArrowRight } from 'react-icons/fa';
import { FiHeart, FiMapPin, FiUsers } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { userService } from '../services/userService';
import PremiumUpgradeModal from '../components/PremiumUpgradeModal';
import { getProfileImageUrl, getDefaultProfileImage } from '../utils/defaultImage';

const MatchesPage = () => {
  const { user } = useContext(AuthContext); // Removed token since we're using cookies
  const navigate = useNavigate();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUserProfileType, setCurrentUserProfileType] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    if (!user) {
      alert("Please login to view your matches.");
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch current user profile to get ID
        const userProfile = await userService.getProfile();
        const userId = userProfile.profile?._id || userProfile.id || userProfile._id;
        setCurrentUserId(userId);

        // Fetch matches using service
        const matchesData = await userService.getMatches();
        const matches = Array.isArray(matchesData?.recommendations) ? matchesData.recommendations : [];
        setMatches(matches);
        
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError(err.message || "Failed to load data");
        setMatches([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, navigate]);

  // Fetch user profile type
  useEffect(() => {
    const fetchUserProfileType = async () => {
      try {
        const profileTypeData = await userService.getProfileType();
        console.log("Profile type response:", profileTypeData);
        
        // Check for both 'premium' and 'Premium' (case-insensitive)
        const isPremium = profileTypeData.profileType?.toLowerCase() === 'premium';
        setCurrentUserProfileType(isPremium);
        console.log("Is Premium User:", isPremium);
        
      } catch (error) {
        console.error("Failed to fetch profile type:", error);
        setCurrentUserProfileType(false); // Default to false on error
      }
    };

    if (user) {
      fetchUserProfileType();
    }
  }, [user]);

  // Like/unlike profile toggle using service
  const handleLike = async (profileId) => {
    try {
      const result = await userService.toggleLike(profileId);

      // Update the likes array of the liked profile locally using backend response
      setMatches((prevMatches) =>
        prevMatches.map((match) =>
          match._id === profileId
            ? { ...match, likes: result.likes }
            : match
        )
      );
    } catch (error) {
      console.error("Error toggling like:", error);
      alert("Error toggling like");
    }
  };

  console.log("matches:", matches);
  console.log("currentUserProfileType:", currentUserProfileType);
    
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  if (!user) return null;

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 py-8 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-red-500 mx-auto mb-4"></div>
          <p className="text-red-600 text-xl font-medium">Loading your matches...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 py-8 px-4 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center"
        >
          <h3 className="text-2xl font-bold text-red-600 mb-4">Error loading matches</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.reload()} 
            className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-3 rounded-full hover:from-red-600 hover:to-orange-600 transition font-medium"
          >
            Try Again
          </motion.button>
        </motion.div>
      </div>
    );
  }

  // No matches state
  if (matches.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl font-bold text-gray-800 mb-4">No Matches Found</h1>
            <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
              We couldn't find any matches for you at this time. Try expanding your search criteria or check back later.
            </p>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/search')}
              className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-8 py-4 rounded-full font-semibold hover:from-red-600 hover:to-orange-600 transition shadow-lg flex items-center mx-auto"
            >
              Browse Profiles
              <FaArrowRight className="ml-2" />
            </motion.button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-3">Your Matches</h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Discover your perfect life partner with our carefully curated matches
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
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowUpgradeModal(true)}
                className="bg-white text-red-600 px-6 py-3 rounded-full font-semibold hover:bg-red-50 transition-all duration-300 shadow-lg"
              >
                Upgrade Now
              </motion.button>
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

        <div className="mb-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Recommendations <span className="text-red-500">({matches.length})</span>
            </h2>
          </div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            layout
          >
            {matches.map((match, index) => {
              // Check if current user has liked this match
              const isLiked =
                Array.isArray(match.likes) &&
                currentUserId &&
                match.likes.some(
                  (id) => id.toString() === currentUserId.toString()
                );

              return (
                <motion.div
                  key={match._id || match.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
                >
                  <div className="relative">
                    <img
                      src={getProfileImageUrl(match.profilePhoto, match.gender, match.name)}
                      alt={match.name || 'Profile'}
                      className="w-full h-60 object-cover"
                      onError={(e) => {
                        e.target.src = getDefaultProfileImage(match.gender, match.name);
                      }}
                    />

                    {/* Match Percentage Badge */}
                    <div className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                      {match.matchPercentage || Math.floor(Math.random() * 20) + 80}% Match
                    </div>

                    {/* Badges */}
                    <div className="absolute top-4 right-4 flex space-x-2">
                      {match.isVerified && (
                        <span className="bg-blue-500 text-white p-2 rounded-full shadow-lg">
                          <FaCheck className="text-xs" />
                        </span>
                      )}
                      {match.isPremium && (
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
                        onClick={() => handleLike(match._id || match.id)}
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

                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">{match.name || 'Anonymous'}</h3>
                        {match.memberid && (
                          <p className="text-gray-600 text-sm">
                            <span className="font-medium">ID:</span> {match.memberid}
                          </p>
                        )}
                      </div>
                      <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                        {match.age || 'N/A'} yrs
                      </span>
                    </div>
                    
                    <div className="flex items-center text-gray-600 mb-3">
                      <FiMapPin className="mr-2" /> 
                      <span>{match.location || 'Location not specified'}</span>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                        {match.religion || 'Not specified'}
                      </span>
                      <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                        {match.caste || 'Not specified'}
                      </span>
                    </div>

                    {/* Show qualification and occupation info only for mutual likes */}
                    {match.isMutualLike && (
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="bg-red-50 p-3 rounded-lg">
                          <p className="text-xs text-gray-500">Qualification</p>
                          <p className="text-gray-700 font-medium">{match.qualification || 'Not specified'}</p>
                        </div>
                        <div className="bg-red-50 p-3 rounded-lg">
                          <p className="text-xs text-gray-500">Occupation</p>
                          <p className="text-gray-700 font-medium">{match.occupation || 'Not specified'}</p>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-col space-y-3">
                      {currentUserProfileType ? (
                        <motion.button
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => navigate(`/profile/${match._id || match.id}`)}
                          className="flex items-center justify-center bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-3 rounded-full hover:from-red-600 hover:to-orange-600 transition-all duration-300 shadow"
                        >
                          <FaEye className="mr-2" /> View Full Profile
                        </motion.button>
                      ) : (
                        <button 
                          onClick={() => {
                            alert("Upgrade to Premium to view full profiles!");
                          }}
                          className="flex items-center justify-center bg-gray-200 text-gray-500 px-4 py-3 rounded-full cursor-not-allowed"
                          disabled
                        >
                          <FaLock className="mr-2" /> Premium Required
                        </button>
                      )}
                      
                      {/* Show mutual like indicator only if it's a mutual like */}
                      {match.isMutualLike && (
                        <div className="flex items-center justify-center text-green-600 bg-green-50 py-2 rounded-full">
                          <FaHandshake className="mr-2" />
                          <span className="font-medium">Mutual Like</span>
                        </div>
                      )}
                      
                      {/* Show upgrade prompt for non-premium users when no mutual like */}
                      {!currentUserProfileType && !match.isMutualLike && (
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
        </div>
      </div>
      
      <PremiumUpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
      />
    </div>
  );
};

export default MatchesPage;