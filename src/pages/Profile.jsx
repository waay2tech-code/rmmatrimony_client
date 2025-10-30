import React, { useState, useEffect } from 'react';
import { userService } from "../services/userService";
import PhotoGallery from "../components/PhotoGallery";
import { getDefaultProfileImage, getProfileImageUrl } from '../utils/defaultImage';

const Profile = () => {
  const [form, setForm] = useState({
    name: "",
    gender: "",
    dob: "",
    age: "",
    address: "",
    location: "",
    mobile: "",
    qualification: "",
    occupation: "",
    monthlyIncome: "",
    height: "",
    weight: "", 
    aboutMe: "",
    fatherName: "",
    fatherOccupation: "",
    fatherNative: "",
    motherName: "",
    motherOccupation: "",
    motherNative: "",
    siblings: "",
    religion: "",
    otherReligion: "",
    caste: "",
    otherCaste: "",
    profilePhoto: null,
  });

  const [memberId, setMemberId] = useState("");

  const [activeTab, setActiveTab] = useState("profile");
  const [galleryImages, setGalleryImages] = useState([]);
  const [newPhoto, setNewPhoto] = useState(null);
  const [newPhotoPreview, setNewPhotoPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [profilePreview, setProfilePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Calculate age from DOB
  useEffect(() => {
    if (form.dob) {
      const birthDate = new Date(form.dob);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      setForm(prev => ({ ...prev, age: age.toString() }));
    }
  }, [form.dob]);

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      if (profilePreview && profilePreview.startsWith('blob:')) {
        URL.revokeObjectURL(profilePreview);
      }
      if (newPhotoPreview) {
        URL.revokeObjectURL(newPhotoPreview);
      }
    };
  }, [profilePreview, newPhotoPreview]);

  // Fetch profile data on mount using service
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setIsLoading(true);
        const response = await userService.getProfile();

        const { profile, gallery } = response;

        // Set member ID
        setMemberId(profile.memberid || "");

        // Map each expected form field, use profile value if exists, else fallback
        setForm({
          name: profile.name || "",
          gender: profile.gender || "",
          dob: profile.dob || "",
          age: profile.age ? profile.age.toString() : "",
          address: profile.address || "",
          location: profile.location || "",
          mobile: profile.mobile || "",
          qualification: profile.qualification || "",
          occupation: profile.occupation || "",
          monthlyIncome: profile.monthlyIncome || "",
          height: profile.height || "",
          weight: profile.weight || "",
          aboutMe: profile.aboutMe || "",
          fatherName: profile.fatherName || "",
          fatherOccupation: profile.fatherOccupation || "",
          fatherNative: profile.fatherNative || "",
          motherName: profile.motherName || "",
          motherOccupation: profile.motherOccupation || "",
          motherNative: profile.motherNative || "",
          siblings: profile.siblings || "",
          religion: profile.religion || "",
          otherReligion: profile.otherReligion || "",
          caste: profile.caste || "",
          otherCaste: profile.otherCaste || "",
          profilePhoto: null,
        });

        // Set profile photo preview
        console.log("Profile photo from server:", profile.profilePhoto);
        if (profile.profilePhoto) {
          setProfilePreview(profile.profilePhoto);
        } else if (profile.profilePhotoUrl) {
          setProfilePreview(profile.profilePhotoUrl);
        } else {
          setProfilePreview(null);
        }

        // Handle gallery images correctly - gallery should be array of photo objects
        setGalleryImages(gallery || []);
      } catch (error) {
        console.error("Error fetching profile:", error);
        setErrors({
          fetch: "Failed to load profile. Please try again later."
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, [successMessage]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file" && name === "profilePhoto") {
      const file = files[0];
      console.log("📁 File selected:", file);
      // Check if file exists and is a valid file object
      if (file && file instanceof File) {
        // Validate file type
        if (!file.type.startsWith('image/')) {
          setErrors(prev => ({ ...prev, profilePhoto: 'Please select a valid image file' }));
          return;
        }
        
        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          setErrors(prev => ({ ...prev, profilePhoto: 'File size must be less than 5MB' }));
          return;
        }
        
        console.log("✅ File validation passed, setting form data");
        setForm((prev) => ({ ...prev, profilePhoto: file }));
        // Don't revoke the previous URL here, do it when we're done with it
        setProfilePreview(URL.createObjectURL(file));
        // Clear any previous errors
        setErrors(prev => ({ ...prev, profilePhoto: null }));
      }
    } else if (type === "file" && name === "newPhoto") {
      const file = files[0];
      // Check if file exists and is a valid file object
      if (file && file instanceof File) {
        // Validate file type
        if (!file.type.startsWith('image/')) {
          setErrors(prev => ({ ...prev, newPhoto: 'Please select a valid image file' }));
          return;
        }
        
        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          setErrors(prev => ({ ...prev, newPhoto: 'File size must be less than 5MB' }));
          return;
        }
        
        setNewPhoto(file);
        if (newPhotoPreview) URL.revokeObjectURL(newPhotoPreview);
        setNewPhotoPreview(URL.createObjectURL(file));
        // Clear any previous errors
        setErrors(prev => ({ ...prev, newPhoto: null }));
      }
    } else {
      if (name === "mobile") {
        const digits = value.replace(/\D/g, "").slice(0, 10);
        const formatted = digits.replace(/(\d{5})(\d{1,5})?/, (_, a, b) => (b ? `${a} ${b}` : a));
        setForm((prev) => ({ ...prev, [name]: value }));
      } else {
        setForm((prev) => ({ ...prev, [name]: value }));
      }
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Full Name is required";
    if (!form.gender) newErrors.gender = "Gender is required";
    if (!form.dob) newErrors.dob = "Date of Birth is required";
    else if (new Date(form.dob) > new Date()) newErrors.dob = "Date cannot be in the future";
    if (!form.location.trim()) newErrors.location = "Location is required";
    if (!form.religion) newErrors.religion = "Religion is required";
    if (form.religion === "Others" && !form.otherReligion.trim()) newErrors.otherReligion = "Please specify religion";
    if (form.caste === "Others" && !form.otherCaste.trim()) newErrors.otherCaste = "Please specify caste";
    if (form.mobile && !/^\d{10}$/.test(form.mobile)) {
      newErrors.mobile = "Please enter a valid 10-digit mobile number";
    }
    
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, value);
      }
    });

    try {
      setIsLoading(true);
      console.log("📤 Uploading profile with photo:", form.profilePhoto);
      const response = await userService.updateProfile(formData);
      console.log("✅ Profile update response:", response);
      
      // ✅ Refetch profile data to get updated photo URL
      // Add a small delay to ensure server has processed the file
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updatedProfile = await userService.getProfile();
      const { profile } = updatedProfile;
      console.log("🔄 Refetched profile:", profile);
      
      // Update form with fresh data from server
      setForm(prev => ({
        ...prev,
        profilePhoto: null  // Clear the File object after successful upload
      }));
      
      // Clear preview since we now have the actual photo URL
      if (profilePreview && profilePreview.startsWith('blob:')) {
        URL.revokeObjectURL(profilePreview);
      }
      setProfilePreview(profile.profilePhoto || null);
      
      setSuccessMessage("Profile saved successfully");
      setTimeout(() => setSuccessMessage(""), 3000);
      setErrors({});
    } catch (error) {
      console.error("❌ Profile update error:", error);
      setErrors({
        submit: error.response?.data?.message || "Failed to save profile. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addPhoto = async () => {
    if (!newPhoto) return;
    
    if (galleryImages.length >= 3) {
      alert("You can only upload up to 3 photos");
      return;
    }

    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("photo", newPhoto);
      
      const response = await userService.uploadPhoto(formData);

      // Add the new photo object to the gallery
      const newPhotoObj = {
        url: response.url,
        isProfile: false
      };
      
      setGalleryImages([...galleryImages, newPhotoObj]);
      setNewPhoto(null);
      setNewPhotoPreview(null);
      setSuccessMessage("Photo uploaded successfully");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error uploading photo:", error);
      setErrors({
        photo: "Failed to upload photo. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deletePhoto = async (index) => {
    if (!window.confirm("Are you sure you want to delete this photo?")) return;

    try {
      setIsLoading(true);
      const photoObj = galleryImages[index];
      await userService.deletePhoto(photoObj.url);

      const updatedImages = galleryImages.filter((_, i) => i !== index);
      setGalleryImages(updatedImages);
      setSuccessMessage("Photo deleted successfully");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error deleting photo:", error);
      setErrors({
        photo: ""
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderProfileTab = () => (
    <>
      <div className="mb-6 text-center">
        <div className="relative inline-block">
          {console.log("Profile preview:", profilePreview, "Form profile photo:", form.profilePhoto)}
          <img 
            src={getProfileImageUrl(profilePreview || form.profilePhoto, form.gender, form.name)}
            alt="Profile Preview" 
            className="mx-auto h-32 w-32 rounded-full object-cover border-2 border-red-500"
            onError={(e) => {
              // Fallback to default image if the URL fails to load
              e.target.src = getDefaultProfileImage(form.gender, form.name);
            }}
          />
        </div>
        {memberId && (
          <p className="text-gray-600 mt-3 mb-2">
            <span className="font-medium">Member ID:</span> 
            <span className="ml-1 text-green-600 font-medium">{memberId}</span>
          </p>
        )}
        <label className="cursor-pointer bg-red-100 text-red-600 px-4 py-2 rounded-lg hover:bg-red-200 transition inline-block">
          {profilePreview ? 'Change Profile Photo' : 'Add Profile Photo'}
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleChange} 
            name="profilePhoto" 
            className="hidden"
          />
        </label>
        {errors.profilePhoto && <p className="text-red-500 text-sm mt-2">{errors.profilePhoto}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-xl shadow">
        <h3 className="col-span-2 text-xl font-semibold text-gray-800">Personal Information</h3>

        <div>
          <label className="block font-medium">Full Name *</label>
          <input 
            type="text" 
            name="name" 
            value={form.name} 
            onChange={handleChange} 
            className="w-full border mt-1 p-2 rounded" 
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>

        <div>
          <label className="block font-medium">Gender *</label>
          <select 
            name="gender" 
            value={form.gender} 
            onChange={handleChange} 
            className="w-full border mt-1 p-2 rounded"
          >
            <option value="">Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          {errors.gender && <p className="text-red-500 text-sm">{errors.gender}</p>}
        </div>

        <div>
          <label className="block font-medium">Date of Birth *</label>
          <input 
            type="date" 
            name="dob" 
            value={form.dob} 
            onChange={handleChange} 
            className="w-full border mt-1 p-2 rounded" 
            max={new Date().toISOString().split('T')[0]}
          />
          {errors.dob && <p className="text-red-500 text-sm">{errors.dob}</p>}
        </div>

        <div>
          <label className="block font-medium">Age</label>
          <input 
            type="text" 
            name="age" 
            value={form.age} 
            readOnly
            className="w-full border mt-1 p-2 rounded bg-gray-100" 
          />
        </div>

        <div>
          <label className="block font-medium">Address</label>
          <input 
            type="text" 
            name="address" 
            value={form.address} 
            onChange={handleChange} 
            className="w-full border mt-1 p-2 rounded" 
          />
        </div>

        <div>
          <label className="block font-medium">Location *</label>
          <input 
            type="text" 
            name="location" 
            value={form.location} 
            onChange={handleChange} 
            className="w-full border mt-1 p-2 rounded" 
          />
          {errors.location && <p className="text-red-500 text-sm">{errors.location}</p>}
        </div>

        <div>
          <label className="block font-medium">Mobile Number</label>
          <input
            type="text"
            name="mobile"
            value={form.mobile}
            onChange={handleChange}
            className="w-full border mt-1 p-2 rounded"
            maxLength="12"
            placeholder="e.g. 98765 43210"
          />
          {errors.mobile && <p className="text-red-500 text-sm">{errors.mobile}</p>}
        </div>

        <div>
          <label className="block font-medium">Qualification</label>
          <input 
            type="text" 
            name="qualification" 
            value={form.qualification} 
            onChange={handleChange} 
            className="w-full border mt-1 p-2 rounded" 
          />
        </div>

        <div>
          <label className="block font-medium">Occupation</label>
          <input 
            type="text" 
            name="occupation" 
            value={form.occupation} 
            onChange={handleChange} 
            className="w-full border mt-1 p-2 rounded" 
          />
        </div>

        <div>
          <label className="block font-medium">Monthly Income</label>
          <input 
            type="text" 
            name="monthlyIncome" 
            value={form.monthlyIncome} 
            onChange={handleChange} 
            className="w-full border mt-1 p-2 rounded" 
          />
        </div>

        <div>
          <label className="block font-medium">Height</label>
          <input 
            type="text" 
            name="height" 
            value={form.height} 
            onChange={handleChange} 
            className="w-full border mt-1 p-2 rounded" 
          />
        </div>

        <div>
          <label className="block font-medium">Weight</label>
          <input 
            type="text" 
            name="weight" 
            value={form.weight} 
            onChange={handleChange} 
            className="w-full border mt-1 p-2 rounded" 
          />
        </div>

        <div className="col-span-2">
          <label className="block font-medium">About Me</label>
          <textarea 
            name="aboutMe" 
            rows="4" 
            value={form.aboutMe} 
            onChange={handleChange} 
            className="w-full border mt-1 p-2 rounded resize-none" 
            maxLength="500"
          />
        </div>

        <h3 className="col-span-2 text-xl font-semibold mt-4 text-gray-800">Family Information</h3>

        <div>
          <label className="block font-medium">Father's Name</label>
          <input 
            type="text" 
            name="fatherName" 
            value={form.fatherName} 
            onChange={handleChange} 
            className="w-full border mt-1 p-2 rounded" 
          />
        </div>

        <div>
          <label className="block font-medium">Father's Occupation</label>
          <input 
            type="text" 
            name="fatherOccupation" 
            value={form.fatherOccupation} 
            onChange={handleChange} 
            className="w-full border mt-1 p-2 rounded" 
          />
        </div>

        <div>
          <label className="block font-medium">Father's Native</label>
          <input 
            type="text" 
            name="fatherNative" 
            value={form.fatherNative} 
            onChange={handleChange} 
            className="w-full border mt-1 p-2 rounded" 
          />
        </div>

        <div>
          <label className="block font-medium">Mother's Name</label>
          <input 
            type="text" 
            name="motherName" 
            value={form.motherName} 
            onChange={handleChange} 
            className="w-full border mt-1 p-2 rounded" 
          />
        </div>

        <div>
          <label className="block font-medium">Mother's Occupation</label>
          <input 
            type="text" 
            name="motherOccupation" 
            value={form.motherOccupation} 
            onChange={handleChange} 
            className="w-full border mt-1 p-2 rounded" 
          />
        </div>

        <div>
          <label className="block font-medium">Mother's Native</label>
          <input 
            type="text" 
            name="motherNative" 
            value={form.motherNative} 
            onChange={handleChange} 
            className="w-full border mt-1 p-2 rounded" 
          />
        </div>

        <div>
          <label className="block font-medium">Number of Siblings</label>
          <input 
            type="text" 
            name="siblings" 
            value={form.siblings} 
            onChange={handleChange} 
            className="w-full border mt-1 p-2 rounded" 
          />
        </div>

        <div>
          <label className="block font-medium">Religion *</label>
          <select 
            name="religion" 
            value={form.religion} 
            onChange={handleChange} 
            className="w-full border mt-1 p-2 rounded"
          >
            <option value="">Select</option>
            <option value="Hindu">Hindu</option>
            <option value="Muslim">Muslim</option>
            <option value="Christian">Christian</option>
            <option value="Others">Others</option>
          </select>
          {errors.religion && <p className="text-red-500 text-sm">{errors.religion}</p>}
          {form.religion === "Others" && (
            <input 
              type="text" 
              name="otherReligion" 
              value={form.otherReligion} 
              onChange={handleChange} 
              placeholder="Enter your religion" 
              className="w-full mt-2 border p-2 rounded" 
            />
          )}
          {errors.otherReligion && <p className="text-red-500 text-sm">{errors.otherReligion}</p>}
        </div>

        <div>
          <label className="block font-medium">Caste</label>
          <select 
            name="caste" 
            value={form.caste} 
            onChange={handleChange} 
            className="w-full border mt-1 p-2 rounded"
          >
            <option value="">Select</option>
            <option value="Paravar">Paravar</option>
            <option value="Mukkuvar">Mukkuvar</option>
            <option value="Others">Others</option>
          </select>
          {form.caste === "Others" && (
            <input 
              type="text" 
              name="otherCaste" 
              value={form.otherCaste} 
              onChange={handleChange} 
              placeholder="Enter your caste" 
              className="w-full mt-2 border p-2 rounded" 
            />
          )}
          {errors.otherCaste && <p className="text-red-500 text-sm">{errors.otherCaste}</p>}
        </div>
      </div>

      <div className="text-center mt-6">
        <button 
          onClick={handleSubmit} 
          disabled={isLoading}
          className="bg-red-600 text-white px-6 py-2 rounded-xl hover:bg-red-700 disabled:bg-red-400"
        >
          {isLoading ? "Saving..." : "Save Profile"}
        </button>
        {errors.submit && <p className="text-red-500 mt-2">{errors.submit}</p>}
        {successMessage && (
          <p className="text-green-600 mt-2">{successMessage}</p>
        )}
      </div>
    </>
  );

  const renderPhotosTab = () => (
    <div className="bg-white p-6 rounded-xl shadow">
      <PhotoGallery images={galleryImages} onDelete={deletePhoto} />
      
      {galleryImages.length < 3 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4">Add New Photo</h3>
          {newPhotoPreview && (
            <div className="mb-4">
              <img 
                src={newPhotoPreview} 
                alt="Preview" 
                className="h-48 w-full object-cover rounded-lg border"
              />
            </div>
          )}
          <div className="flex items-center gap-4">
            <label className="cursor-pointer bg-red-100 text-red-600 px-4 py-2 rounded-lg hover:bg-red-200 transition">
              Select Photo
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleChange} 
                name="newPhoto" 
                className="hidden"
              />
            </label>
            {errors.newPhoto && <p className="text-red-500 text-sm mt-2">{errors.newPhoto}</p>}
            {newPhoto && (
              <button 
                onClick={addPhoto}
                disabled={isLoading}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:bg-red-400"
              >
                {isLoading ? "Uploading..." : "Upload Photo"}
              </button>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-2">
            You can add up to {3 - galleryImages.length} more photos (Max 3 photos allowed)
          </p>
          {errors.photo && <p className="text-red-500 mt-2">{errors.photo}</p>}
          {successMessage && (
            <p className="text-green-600 mt-2">{successMessage}</p>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-2 text-center">My Profile</h2>
      <p className="text-center text-gray-600 mb-8">Manage your profile information and preferences</p>

      {errors.fetch && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {errors.fetch}
        </div>
      )}

      <div className="flex justify-center mb-8 gap-4">
        <button 
          onClick={() => setActiveTab("profile")} 
          className={`px-4 py-2 font-semibold ${activeTab === "profile" ? "border-b-4 border-red-500 text-red-600" : "text-gray-500 hover:text-black"}`}
        >
          Profile
        </button>
        <button 
          onClick={() => setActiveTab("photos")} 
          className={`px-4 py-2 font-semibold ${activeTab === "photos" ? "border-b-4 border-red-500 text-red-600" : "text-gray-500 hover:text-black"}`}
        >
          Photos
        </button>
      </div>

      {isLoading && activeTab === "profile" ? (
        <div className="text-center py-8">
          <p>Loading profile...</p>
        </div>
      ) : activeTab === "profile" ? (
        renderProfileTab()
      ) : (
        renderPhotosTab()
      )}
    </div>
  );
};

export default Profile;
