import api from './api';

export const notificationService = {
  // Get all notifications
  getNotifications: async () => {
    const response = await api.get('/users/notifications');
    return response.data;
  },

  // Mark notification as read (if you add this feature)
  markAsRead: async (notificationId) => {
    const response = await api.put(`/users/notifications/${notificationId}/read`);
    return response.data;
  },

  // Delete notification (if you add this feature)
  deleteNotification: async (notificationId) => {
    const response = await api.delete(`/users/notifications/${notificationId}`);
    return response.data;
  },

  getAllNotificationsAdmin: async () => {
    const response = await api.get('/users/admin/notifications');
    return response.data;
  },
  
  removeLike: async (senderId, receiverId) => {
    const response = await api.post('/users/admin/remove-like', { senderId, receiverId });
    return response.data;
  },
  // Request browser notification permission
  requestNotificationPermission: async () => {
    if ("Notification" in window && Notification.permission !== "granted") {
      const permission = await Notification.requestPermission();
      console.log("Notification permission:", permission);
      return permission;
    }
    return Notification.permission;
  },

  // Show browser notification
  showBrowserNotification: (message, options = {}) => {
    if ("Notification" in window && Notification.permission === "granted") {
      return new Notification("🔔 New Notification", {
        body: message,
        icon: "/icon.png",
        ...options
      });
    }
    return null;
  }
};
