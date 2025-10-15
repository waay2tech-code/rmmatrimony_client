// import React, { useEffect, useState } from "react";
// import { motion } from "framer-motion";
// import { Link } from "react-router-dom";
// import { FaCrown, FaLock, FaBell, FaUser, FaHeart } from "react-icons/fa";
// import { notificationService } from '../services/notificationService';
// import { userService } from '../services/userService';
// import PremiumUpgradeModal from "./PremiumUpgradeModal";

// const NotificationPage = () => {
//   const [notifications, setNotifications] = useState([]);
//   const [initialLoad, setInitialLoad] = useState(true);
//   const [currentUserProfileType, setCurrentUserProfileType] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [showUpgradeModal, setShowUpgradeModal] = useState(false);

//   // ✅ Ask permission for browser notifications on first load
//   useEffect(() => {
//     notificationService.requestNotificationPermission();
//   }, []);

//   // ✅ Fetch user profile type (premium check) - NOW USING COOKIE AUTH
//   const fetchUserProfileType = async () => {
//     try {
//       const data = await userService.getProfileType(); // Uses cookies automatically
//       console.log("Profile type response:", data);

//       const isPremium = data.profileType?.toLowerCase() === 'premium';
//       setCurrentUserProfileType(isPremium);
//       console.log("Is Premium User:", isPremium);

//     } catch (error) {
//       console.error("Failed to fetch profile type:", error);
//       setCurrentUserProfileType(false);
//     }
//   };

//   // ✅ Fetch notifications - NOW USING COOKIE AUTH
//   const fetchNotifications = async () => {
//     try {
//       setLoading(true);
//       const data = await notificationService.getNotifications(); // Uses cookies automatically

//       const newNotifs = data.notifications.filter((n) => {
//         return !notifications.some((old) => old._id === n._id);
//       });

//       if (!initialLoad && newNotifs.length > 0) {
//         newNotifs.forEach((notif) => {
//           notificationService.showBrowserNotification(notif.message);
//         });
//       }

//       setNotifications(data.notifications);
//       setInitialLoad(false);
//     } catch (error) {
//       console.error("Failed to fetch notifications:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ Initialize data on first mount
//   useEffect(() => {
//     const initialize = async () => {
//       await fetchUserProfileType();
//       await fetchNotifications();
//     };
//     initialize();
//   }, []);

//   // Function to determine notification icon based on content
//   const getNotificationIcon = (message) => {
//     if (message.includes('liked') || message.includes('interest')) {
//       return <FaHeart className="text-red-500" />;
//     } else if (message.includes('premium') || message.includes('upgrade')) {
//       return <FaCrown className="text-yellow-500" />;
//     } else {
//       return <FaBell className="text-blue-500" />;
//     }
//   };

//   // Function to determine notification type for styling
//   const getNotificationType = (message) => {
//     if (message.includes('liked')) {
//       return 'like';
//     } else if (message.includes('interest')) {
//       return 'interest';
//     } else if (message.includes('premium') || message.includes('upgrade')) {
//       return 'premium';
//     } else {
//       return 'general';
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 py-8 px-4">
//       <div className="max-w-4xl mx-auto">
//         <motion.div
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="text-center mb-10"
//         >
//           <h1 className="text-4xl font-bold text-gray-900 mb-3">Notifications</h1>
//           <p className="text-gray-700">Stay updated with all your latest activities</p>
//         </motion.div>

//         {/* Premium status indicator */}
//         {currentUserProfileType && (
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.1 }}
//             className="bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-2xl shadow-xl p-6 mb-8 text-white text-center"
//           >
//             <div className="flex justify-center items-center">
//               <FaCrown className="mr-3 text-white" />
//               <span className="font-bold text-xl">Premium Member - Full Access Enabled</span>
//             </div>
//           </motion.div>
//         )}

//         {/* Show upgrade banner for non-premium users */}
//         {!currentUserProfileType && (
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.1 }}
//             whileHover={{ scale: 1.02 }}
//             className="bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl shadow-xl p-6 mb-8 text-white"
//           >
//             <div className="flex flex-col md:flex-row justify-between items-center">
//               <div className="mb-4 md:mb-0">
//                 <h3 className="font-bold text-xl flex items-center mb-2">
//                   <FaCrown className="mr-3 text-yellow-300" /> 
//                   Upgrade to Premium
//                 </h3>
//                 <p>View who liked your profile and get unlimited access</p>
//               </div>
//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 onClick={() => setShowUpgradeModal(true)}
//                 className="bg-white text-red-600 px-6 py-3 rounded-full font-semibold hover:bg-red-50 transition-all duration-300 shadow-lg"
//               >
//                 Upgrade Now
//               </motion.button>
//             </div>
//           </motion.div>
//         )}

