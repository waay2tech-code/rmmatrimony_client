// src/pages/UserProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { userService } from '../services/userService';
import { FaUser, FaMapPin, FaHeart, FaBriefcase, FaUsers, FaArrowLeft, FaPhone, FaEnvelope, FaImages, FaCheck, FaCrown } from 'react-icons/fa';
import { getDefaultProfileImage, getProfileImageUrl } from '../utils/defaultImage';

const UserProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [isMutualLike, setIsMutualLike] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  
  // Debug state changes
  useEffect(() => {
    console.log('showImageModal state changed:', showImageModal);
    console.log('selectedImage state changed:', selectedImage);
  }, [showImageModal, selectedImage]);
  
  // Debug active tab changes
  useEffect(() => {
    console.log('activeTab changed:', activeTab);
  }, [activeTab]);

  // Fetch user profile and gallery by ID using services
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        
        // Fetch user profile using service
        const profileResponse = await userService.getUserById(id);
        setProfile(profileResponse.profile);
        setIsMutualLike(profileResponse.isMutualLike || false);

        // Fetch user gallery using service
        const galleryResponse = await userService.getUserGallery(id);
        console.log('Gallery response:', galleryResponse);
        setGallery(galleryResponse.gallery || []);
        setIsMutualLike(galleryResponse.isMutualLike || profileResponse.isMutualLike || false);
        
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Failed to load profile. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchUserData();
    }
  }, [id]);

  // Like profile function using service
  const handleLikeProfile = async () => {
    try {
      await userService.toggleLike(id);
      // Refresh the profile data after liking
      const profileResponse = await userService.getUserById(id);
      setProfile(profileResponse.profile);
      setIsMutualLike(profileResponse.isMutualLike || false);
      
      const galleryResponse = await userService.getUserGallery(id);
      setGallery(galleryResponse.gallery || []);
      
      alert('Like action completed!');
    } catch (error) {
      console.error('Error liking profile:', error);
      alert('Failed to like profile. Please try again.');
    }
  };

  // Send interest function using service
  const handleSendInterest = async () => {
    try {
      await userService.sendInterest(id);
      alert('Interest sent successfully!');
    } catch (error) {
      console.error('Error sending interest:', error);
      alert('Failed to send interest. Please try again.');
    }
  };

  // Helper function to build image URLs properly
  const buildImageSrc = (url) => {
    if (!url) return '/default-image.png';
    
    // If it's already an absolute URL, return as is
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    
    // Derive API origin from VITE_API_URL (e.g., https://api.example.com/api -> https://api.example.com)
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    let origin;
    try {
      origin = new URL(apiUrl).origin;
    } catch (e) {
      origin = 'http://localhost:5000';
    }
    
    // Handle URLs that start with /uploads/
    if (url.startsWith('/uploads/')) {
      return `${origin}${url}`;
    }
    
    // Handle URLs that start with uploads/ (without leading slash)
    if (url.startsWith('uploads/')) {
      return `${origin}/${url}`;
    }
    
    // Default fallback - assume it's a relative path that needs the base URL
    return `${origin}/${url}`;
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 py-8 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-red-500 mx-auto mb-4"></div>
          <p className="text-red-600 text-xl font-medium">Loading profile...</p>
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
          <h3 className="text-2xl font-bold text-red-600 mb-4">Error</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(-1)} 
            className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-3 rounded-full hover:from-red-600 hover:to-orange-600 transition font-medium"
          >
            Go Back
          </motion.button>
        </motion.div>
      </div>
    );
  }

  // No profile found
  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 py-8 px-4 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center"
        >
          <h3 className="text-2xl font-bold text-red-600 mb-4">Profile Not Found</h3>
          <p className="text-gray-600 mb-6">The profile you're looking for doesn't exist.</p>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(-1)} 
            className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-3 rounded-full hover:from-red-600 hover:to-orange-600 transition font-medium"
          >
            Go Back
          </motion.button>
        </motion.div>
      </div>
    );
  }

  const renderProfileTab = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-4 sm:p-6 md:p-8"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        {/* Personal Information */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg p-4 sm:p-6"
        >
          <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6 pb-2 border-b-2 border-red-100">
            Personal Information
          </h2>
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center p-2 sm:p-3 rounded-lg hover:bg-red-50 transition">
              <div className="bg-red-100 p-2 sm:p-3 rounded-full mr-3 sm:mr-4">
                <FaUser className="text-red-600 text-sm sm:text-base" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-500">Gender</p>
                <p className="font-medium text-sm sm:text-base">{profile.gender || 'Not specified'}</p>
              </div>
            </div>
            
            <div className="flex items-center p-2 sm:p-3 rounded-lg hover:bg-red-50 transition">
              <div className="bg-red-100 p-2 sm:p-3 rounded-full mr-3 sm:mr-4">
                <span className="text-red-600 text-sm sm:text-base">🎂</span>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-500">Date of Birth</p>
                <p className="font-medium text-sm sm:text-base">{profile.dob || 'Not specified'}</p>
              </div>
            </div>
            
            {/* <div className="flex items-center p-2 sm:p-3 rounded-lg hover:bg-red-50 transition">
              <div className="bg-red-100 p-2 sm:p-3 rounded-full mr-3 sm:mr-4">
                <FaPhone className="text-red-600 text-sm sm:text-base" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-500">Mobile</p>
                <p className="font-medium text-sm sm:text-base">
                  {isMutualLike ? profile.mobile : 'Hidden - Like this profile to view'}
                </p>
              </div>
            </div> */}

            {profile.memberid && (
              <div className="flex items-center p-2 sm:p-3 rounded-lg hover:bg-red-50 transition">
                <div className="bg-yellow-100 p-2 sm:p-3 rounded-full mr-3 sm:mr-4">
                  <span className="text-yellow-600 font-bold text-sm sm:text-base">#</span>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-500">Member ID</p>
                  <p className="font-medium text-green-600 text-sm sm:text-base">{profile.memberid}</p>
                </div>
              </div>
            )}

            <div className="flex items-center p-2 sm:p-3 rounded-lg hover:bg-red-50 transition">
              <div className="bg-red-100 p-2 sm:p-3 rounded-full mr-3 sm:mr-4">
                <span className="text-red-600 text-sm sm:text-base">🏛️</span>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-500">Religion</p>
                <p className="font-medium text-sm sm:text-base">{profile.religion || 'Not specified'}</p>
              </div>
            </div>

            <div className="flex items-center p-2 sm:p-3 rounded-lg hover:bg-red-50 transition">
              <div className="bg-red-100 p-2 sm:p-3 rounded-full mr-3 sm:mr-4">
                <span className="text-red-600 text-sm sm:text-base">👥</span>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-500">Caste</p>
                <p className="font-medium text-sm sm:text-base">{profile.caste || 'Not specified'}</p>
              </div>
            </div>

            <div className="flex items-center p-2 sm:p-3 rounded-lg hover:bg-red-50 transition">
              <div className="bg-red-100 p-2 sm:p-3 rounded-full mr-3 sm:mr-4">
                <span className="text-red-600 text-sm sm:text-base">📏</span>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-500">Height</p>
                <p className="font-medium text-sm sm:text-base">{profile.height || 'Not specified'}</p>
              </div>
            </div>

            {/* New Fields */}
            <div className="flex items-center p-2 sm:p-3 rounded-lg hover:bg-red-50 transition">
              <div className="bg-red-100 p-2 sm:p-3 rounded-full mr-3 sm:mr-4">
                <span className="text-red-600 text-sm sm:text-base">🎓</span>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-500">Qualification</p>
                <p className="font-medium text-sm sm:text-base">{profile.qualification || 'Not specified'}</p>
              </div>
            </div>

            <div className="flex items-center p-2 sm:p-3 rounded-lg hover:bg-red-50 transition">
              <div className="bg-red-100 p-2 sm:p-3 rounded-full mr-3 sm:mr-4">
                <FaMapPin className="text-red-600 text-sm sm:text-base" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-500">Address</p>
                <p className="font-medium text-sm sm:text-base">{profile.address || 'Not specified'}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Professional & Family Information */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg p-4 sm:p-6"
        >
          <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6 pb-2 border-b-2 border-red-100">
            Professional & Family
          </h2>
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center p-2 sm:p-3 rounded-lg hover:bg-red-50 transition">
              <div className="bg-red-100 p-2 sm:p-3 rounded-full mr-3 sm:mr-4">
                <FaBriefcase className="text-red-600 text-sm sm:text-base" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-500">Occupation</p>
                <p className="font-medium text-sm sm:text-base">{profile.occupation || 'Not specified'}</p>
              </div>
            </div>

            <div className="flex items-center p-2 sm:p-3 rounded-lg hover:bg-red-50 transition">
              <div className="bg-red-100 p-2 sm:p-3 rounded-full mr-3 sm:mr-4">
                <span className="text-red-600 text-sm sm:text-base">💰</span>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-500">Monthly Income</p>
                <p className="font-medium text-sm sm:text-base">{profile.monthlyIncome || 'Not specified'}</p>
              </div>
            </div>

            <div className="flex items-center p-2 sm:p-3 rounded-lg hover:bg-red-50 transition">
              <div className="bg-red-100 p-2 sm:p-3 rounded-full mr-3 sm:mr-4">
                <span className="text-red-600 text-sm sm:text-base">👨</span>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-500">Father's Name</p>
                <p className="font-medium text-sm sm:text-base">{profile.fatherName || 'Not specified'}</p>
              </div>
            </div>

            <div className="flex items-center p-2 sm:p-3 rounded-lg hover:bg-red-50 transition">
              <div className="bg-red-100 p-2 sm:p-3 rounded-full mr-3 sm:mr-4">
                <span className="text-red-600 text-sm sm:text-base">👨</span>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-500">Father's Native</p>
                <p className="font-medium text-sm sm:text-base">{profile.fatherNative || 'Not specified'}</p>
              </div>
            </div>

            <div className="flex items-center p-2 sm:p-3 rounded-lg hover:bg-red-50 transition">
              <div className="bg-red-100 p-2 sm:p-3 rounded-full mr-3 sm:mr-4">
                <span className="text-red-600 text-sm sm:text-base">👩</span>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-500">Mother's Name</p>
                <p className="font-medium text-sm sm:text-base">{profile.motherName || 'Not specified'}</p>
              </div>
            </div>

            <div className="flex items-center p-2 sm:p-3 rounded-lg hover:bg-red-50 transition">
              <div className="bg-red-100 p-2 sm:p-3 rounded-full mr-3 sm:mr-4">
                <span className="text-red-600 text-sm sm:text-base">👩</span>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-500">Mother's Native</p>
                <p className="font-medium text-sm sm:text-base">{profile.motherNative || 'Not specified'}</p>
              </div>
            </div>

            <div className="flex items-center p-2 sm:p-3 rounded-lg hover:bg-red-50 transition">
              <div className="bg-red-100 p-2 sm:p-3 rounded-full mr-3 sm:mr-4">
                <FaUsers className="text-red-600 text-sm sm:text-base" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-500">No. of Siblings</p>
                <p className="font-medium text-sm sm:text-base">{profile.siblings || 'Not specified'}</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* About Section */}
      {profile.about && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 sm:mt-8 bg-white rounded-2xl shadow-lg p-4 sm:p-6"
        >
          <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6 pb-2 border-b-2 border-red-100">
            About
          </h2>
          <p className="text-gray-700 leading-relaxed text-sm sm:text-base">{profile.about}</p>
        </motion.div>
      )}

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center"
      >
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLikeProfile}
          className="flex items-center justify-center bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full hover:from-red-600 hover:to-orange-600 transition shadow-lg text-sm sm:text-base"
        >
          <FaHeart className="mr-2" />
          Like Profile
        </motion.button>
        
        {/* <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSendInterest}
          className="flex items-center justify-center bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full hover:from-purple-600 hover:to-indigo-600 transition shadow-lg text-sm sm:text-base"
        >
          Send Interest
        </motion.button> */}
      </motion.div>
    </motion.div>
  );

  const renderGalleryTab = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-4 sm:p-6 md:p-8 gallery-container"
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }}
    >
      {console.log('Gallery tab rendered')}
      <h2 className="text-xl font-bold text-gray-800 mb-4 sm:mb-6">Photo Gallery</h2>
      {console.log('Rendering gallery with data:', gallery)}
      {console.log('isMutualLike status:', isMutualLike)}
      
      {!isMutualLike ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12 sm:py-16"
        >
          <FaImages className="mx-auto text-gray-300 text-5xl sm:text-7xl mb-4 sm:mb-6" />
          <p className="text-gray-500 text-lg sm:text-xl">Gallery is hidden - If both of you like each other you can view the gallery.</p>
        </motion.div>
      ) : gallery.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12 sm:py-16"
        >
          <FaImages className="mx-auto text-gray-300 text-5xl sm:text-7xl mb-4 sm:mb-6" />
          <p className="text-gray-500 text-lg sm:text-xl">No photos available</p>
        </motion.div>
      ) : (
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
          layout
          onContextMenu={(e) => {
            e.preventDefault();
            e.stopPropagation();
            return false;
          }}
        >
          {gallery.map((photo, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="relative group overflow-hidden rounded-2xl shadow-lg"
            >
              {/* Fixed image URL construction */}
              <img
                src={buildImageSrc(photo.url)}
                alt={`Gallery ${index + 1}`}
                className="w-full h-48 sm:h-64 object-cover transition-transform duration-500 group-hover:scale-110 pointer-events-none select-none no-select no-drag"
                onError={(e) => {
                  e.target.src = '/default-image.png';
                }}
                onContextMenu={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  return false;
                }}
                draggable="false"
                onClick={(e) => {
                  // Prevent direct image interaction - users must use the View Photo button
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onDragStart={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  return false;
                }}
                onSelect={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  return false;
                }}
                onKeyDown={(e) => {
                  // Prevent keyboard shortcuts for saving images
                  if (e.key === 'PrintScreen' || e.key === 'ScrollLock') {
                    e.preventDefault();
                    e.stopPropagation();
                  }
                }}
                tabIndex="-1"
              />
              
              {/* View Photo Button */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4 z-20">
                <button 
                  onClick={() => {
                    console.log('View Photo button clicked');
                    console.log('Photo URL:', photo.url);
                    console.log('Built image URL:', buildImageSrc(photo.url));
                    setSelectedImage(buildImageSrc(photo.url));
                    setShowImageModal(true);
                  }}
                  className="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white py-2 rounded-lg font-medium hover:from-red-600 hover:to-orange-600 transition"
                >
                  {console.log('Rendering View Photo button for photo:', photo.url)}
                  View Photo
                </button>
              </div>
              
              {/* Profile photo indicator */}
              {photo.isProfile && (
                <div className="absolute top-3 sm:top-4 left-3 sm:left-4 bg-gradient-to-r from-red-500 to-orange-500 text-white px-2 sm:px-3 py-1 rounded-full text-xs font-bold shadow-lg z-20">
                  Profile Photo
                </div>
              )}
              
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-70 transition-all duration-300 z-10"></div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 py-6 px-4">
      <style>
        {`
          .no-select {
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
            -webkit-touch-callout: none;
            -webkit-tap-highlight-color: transparent;
          }
          .no-drag {
            -webkit-user-drag: none;
            -khtml-user-drag: none;
            -moz-user-drag: none;
            -o-user-drag: none;
            user-drag: none;
          }
          /* Gallery-specific protections */
          .gallery-container {
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
            pointer-events: auto;
          }
          .gallery-container img {
            -webkit-user-drag: none;
            -khtml-user-drag: none;
            -moz-user-drag: none;
            -o-user-drag: none;
            user-drag: none;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
            pointer-events: none;
            touch-action: none;
          }
          /* Modal image protections */
          .modal-image-container {
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
            touch-action: none;
          }
          .modal-image-container img {
            -webkit-user-drag: none;
            -khtml-user-drag: none;
            -moz-user-drag: none;
            -o-user-drag: none;
            user-drag: none;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
            pointer-events: auto;
            touch-action: none;
            -webkit-touch-callout: none;
          }
        `}
      </style>
      <div className="max-w-6xl mx-auto">
        {/* Header with Back Button */}
        <div className="mb-4 sm:mb-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(-1)}
            className="flex items-center text-red-600 hover:text-red-700 mb-4"
          >
            <FaArrowLeft className="mr-2" />
            Back to Search
          </motion.button>
        </div>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl sm:rounded-3xl shadow-xl overflow-hidden"
        >
          {/* Profile Header */}
          <div className="relative bg-gradient-to-r from-red-500 to-orange-500 text-white p-6 sm:p-8">
            <div className="flex flex-col md:flex-row items-center">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="mb-6 md:mb-0 md:mr-6 lg:mr-8"
              >
                <div className="relative">
                  <img
                    src={getProfileImageUrl(profile.profilePhoto, profile.gender, profile.name)}
                    alt={profile.name || 'Profile'}
                    className="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover border-4 border-white shadow-2xl no-select no-drag"
                    onError={(e) => {
                      e.target.src = getDefaultProfileImage(profile.gender, profile.name);
                    }}
                    onContextMenu={(e) => e.preventDefault()}
                    draggable="false"
                  />
                  {/* Verification badge */}
                  {profile.isVerified && (
                    <div className="absolute bottom-2 right-2 bg-blue-500 text-white p-2 rounded-full shadow-lg">
                      <FaCheck className="text-xs" />
                    </div>
                  )}
                  {/* Premium badge */}
                  {profile.profileType === 'premium' && (
                    <div className="absolute top-2 right-2 bg-yellow-500 text-white p-2 rounded-full shadow-lg">
                      <FaCrown className="text-xs" />
                    </div>
                  )}
                </div>
                {profile.memberid && (
                  <div className="text-center mt-4 bg-white bg-opacity-20 rounded-full py-2 px-4">
                    <span className="font-medium">Member ID:</span> 
                    <span className="ml-2 text-yellow-300 font-bold">{profile.memberid}</span>
                  </div>
                )}
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="text-center md:text-left"
              >
                <h1 className="text-3xl sm:text-4xl font-bold mb-2 sm:mb-3">{profile.name}</h1>
                <div className="flex flex-wrap justify-center md:justify-start gap-2 sm:gap-3 text-base sm:text-lg mb-3 sm:mb-4">
                  <span className="bg-white bg-opacity-20 py-1 px-3 sm:px-4 rounded-full">{profile.age} years old</span>
                  <span className="bg-white bg-opacity-20 py-1 px-3 sm:px-4 rounded-full flex items-center">
                    <FaMapPin className="mr-1 sm:mr-2" />
                    {profile.location}
                  </span>
                </div>
                <p className="text-lg sm:text-xl mb-3 sm:mb-4">{profile.occupation}</p>
                <div className="flex flex-wrap justify-center md:justify-start gap-2">
                  <span className="bg-white text-red-600 py-1 px-3 rounded-full text-sm font-medium">
                    {profile.religion}
                  </span>
                  <span className="bg-white text-red-600 py-1 px-3 rounded-full text-sm font-medium">
                    {profile.caste}
                  </span>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex justify-center border-b bg-gray-50">
            <motion.button
              whileHover={{ y: -2 }}
              onClick={() => setActiveTab('profile')}
              className={`px-4 py-3 sm:px-6 sm:py-4 md:px-8 md:py-5 font-semibold transition-all text-sm sm:text-base relative ${
                activeTab === 'profile'
                  ? 'text-red-600'
                  : 'text-gray-600 hover:text-red-600'
              }`}
            >
              Profile Details
              {activeTab === 'profile' && (
                <motion.div
                  layoutId="tabIndicator"
                  className="absolute bottom-0 left-0 right-0 h-1 bg-red-500"
                />
              )}
            </motion.button>
            <motion.button
              whileHover={{ y: -2 }}
              onClick={() => {
                console.log('Gallery tab clicked');
                setActiveTab('gallery');
              }}
              className={`px-4 py-3 sm:px-6 sm:py-4 md:px-8 md:py-5 font-semibold transition-all text-sm sm:text-base relative ${
                activeTab === 'gallery'
                  ? 'text-red-600'
                  : 'text-gray-600 hover:text-red-600'
              }`}
            >
              Gallery ({isMutualLike ? gallery.length : 'Hidden'})
              {activeTab === 'gallery' && (
                <motion.div
                  layoutId="tabIndicator"
                  className="absolute bottom-0 left-0 right-0 h-1 bg-red-500"
                />
              )}
            </motion.button>
          </div>

          {/* Tab Content */}
          {activeTab === 'profile' ? renderProfileTab() : renderGalleryTab()}
        </motion.div>
        
        {/* Image Modal */}
        {showImageModal && selectedImage && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4 modal-image-container"
            onClick={() => {
              console.log('Modal background clicked');
              setShowImageModal(false);
            }}
            onContextMenu={(e) => {
              e.preventDefault();
              e.stopPropagation();
              return false;
            }}
          >
            {console.log('Rendering modal with image:', selectedImage)}
            <div 
              className="relative max-w-4xl max-h-full modal-image-container"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                className="absolute top-4 right-4 text-white text-3xl bg-black bg-opacity-50 rounded-full w-10 h-10 flex items-center justify-center hover:bg-opacity-75 transition"
                onClick={() => setShowImageModal(false)}
              >
                ×
              </button>
              <img 
                src={selectedImage}
                alt="Full size view"
                className="max-w-full max-h-[90vh] object-contain select-none no-select no-drag"
                onContextMenu={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  return false;
                }}
                draggable="false"
                onDoubleClick={(e) => {
                  // Prevent zooming through double-click
                  e.preventDefault();
                  e.stopPropagation();
                  return false;
                }}
                onMouseDown={(e) => {
                  // Prevent zooming through mouse wheel + Ctrl
                  if (e.ctrlKey) {
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                  }
                }}
                onWheel={(e) => {
                  // Prevent zooming through pinch gestures or Ctrl+mouse wheel
                  if (e.ctrlKey || e.nativeEvent.deltaMode === 0) {
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                  }
                }}
                onTouchStart={(e) => {
                  // Prevent touch-based zooming
                  e.preventDefault();
                  e.stopPropagation();
                  return false;
                }}
                onTouchMove={(e) => {
                  // Prevent touch-based zooming
                  e.preventDefault();
                  e.stopPropagation();
                  return false;
                }}
                onSelect={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  return false;
                }}
                onDragStart={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  return false;
                }}
                onKeyDown={(e) => {
                  // Prevent keyboard shortcuts for saving images
                  if (e.key === 'PrintScreen' || e.key === 'ScrollLock') {
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                  }
                }}
                tabIndex="-1"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfilePage;