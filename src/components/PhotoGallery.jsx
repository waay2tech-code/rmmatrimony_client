import React, { useRef } from "react";
import axios from "../api/axios";

const PhotoGallery = ({ images, onDelete, onUpload }) => {
  const fileInputRef = useRef();
  console.log(images,"images");
  
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("photo", file);

    try {
      const response = await axios.post("/api/users/upload-photo", formData);
      if (onUpload) onUpload(response.data.url);
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  // Derive API origin from VITE_API_URL (e.g., https://api.example.com/api -> https://api.example.com)
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  let origin;
  try {
    origin = new URL(apiUrl).origin;
  } catch (e) {
    origin = 'http://localhost:5000';
  }

  const buildImageSrc = (url) => {
    if (!url) return '';
    // If it's already an absolute URL, return as is
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    // Normalize the URL path
    const normalized = url.startsWith('/') ? url.slice(1) : url;
    return `${origin}/${normalized}`;
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4 flex-wrap">
      {images.map((img, index) => (
  <div key={index} className="relative w-24 h-24 sm:w-32 sm:h-32">
    <img
      src={buildImageSrc(img.url)}
      alt={img.url || 'Profile'}
      className="w-full h-full object-cover rounded"
      onError={(e) => {
        e.target.onerror = null;
        // e.target.src = "https://via.placeholder.com/150";
      }}
    />
    <button
      onClick={() => onDelete(index)} // Changed: pass index instead of url
      className="absolute top-0 right-0 bg-red-600 text-white text-xs px-1 rounded"
    >
      X
    </button>
  </div>
))}

        {/* {images.length < 3 && (
          <div className="w-24 h-24 flex items-center justify-center border-2 border-dashed rounded cursor-pointer text-gray-500">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleUpload}
              className="hidden"
            />
            <button onClick={() => fileInputRef.current.click()}>+</button>
          </div>
        )} */}
      </div>
    </div>
  );
};

export default PhotoGallery;