//         {/* Refresh Button with loading state */}
//         <div className="flex justify-center mb-8">
//           <motion.button
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             className={`flex items-center px-6 py-3 rounded-full font-medium shadow-lg ${
//               loading 
//                 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
//                 : 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600'
//             }`}
//             onClick={fetchNotifications}
//             disabled={loading}
//           >
//             {loading ? (
//               <>
//                 <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
//                 Loading...
//               </>
//             ) : (
//               <>
//                 <FaBell className="mr-2" />
//                 Refresh Notifications
//               </>
//             )}
//           </motion.button>
//         </div>

//         {notifications.length === 0 ? (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             className="text-center py-16"
//           >
//             <div className="bg-white rounded-2xl shadow-lg p-10 max-w-lg mx-auto">
//               <FaBell className="mx-auto text-gray-300 text-7xl mb-6" />
//               <h3 className="text-2xl font-bold text-gray-900 mb-3">No Notifications</h3>
//               <p className="text-gray-700 mb-6">You don't have any notifications at the moment.</p>
//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 onClick={fetchNotifications}
//                 className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-3 rounded-full hover:from-red-600 hover:to-orange-600 transition font-medium"
//               >
//                 Check for Updates
//               </motion.button>
//             </div>
//           </motion.div>
//         ) : (
//           <motion.div 
//             className="space-y-6"
//             layout
//           >
//             {notifications.map((notif, index) => {
//               const notificationType = getNotificationType(notif.message);
//               const bgColor = notificationType === 'like' 
//                 ? 'bg-red-100 border-red-300' 
//                 : notificationType === 'interest' 
//                   ? 'bg-blue-100 border-blue-300' 
//                   : notificationType === 'premium' 
//                     ? 'bg-yellow-100 border-yellow-300' 
//                     : 'bg-gray-50 border-gray-200';

//               return (
//                 <motion.div
//                   key={notif._id}
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: index * 0.1 }}
//                   whileHover={{ y: -5 }}
//                   className={`p-6 rounded-2xl shadow-lg border-2 ${bgColor} transition-all duration-300`}
//                 >
//                   <div className="flex items-start">
//                     <div className="mr-4 mt-1">
//                       <div className="bg-white p-3 rounded-full shadow">
//                         {getNotificationIcon(notif.message)}
//                       </div>
//                     </div>
                    
//                     <div className="flex-grow">
//                       {/* Premium check: Show different content based on user type */}
//                       {currentUserProfileType ? (
//                         // Premium users can see who liked them and view profiles
//                         <Link
//                           to={`/profile/${notif.sender._id}`}
//                           className="text-blue-600 hover:underline block font-semibold"
//                         >
//                           {notif.message}
//                         </Link>
//                       ) : (
//                         // Non-premium users see generic message
//                         <div className="space-y-3">
//                           <p className="text-gray-900 font-medium">{notif.message}</p>
//                           <div className="flex items-center space-x-3">
//                             <motion.button 
//                               whileHover={{ scale: 1.05 }}
//                               whileTap={{ scale: 0.95 }}
//                               onClick={() => {
//                                 alert("Upgrade to Premium to see who liked you!");
//                               }}
//                               className="flex items-center bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-4 py-2 rounded-full text-sm hover:from-yellow-600 hover:to-yellow-700 transition shadow"
//                             >
//                               <FaLock className="mr-1" />
//                               Upgrade Now
//                             </motion.button>
//                             <span className="text-xs text-gray-600">
//                               Upgrade to see who liked you
//                             </span>
//                           </div>
//                         </div>
//                       )}
                      
//                       <div className="flex flex-wrap items-center mt-4 text-sm text-gray-700">
//                         <span className="flex items-center mr-4">
//                           <FaUser className="mr-1 text-gray-600" />
//                           {notif.sender?.name || 'Unknown User'}
//                         </span>
//                         <span className="text-gray-600">
//                           {new Date(notif.createdAt).toLocaleString()}
//                         </span>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Show additional View Profile button for premium users */}
//                   {currentUserProfileType && (
//                     <div className="mt-6 pt-4 border-t border-gray-200">
//                       <Link
//                         to={`/profile/${notif.sender._id}`}
//                         className="inline-flex items-center bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-2 rounded-full hover:from-red-600 hover:to-orange-600 transition text-sm shadow"
//                       >
//                         <FaUser className="mr-2" />
//                         View Profile
//                       </Link>
//                     </div>
//                   )}
//                 </motion.div>
//               );
//             })}
//           </motion.div>
//         )}
        
