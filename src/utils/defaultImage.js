// src/utils/defaultImage.js

/**
 * Generates a default profile image based on user's gender and name
 * @param {string} gender - User's gender ('Male', 'Female', or other)
 * @param {string} name - User's name for initials
 * @returns {string} - Data URL for the default image
 */
export const getDefaultProfileImage = (gender, name) => {
  // Create a simple SVG-based default avatar
  const getInitials = (fullName) => {
    if (!fullName) return 'U';
    const names = fullName.trim().split(' ');
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };

  const initials = getInitials(name);
  const bgColor = gender === 'Female' ? '#ec4899' : gender === 'Male' ? '#3b82f6' : '#6b7280';
  
  // Create SVG data URL
  const svg = `
    <svg width="128" height="128" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
      <circle cx="64" cy="64" r="64" fill="${bgColor}"/>
      <text x="64" y="74" font-family="Arial, sans-serif" font-size="36" font-weight="bold" fill="white" text-anchor="middle">${initials}</text>
    </svg>
  `;
  
  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

/**
 * Gets the appropriate profile image URL with fallback to default
 * @param {string|File} profilePhoto - The user's profile photo URL or File object
 * @param {string} gender - User's gender
 * @param {string} name - User's name
 * @returns {string} - Complete image URL
 */
export const getProfileImageUrl = (profilePhoto, gender, name) => {
  // Handle case where profilePhoto is a File object
  if (profilePhoto instanceof File) {
    return URL.createObjectURL(profilePhoto);
  }
  
  // Handle case where profilePhoto is not a string (null, undefined, etc.)
  if (typeof profilePhoto !== 'string') {
    return getDefaultProfileImage(gender, name);
  }
  
  if (!profilePhoto) {
    return getDefaultProfileImage(gender, name);
  }
  
  // Handle different URL formats
  if (profilePhoto.startsWith('blob:') || profilePhoto.startsWith('data:')) {
    return profilePhoto;
  }
  
  // Derive API origin from VITE_API_URL (e.g., https://api.example.com/api -> https://api.example.com)
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  let origin;
  try {
    origin = new URL(apiUrl).origin;
  } catch (e) {
    origin = 'http://localhost:5000';
  }

  // Normalize leading slash
  const normalized = profilePhoto.startsWith('/') ? profilePhoto.slice(1) : profilePhoto;

  // If path already points to uploads or similar, prefix with origin
  if (normalized.startsWith('uploads/')) {
    return `${origin}/${normalized}`;
  }

  // Fallback: if server returned a leading slash path
  return `${origin}/${normalized}`;
};