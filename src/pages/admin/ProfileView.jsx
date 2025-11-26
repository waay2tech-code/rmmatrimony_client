import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaHeart, FaSearch, FaCalendarAlt, FaCrown, FaTimes, FaTrash } from 'react-icons/fa';
import { notificationService } from '../../services/notificationService';
import {FaArrowLeft } from "react-icons/fa";
// We'll create a simplified version of the UserProfilePage component for use in a modal
import { FaMapPin, FaBriefcase, FaUsers, FaPhone, FaEnvelope, FaImages, FaCheck } from 'react-icons/fa';
import { getDefaultProfileImage, getProfileImageUrl } from '../../utils/defaultImage';

// Simplified ProfileCard component based on UserProfilePage with improved responsive design
const ProfileCard = ({ profile, onClose }) => {
  const [activeTab, setActiveTab] = useState('profile');

  if (!profile) return null;

  const renderProfileTab = () => (
    <div className="p-4 md:p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {/* Personal Information */}
        <div className="bg-white rounded-xl md:rounded-2xl shadow-lg p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-4 md:mb-6 pb-2 border-b-2 border-red-100">
            Personal Information
          </h2>
          <div className="space-y-3 md:space-y-4">
            <div className="flex items-center p-2 md:p-3 rounded-lg hover:bg-red-50 transition">
              <div className="bg-red-100 p-2 md:p-3 rounded-full mr-3 md:mr-4">
                <FaUser className="text-red-600 text-sm md:text-base" />
              </div>
              <div>
                <p className="text-xs md:text-sm text-gray-500">Gender</p>
                <p className="font-medium text-sm md:text-base">{profile.gender || 'Not specified'}</p>
              </div>
            </div>
            
            <div className="flex items-center p-2 md:p-3 rounded-lg hover:bg-red-50 transition">
              <div className="bg-red-100 p-2 md:p-3 rounded-full mr-3 md:mr-4">
                <FaEnvelope className="text-red-600 text-sm md:text-base" />
              </div>
              <div>
                <p className="text-xs md:text-sm text-gray-500">Email</p>
                <p className="font-medium text-sm md:text-base">{profile.email || 'Not specified'}</p>
              </div>
            </div>

            <div className="flex items-center p-2 md:p-3 rounded-lg hover:bg-red-50 transition">
              <div className="bg-red-100 p-2 md:p-3 rounded-full mr-3 md:mr-4">
                <FaPhone className="text-red-600 text-sm md:text-base" />
              </div>
              <div>
                <p className="text-xs md:text-sm text-gray-500">Mobile</p>
                <p className="font-medium text-sm md:text-base">{profile.mobile || 'Not specified'}</p>
              </div>
            </div>

            {profile.memberid && (
              <div className="flex items-center p-2 md:p-3 rounded-lg hover:bg-red-50 transition">
                <div className="bg-yellow-100 p-2 md:p-3 rounded-full mr-3 md:mr-4">
                  <span className="text-yellow-600 font-bold text-sm md:text-base">#</span>
                </div>
                <div>
                  <p className="text-xs md:text-sm text-gray-500">Member ID</p>
                  <p className="font-medium text-green-600 text-sm md:text-base">{profile.memberid}</p>
                </div>
              </div>
            )}

            <div className="flex items-center p-2 md:p-3 rounded-lg hover:bg-red-50 transition">
              <div className="bg-red-100 p-2 md:p-3 rounded-full mr-3 md:mr-4">
                <span className="text-red-600 text-sm md:text-base">🏛️</span>
              </div>
              <div>
                <p className="text-xs md:text-sm text-gray-500">Religion</p>
                <p className="font-medium text-sm md:text-base">{profile.religion || 'Not specified'}</p>
              </div>
            </div>

            <div className="flex items-center p-2 md:p-3 rounded-lg hover:bg-red-50 transition">
              <div className="bg-red-100 p-2 md:p-3 rounded-full mr-3 md:mr-4">
                <span className="text-red-600 text-sm md:text-base">👥</span>
              </div>
              <div>
                <p className="text-xs md:text-sm text-gray-500">Caste</p>
                <p className="font-medium text-sm md:text-base">{profile.caste || 'Not specified'}</p>
              </div>
            </div>

            <div className="flex items-center p-2 md:p-3 rounded-lg hover:bg-red-50 transition">
              <div className="bg-red-100 p-2 md:p-3 rounded-full mr-3 md:mr-4">
                <span className="text-red-600 text-sm md:text-base">📏</span>
              </div>
              <div>
                <p className="text-xs md:text-sm text-gray-500">Height</p>
                <p className="font-medium text-sm md:text-base">{profile.height || 'Not specified'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Professional & Family Information */}
        <div className="bg-white rounded-xl md:rounded-2xl shadow-lg p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-4 md:mb-6 pb-2 border-b-2 border-red-100">
            Professional & Family
          </h2>
          <div className="space-y-3 md:space-y-4">
            <div className="flex items-center p-2 md:p-3 rounded-lg hover:bg-red-50 transition">
              <div className="bg-red-100 p-2 md:p-3 rounded-full mr-3 md:mr-4">
                <FaBriefcase className="text-red-600 text-sm md:text-base" />
              </div>
              <div>
                <p className="text-xs md:text-sm text-gray-500">Occupation</p>
                <p className="font-medium text-sm md:text-base">{profile.occupation || 'Not specified'}</p>
              </div>
            </div>

            <div className="flex items-center p-2 md:p-3 rounded-lg hover:bg-red-50 transition">
              <div className="bg-red-100 p-2 md:p-3 rounded-full mr-3 md:mr-4">
                <span className="text-red-600 text-sm md:text-base">💰</span>
              </div>
              <div>
                <p className="text-xs md:text-sm text-gray-500">Monthly Income</p>
                <p className="font-medium text-sm md:text-base">{profile.monthlyIncome || 'Not specified'}</p>
              </div>
            </div>

            <div className="flex items-center p-2 md:p-3 rounded-lg hover:bg-red-50 transition">
              <div className="bg-red-100 p-2 md:p-3 rounded-full mr-3 md:mr-4">
                <span className="text-red-600 text-sm md:text-base">👨</span>
              </div>
              <div>
                <p className="text-xs md:text-sm text-gray-500">Father's Name</p>
                <p className="font-medium text-sm md:text-base">{profile.fatherName || 'Not specified'}</p>
              </div>
            </div>

            <div className="flex items-center p-2 md:p-3 rounded-lg hover:bg-red-50 transition">
              <div className="bg-red-100 p-2 md:p-3 rounded-full mr-3 md:mr-4">
                <span className="text-red-600 text-sm md:text-base">👩</span>
              </div>
              <div>
                <p className="text-xs md:text-sm text-gray-500">Mother's Name</p>
                <p className="font-medium text-sm md:text-base">{profile.motherName || 'Not specified'}</p>
              </div>
            </div>

            <div className="flex items-center p-2 md:p-3 rounded-lg hover:bg-red-50 transition">
              <div className="bg-red-100 p-2 md:p-3 rounded-full mr-3 md:mr-4">
                <FaUsers className="text-red-600 text-sm md:text-base" />
              </div>
              <div>
                <p className="text-xs md:text-sm text-gray-500">No. of Siblings</p>
                <p className="font-medium text-sm md:text-base">{profile.siblings || 'Not specified'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* About Section */}
      {profile.about && (
        <div className="mt-4 md:mt-6 bg-white rounded-xl md:rounded-2xl shadow-lg p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-4 md:mb-6 pb-2 border-b-2 border-red-100">
            About
          </h2>
          <p className="text-gray-700 text-sm md:text-base leading-relaxed">{profile.about}</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 md:p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-y-auto">
        {/* Header with close button */}
        <div className="sticky top-0 bg-white z-10 border-b border-gray-200 rounded-t-2xl">
          <div className="flex items-center justify-between p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-bold text-gray-800">Profile Details</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors p-1"
              aria-label="Close"
            >
              <FaTimes size={18} className="md:size-20" />
            </button>
          </div>
          
          {/* Profile Header - Responsive design */}
          <div className="relative bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-6 md:px-6 md:py-8">
            <div className="flex flex-col md:flex-row items-center">
              <div className="mb-6 md:mb-0 md:mr-6">
                <div className="relative">
                  <img
                    src={getProfileImageUrl(profile.profilePhoto, profile.gender, profile.name)}
                    alt={profile.name || 'Profile'}
                    className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-white shadow-2xl"
                    onError={(e) => {
                      e.target.src = getDefaultProfileImage(profile.gender, profile.name);
                    }}
                  />
                  {/* Verification badge */}
                  {profile.isVerified && (
                    <div className="absolute -bottom-1 -right-1 md:bottom-2 md:right-2 bg-blue-500 text-white p-1 md:p-2 rounded-full shadow-lg">
                      <FaCheck className="text-xs md:text-sm" />
                    </div>
                  )}
                  {/* Premium badge */}
                  {profile.profileType === 'premium' && (
                    <div className="absolute -top-1 -right-1 md:top-2 md:right-2 bg-yellow-500 text-white p-1 md:p-2 rounded-full shadow-lg">
                      <FaCrown className="text-xs md:text-sm" />
                    </div>
                  )}
                </div>
                {profile.memberid && (
                  <div className="text-center mt-3 bg-white bg-opacity-20 rounded-full py-1 px-3 md:py-2 md:px-4">
                    <span className="font-medium text-xs md:text-sm">Member ID:</span> 
                    <span className="ml-1 md:ml-2 text-yellow-300 font-bold text-xs md:text-sm">{profile.memberid}</span>
                  </div>
                )}
              </div>
              
              <div className="text-center md:text-left">
                <h1 className="text-2xl md:text-3xl font-bold mb-2 md:mb-3">{profile.name}</h1>
                <div className="flex flex-wrap justify-center md:justify-start gap-2 md:gap-3 text-sm md:text-lg mb-3 md:mb-4">
                  <span className="bg-white bg-opacity-20 py-1 px-3 rounded-full text-xs md:text-sm">{profile.age} years old</span>
                  <span className="bg-white bg-opacity-20 py-1 px-3 rounded-full flex items-center text-xs md:text-sm">
                    <FaMapPin className="mr-1 text-xs md:mr-2 md:text-base" />
                    {profile.location}
                  </span>
                </div>
                <p className="text-base md:text-xl mb-3 md:mb-4">{profile.occupation}</p>
                <div className="flex flex-wrap justify-center md:justify-start gap-1 md:gap-2">
                  <span className="bg-white text-red-600 py-1 px-2 md:py-1 md:px-3 rounded-full text-xs md:text-sm font-medium">
                    {profile.religion}
                  </span>
                  <span className="bg-white text-red-600 py-1 px-2 md:py-1 md:px-3 rounded-full text-xs md:text-sm font-medium">
                    {profile.caste}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Tab Navigation - Simplified for mobile */}
          <div className="flex justify-center border-b bg-gray-50">
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-4 py-3 md:px-8 md:py-5 font-semibold transition-all relative text-sm md:text-base ${
                activeTab === 'profile'
                  ? 'text-red-600'
                  : 'text-gray-600 hover:text-red-600'
              }`}
            >
              Profile Details
              {activeTab === 'profile' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 md:h-1 bg-red-500" />
              )}
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="max-h-[60vh] md:max-h-[50vh] overflow-y-auto">
          {activeTab === 'profile' && renderProfileTab()}
        </div>
        
        {/* Close Button at Bottom - Visible on mobile */}
        <div className="p-4 bg-gray-50 md:hidden">
          <div className="flex justify-center">
            <button
              onClick={onClose}
              className="w-full bg-red-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-red-600 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const NotificationsListWithProfileTypeFilter = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchName, setSearchName] = useState('');
  const [searchMemberId, setSearchMemberId] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [selectedProfile, setSelectedProfile] = useState(null);
  
  // New states for profileType filters
  const [senderProfileType, setSenderProfileType] = useState('all'); // Default to all
  const [receiverProfileType, setReceiverProfileType] = useState('all'); // Default to all

  const navigate = useNavigate();

  // Function to remove a like
  const handleRemoveLike = async (senderId, receiverId, notificationId) => {
    if (!window.confirm('Are you sure you want to remove this like? This will delete the like relationship and the notification.')) {
      return;
    }
    
    try {
      const response = await notificationService.removeLike(senderId, receiverId);
      if (response.success) {
        // Remove the notification from the list
        setNotifications(prev => prev.filter(notif => notif._id !== notificationId));
        alert('Like removed successfully');
      } else {
        alert(response.message || 'Failed to remove like');
      }
    } catch (error) {
      console.error('Error removing like:', error);
      alert('Failed to remove like. Please try again.');
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = await notificationService.getAllNotificationsAdmin();
      setNotifications(data.notifications);
      setError(null);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setError('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleViewProfile = (user) => {
    // Instead of navigating, we'll show the profile in a modal
    // Only show profile if user object exists
    if (user) {
      setSelectedProfile(user);
    }
  };

  const clearFilters = () => {
    setSearchName('');
    setSearchMemberId('');
    setSearchDate('');
    setSenderProfileType('all'); // Reset to default
    setReceiverProfileType('all'); // Reset to default
  };

  // Enhanced filtering with profile type selections
  const filteredNotifications = notifications.filter((notification) => {
    const nameMatch =
      searchName === '' ||
      (notification.sender?.name && notification.sender.name.toLowerCase().includes(searchName.toLowerCase())) ||
      (notification.receiver?.name && notification.receiver.name.toLowerCase().includes(searchName.toLowerCase()));

    const memberIdMatch =
      searchMemberId === '' ||
      (notification.sender?.memberid && notification.sender.memberid.toLowerCase().includes(searchMemberId.toLowerCase())) ||
      (notification.receiver?.memberid && notification.receiver.memberid.toLowerCase().includes(searchMemberId.toLowerCase()));

    let dateMatch = true;
    if (searchDate) {
      const notifDate = new Date(notification.createdAt).toISOString().slice(0, 10);
      dateMatch = notifDate === searchDate;
    }

    // Profile type filtering
    const senderTypeMatch = senderProfileType === 'all' ||
      (notification.sender?.profileType?.toLowerCase() || 'free') === senderProfileType;

    const receiverTypeMatch = receiverProfileType === 'all' ||
      (notification.receiver?.profileType?.toLowerCase() || 'free') === receiverProfileType;

    return nameMatch && memberIdMatch && dateMatch && senderTypeMatch && receiverTypeMatch;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading notifications...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-64">
        <div className="text-red-500 text-lg mb-4">{error}</div>
        <button
          onClick={fetchNotifications}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-2 md:p-6">
       <div className="mb-4 md:mb-6">
                    <button
                      onClick={() => navigate(-1)}
                      className="flex items-center text-red-600 hover:text-red-700 mb-4"
                    >
                      <FaArrowLeft className="mr-2" />
                      Back
                    </button>
                  </div>
          
      <div className="mb-4 md:mb-6">
        <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2">
          <FaHeart className="text-red-500" />
          Profile Interactions ({filteredNotifications.length} of {notifications.length})
        </h2>
      </div>

      {/* Enhanced Filters Section */}
      <div className="mb-4 md:mb-6 bg-gray-50 p-3 md:p-4 rounded-lg">
        <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4 flex items-center gap-2">
          <FaSearch className="text-gray-600" />
          Search Filters
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 md:gap-4 mb-3 md:mb-4">
          {/* Name Filter */}
          <div className="flex flex-col">
            <label className="text-xs md:text-sm font-medium text-gray-700 mb-1">
              Search by Name
            </label>
            <input
              type="text"
              placeholder="Enter name..."
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="p-2 text-sm md:text-base border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          {/* Member ID Filter */}
          <div className="flex flex-col">
            <label className="text-xs md:text-sm font-medium text-gray-700 mb-1">
              Search by Member ID
            </label>
            <input
              type="text"
              placeholder="Enter member ID..."
              value={searchMemberId}
              onChange={(e) => setSearchMemberId(e.target.value)}
              className="p-2 text-sm md:text-base border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          {/* Date Filter */}
          <div className="flex flex-col">
            <label className="text-xs md:text-sm font-medium text-gray-700 mb-1">
              Search by Date
            </label>
            <input
              type="date"
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
              className="p-2 text-sm md:text-base border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          {/* Sender Profile Type Filter */}
          <div className="flex flex-col">
            <label className="text-xs md:text-sm font-medium text-gray-700 mb-1">
              Sender Profile Type
            </label>
            <select
              value={senderProfileType}
              onChange={(e) => setSenderProfileType(e.target.value)}
              className="p-2 text-sm md:text-base border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
            >
              <option value="all">All</option> {/* Default selected */}
              <option value="premium">Premium</option>
              <option value="free">Free</option>
            </select>
          </div>

          {/* Receiver Profile Type Filter */}
          <div className="flex flex-col">
            <label className="text-xs md:text-sm font-medium text-gray-700 mb-1">
              Receiver Profile Type
            </label>
            <select
              value={receiverProfileType}
              onChange={(e) => setReceiverProfileType(e.target.value)}
              className="p-2 text-sm md:text-base border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
            >
              <option value="all">All</option> {/* Default selected */}
              <option value="premium">Premium</option>
              <option value="free">Free</option>
            </select>
          </div>
        </div>

        {/* Clear Filters Button */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 md:gap-3">
          <button
            onClick={clearFilters}
            className="px-3 py-2 md:px-4 md:py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors w-full sm:w-auto text-sm md:text-base"
          >
            Clear All Filters
          </button>
          
          {/* Active Filters Summary */}
          <div className="text-xs md:text-sm text-gray-600">
            Active filters: Sender: <span className="font-medium">{senderProfileType}</span>, 
            Receiver: <span className="font-medium">{receiverProfileType}</span>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3 md:space-y-4">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-8">
            <FaHeart className="mx-auto text-gray-400 text-4xl mb-4" />
            <p className="text-gray-600 text-lg">
              {notifications.length === 0 ? 'No notifications found' : 'No matching notifications found'}
            </p>
            {(searchName || searchMemberId || searchDate || senderProfileType !== 'premium' || receiverProfileType !== 'all') && (
              <button
                onClick={clearFilters}
                className="mt-2 text-blue-500 hover:text-blue-700 underline"
              >
                Clear filters to see all notifications
              </button>
            )}
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <div
              key={notification._id}
              className="bg-white rounded-lg shadow-md p-3 md:p-6 border border-gray-200 hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div className="flex-grow">
                  {/* Enhanced interaction display with profile type badges */}
                  <div className="flex items-center gap-2 mb-3 text-sm md:text-base">
                    <FaHeart className="text-red-500 text-lg md:text-xl" />
                    <div className="flex items-center flex-wrap gap-1">
                      <span className="font-semibold text-blue-600 text-sm md:text-base">
                        {notification.sender?.name || 'Unknown User'}
                      </span>
                      <span className={`px-1.5 py-0.5 md:px-2 md:py-1 text-xs rounded-full font-semibold ${
                        notification.sender?.profileType?.toLowerCase() === 'premium' 
                          ? 'bg-yellow-100 text-yellow-800 border border-yellow-300' 
                          : 'bg-gray-100 text-gray-700 border border-gray-300'
                      }`}>
                        {notification.sender?.profileType?.toLowerCase() === 'premium' ? (
                          <>
                            <FaCrown className="inline mr-0.5 text-xs" />
                            <span className="hidden md:inline">Premium</span>
                            <span className="md:hidden">P</span>
                          </>
                        ) : (
                          <>
                            <FaUser className="inline mr-0.5 text-xs" />
                            <span className="hidden md:inline">Free</span>
                            <span className="md:hidden">F</span>
                          </>
                        )}
                      </span>
                    
                      <span className="text-gray-700 mx-1 md:mx-2 text-sm">liked</span>
                    
                      <span className="font-semibold text-green-600 text-sm md:text-base">
                        {notification.receiver?.name || 'Unknown User'}
                      </span>
                      <span className={`px-1.5 py-0.5 md:px-2 md:py-1 text-xs rounded-full font-semibold ${
                        notification.receiver?.profileType?.toLowerCase() === 'premium' 
                          ? 'bg-yellow-100 text-yellow-800 border border-yellow-300' 
                          : 'bg-gray-100 text-gray-700 border border-gray-300'
                      }`}>
                        {notification.receiver?.profileType?.toLowerCase() === 'premium' ? (
                          <>
                            <FaCrown className="inline mr-0.5 text-xs" />
                            <span className="hidden md:inline">Premium</span>
                            <span className="md:hidden">P</span>
                          </>
                        ) : (
                          <>
                            <FaUser className="inline mr-0.5 text-xs" />
                            <span className="hidden md:inline">Free</span>
                            <span className="md:hidden">F</span>
                          </>
                        )}
                      </span>
                    
                      <span className="text-gray-700 text-sm">'s profile</span>
                    </div>
                  </div>

                  {/* User Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-4 mb-3 md:mb-4">
                    <div className="bg-blue-50 p-2 md:p-4 rounded-lg">
                      <h4 className="font-medium text-blue-800 mb-2 text-sm md:text-base">Sender (Liked)</h4>
                      <div className="space-y-1 text-xs md:text-sm">
                        <p><span className="font-medium">Name:</span> {notification.sender?.name || 'Unknown User'}</p>
                        <p><span className="font-medium">Email:</span> {notification.sender?.email || 'N/A'}</p>
                        <p><span className="font-medium">Mobile:</span> {notification.sender?.mobile || 'N/A'}</p>
                        <p>
                          <span className="font-medium">Member ID:</span> 
                          {notification.sender?.memberid ? (
                            <span className="text-green-600"> {notification.sender.memberid}</span>
                          ) : (
                            <span className="text-red-500 italic"> Not assigned</span>
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="bg-green-50 p-2 md:p-4 rounded-lg">
                      <h4 className="font-medium text-green-800 mb-2 text-sm md:text-base">Receiver (Liked by)</h4>
                      <div className="space-y-1 text-xs md:text-sm">
                        <p><span className="font-medium">Name:</span> {notification.receiver?.name || 'Unknown User'}</p>
                        <p><span className="font-medium">Email:</span> {notification.receiver?.email || 'N/A'}</p>
                        <p><span className="font-medium">Mobile:</span> {notification.receiver?.mobile || 'N/A'}</p>
                        <p>
                          <span className="font-medium">Member ID:</span> 
                          {notification.receiver?.memberid ? (
                            <span className="text-green-600"> {notification.receiver.memberid}</span>
                          ) : (
                            <span className="text-red-500 italic"> Not assigned</span>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 md:gap-2 text-gray-500 text-xs md:text-sm mb-3">
                    <FaCalendarAlt className="text-xs md:text-sm" />
                    <span>
                      {new Date(notification.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row lg:flex-col gap-2 md:gap-3 lg:ml-6">
                  <button
                    onClick={() => handleViewProfile(notification.sender)}
                    className="flex items-center justify-center gap-1 md:gap-2 px-3 py-2 md:px-4 md:py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium text-sm md:text-base whitespace-nowrap"
                    disabled={!notification.sender}
                  >
                    <FaUser className="text-xs md:text-sm" />
                    <span className="hidden md:inline">View Sender</span>
                    <span className="md:hidden">View</span>
                  </button>
                                    
                  <button
                    onClick={() => handleViewProfile(notification.receiver)}
                    className="flex items-center justify-center gap-1 md:gap-2 px-3 py-2 md:px-4 md:py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium text-sm md:text-base whitespace-nowrap"
                    disabled={!notification.receiver}
                  >
                    <FaUser className="text-xs md:text-sm" />
                    <span className="hidden md:inline">View Receiver</span>
                    <span className="md:hidden">View</span>
                  </button>
                                    
                  <button
                    onClick={() => handleRemoveLike(notification.sender.id, notification.receiver.id, notification._id)}
                    className="flex items-center justify-center gap-1 md:gap-2 px-3 py-2 md:px-4 md:py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium text-sm md:text-base whitespace-nowrap"
                    title="Remove Like"
                  >
                    <FaTrash className="text-xs md:text-sm" />
                    <span className="hidden md:inline">Remove Like</span>
                    <span className="md:hidden">Remove</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Profile Card Modal */}
      {selectedProfile && (
        <ProfileCard 
          profile={selectedProfile} 
          onClose={() => setSelectedProfile(null)} 
        />
      )}
    </div>
  );
};

export default NotificationsListWithProfileTypeFilter;