//         <PremiumUpgradeModal 
//           isOpen={showUpgradeModal}
//           onClose={() => setShowUpgradeModal(false)}
//         />
//       </div>
//     </div>
//   );
// };

// export default NotificationPage;
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { FaCrown, FaLock, FaBell, FaUser, FaHeart, FaSyncAlt } from "react-icons/fa";
import { notificationService } from '../services/notificationService';
import { userService } from '../services/userService';
import PremiumUpgradeModal from "./PremiumUpgradeModal";

const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [initialLoad, setInitialLoad] = useState(true);
  const [currentUserProfileType, setCurrentUserProfileType] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // Ask permission for browser notifications on first load
  useEffect(() => {
    notificationService.requestNotificationPermission();
  }, []);

  // Fetch user profile type (premium check)
  const fetchUserProfileType = async () => {
    try {
      const data = await userService.getProfileType();
      const isPremium = data.profileType?.toLowerCase() === 'premium';
      setCurrentUserProfileType(isPremium);
    } catch (error) {
      console.error("Failed to fetch profile type:", error);
      setCurrentUserProfileType(false);
    }
  };

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = await notificationService.getNotifications();

      const newNotifs = data.notifications.filter((n) => {
        return !notifications.some((old) => old._id === n._id);
      });

      if (!initialLoad && newNotifs.length > 0) {
        newNotifs.forEach((notif) => {
          notificationService.showBrowserNotification(notif.message);
        });
      }

      setNotifications(data.notifications);
      setInitialLoad(false);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  // Initialize data on first mount
  useEffect(() => {
    const initialize = async () => {
      await fetchUserProfileType();
      await fetchNotifications();
    };
    initialize();
  }, []);

  // Function to determine notification icon based on content
  const getNotificationIcon = (message) => {
    if (message.includes('liked') || message.includes('interest')) {
      return <FaHeart className="text-red-500" />;
    } else if (message.includes('premium') || message.includes('upgrade')) {
      return <FaCrown className="text-yellow-500" />;
    } else {
      return <FaBell className="text-blue-500" />;
    }
  };

  // Function to determine notification type for styling and premium check
  const getNotificationType = (message) => {
    if (message.includes('liked')) {
      return 'like';
    } else if (message.includes('interest')) {
      return 'interest';
    } else if (message.includes('premium') || message.includes('upgrade')) {
      return 'premium';
    } else {
      return 'general';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-red-50 to-purple-100 py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">Notifications</h1>
          <p className="text-lg text-gray-700 max-w-md mx-auto">Stay updated with all your latest activities and connections.</p>
        </motion.div>

        {/* Premium status indicator */}
        {currentUserProfileType && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="bg-gradient-to-r from-yellow-400 to-amber-500 rounded-3xl shadow-2xl p-6 mb-10 text-white text-center flex flex-col md:flex-row justify-center items-center space-y-3 md:space-y-0 md:space-x-4"
          >
            <FaCrown className="text-3xl" />
            <span className="font-bold text-2xl">Premium Member - Full Access Unlocked!</span>
          </motion.div>
        )}

{/* Show upgrade banner for non-premium users */}
        {!currentUserProfileType && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            whileHover={{ scale: 1.01, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
            className="bg-gradient-to-r from-red-500 to-orange-500 rounded-3xl shadow-2xl p-7 mb-10 text-white cursor-pointer"
            onClick={() => setShowUpgradeModal(true)}
          >
            <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left space-y-4 md:space-y-0">
              <div className="flex items-center space-x-4">
                <FaCrown className="text-4xl text-yellow-300" />
                <div>
                  <h3 className="font-bold text-2xl mb-1">Unlock Premium Features</h3>
                  <p className="text-lg opacity-90">See who liked your profile, get unlimited interactions & more!</p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-red-700 px-8 py-3 rounded-full font-bold text-lg hover:bg-gray-100 transition-all duration-300 shadow-lg"
              >
                Upgrade Now
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Refresh Button with loading state */}
        <div className="flex justify-center mb-10">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`flex items-center px-8 py-3 rounded-full font-semibold text-lg shadow-xl transition-all duration-300 ${
              loading
                ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700'
            }`}
            onClick={fetchNotifications}
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                Refreshing...
              </>
            ) : (
              <>
                <FaSyncAlt className="mr-3" />
                Refresh Notifications
              </>
            )}
          </motion.button>
        </div>

        <AnimatePresence>
          {notifications.length === 0 ? (
            <motion.div
              key="no-notifications"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.5 }}
              className="text-center py-20"
            >
              <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-lg mx-auto border border-gray-100">
                <FaBell className="mx-auto text-gray-300 text-8xl mb-8" />
                <h3 className="text-3xl font-bold text-gray-900 mb-4">No Notifications Yet!</h3>
                <p className="text-gray-700 text-lg mb-8">
                  You don't have any notifications at the moment. Connect with others to get started!
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={fetchNotifications}
                  className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-8 py-4 rounded-full hover:from-red-600 hover:to-orange-600 transition font-bold text-lg shadow-lg"
                >
                  Check for Updates
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="notifications-list"
              className="space-y-7"
              layout
            >
              {notifications.map((notif, index) => {
                const notificationType = getNotificationType(notif.message);
                // Determine if this specific notification content is considered 'premium-restricted'
                // This means it's content like "liked you" or "expressed interest" that we want to blur for non-premium users
                const isPremiumContent = ['like', 'interest'].includes(notificationType);

                const bgColor = notificationType === 'like'
                  ? 'bg-red-50'
                  : notificationType === 'interest'
                    ? 'bg-blue-50'
                    : notificationType === 'premium'
                      ? 'bg-yellow-50'
                      : 'bg-gray-50';

                const borderColor = notificationType === 'like'
                  ? 'border-red-200'
                  : notificationType === 'interest'
                    ? 'border-blue-200'
                    : notificationType === 'premium'
                      ? 'border-yellow-200'
                      : 'border-gray-200';

                return (
                  <motion.div
                    key={notif._id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ delay: index * 0.08, duration: 0.4 }}
                    whileHover={{ y: -7, boxShadow: '0 15px 30px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)' }}
                    className={`relative p-7 rounded-3xl shadow-lg border ${borderColor} ${bgColor} transition-all duration-300 overflow-hidden`}
                  >
                    <div className="flex items-start">
                      <div className="mr-5 mt-1">
                        <div className="bg-white p-3 rounded-full shadow-md">
                          {getNotificationIcon(notif.message)}
                        </div>
                      </div>

                      <div className="flex-grow">
                        {/* Notification Message Display */}
                        {(!currentUserProfileType && isPremiumContent) ? (
                          // Non-premium user viewing premium content: Show blurred message and overlay
                          <div className="relative mb-2">
                            <p className="text-gray-900 font-medium text-lg blur-sm select-none">
                              {notif.message} {/* Blurry content */}
                            </p>
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50 bg-opacity-70 rounded-lg p-2">
                              <FaLock className="text-gray-500 text-4xl mb-3" />
                              <span className="text-gray-700 font-semibold text-center text-md">
                                Upgrade to see full details!
                              </span>
                            </div>
                          </div>
                        ) : (
                          // Premium user, or non-premium user viewing non-premium content: Show clear message
                          <p className="text-gray-900 font-medium text-lg leading-relaxed mb-2">
                            {notif.message}
                          </p>
                        )}

                        <div className="flex flex-wrap items-center mt-4 text-sm text-gray-600">
                          {notif.sender && (
                            <span className="flex items-center mr-4">
                              <FaUser className="mr-2 text-gray-500" />
                              {/* Sender Name Display: Linked if Premium, plain text if Not */}
                              {currentUserProfileType ? (
                                <Link to={`/profile/${notif.sender._id}`} className="text-blue-600 hover:underline font-semibold">
                                  {notif.sender.name || 'Unknown User'}
                                </Link>
                              ) : (
                                <span className="font-medium">
                                  {notif.sender.name || 'Unknown User'}
                                </span>
                              )}
                            </span>
                          )}
                          <span className="text-gray-500">
                            {new Date(notif.createdAt).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Show additional View Profile button for premium users when there's a sender */}
                    {currentUserProfileType && notif.sender && (
                      <div className="mt-7 pt-5 border-t border-gray-100 flex justify-end">
                        <Link
                          to={`/profile/${notif.sender._id}`}
                          className="inline-flex items-center bg-gradient-to-r from-red-500 to-orange-500 text-white px-5 py-2.5 rounded-full hover:from-red-600 hover:to-orange-600 transition text-md font-medium shadow-md"
                        >
                          <FaUser className="mr-2" />
                          View Profile
                        </Link>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        <PremiumUpgradeModal
          isOpen={showUpgradeModal}
          onClose={() => setShowUpgradeModal(false)}
        />
      </div>
    </div>
  );
};

export default NotificationPage;