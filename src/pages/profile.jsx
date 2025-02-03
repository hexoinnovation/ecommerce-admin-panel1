import { doc, getDoc, setDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../components/firebase"; // Import Firebase auth methods
import { db } from "../components/firebase"; // Firebase config

function ProfileDashboard({ setIsAuthenticated }) {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [website, setWebsite] = useState("");
  const [socialLinks, setSocialLinks] = useState({
    facebook: "",
    instagram: "",
    twitter: "",
  });
  const [profileImage, setProfileImage] = useState(null);
  const [selectedTab, setSelectedTab] = useState("business"); // Active tab
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
  });
  const navigate = useNavigate();
  const storage = getStorage(); // Firebase storage reference

  useEffect(() => {
    const fetchUserProfile = async () => {
      const userEmail =
        localStorage.getItem("userEmail") || auth.currentUser?.email;
      if (!userEmail) {
        navigate("/login");
        return;
      }

      try {
        const userRef = doc(db, "admin", userEmail);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          setUser(userDoc.data());
          setName(userDoc.data().name);
          setEmail(userDoc.data().email);
          setPhone(userDoc.data().phone || "");
          setAddress(userDoc.data().address || "");
          setBusinessName(userDoc.data().businessName || "");
          setWebsite(userDoc.data().website || "");
          setSocialLinks(
            userDoc.data().socialLinks || {
              facebook: "",
              instagram: "",
              twitter: "",
            }
          );
          setSecuritySettings(
            userDoc.data().securitySettings || { twoFactorAuth: false }
          );
        } else {
          setError("User not found.");
        }
      } catch (err) {
        setError("Error fetching user data.");
        console.error(err);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  // Function to handle updating business details
  const handleUpdateBusiness = async (e) => {
    e.preventDefault();
    try {
      const userRef = doc(db, "admin", email);
      await setDoc(
        userRef,
        {
          businessName,
          website,
          socialLinks,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );

      setError(""); // Clear any previous error message
      setSuccess("Business details updated successfully!");
    } catch (err) {
      setError("Error updating business details. Please try again.");
      console.error(err);
    }
  };

  // Function to handle updating the profile (name, phone, address)
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      let imageUrl = user?.profileImage || ""; // Default to existing image if not updated

      // If a new image is uploaded, upload to Firebase Storage
      if (profileImage) {
        const imageRef = ref(storage, `profileImages/${email}`);
        await uploadBytes(imageRef, profileImage);
        imageUrl = await getDownloadURL(imageRef);
      }

      const userRef = doc(db, "admin", email);
      await setDoc(
        userRef,
        {
          name: name,
          email: email,
          phone: phone,
          address: address,
          businessName: businessName,
          website: website,
          socialLinks: socialLinks,
          profileImage: imageUrl,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );

      setError(""); // Clear any previous error message
      setSuccess("Profile updated successfully!");
    } catch (err) {
      setError("Error updating profile. Please try again.");
      console.error(err);
    }
  };

  // Function to handle password change
  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    // Here, we assume you check the current password before updating
    // For now, we're just simulating this validation.
    if (currentPassword !== user?.password) {
      setError("Current password is incorrect.");
      return;
    }

    try {
      const userRef = doc(db, "admin", email);
      await setDoc(
        userRef,
        {
          password: newPassword, // Update the password in Firestore
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );

      setError("");
      setSuccess("Password updated successfully!");
    } catch (err) {
      setError("Error updating password.");
      console.error(err);
    }
  };

  // Handle file upload for profile picture
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
    }
  };

  // Handle changes to security settings
  const handleSecuritySettingsChange = (e) => {
    const { name, checked } = e.target;
    setSecuritySettings((prevSettings) => ({
      ...prevSettings,
      [name]: checked,
    }));
  };

  return (
    <div className="min-h-500px bg-blue-200 flex">
      {/* Sidebar */}
      <div className="w-50 bg-indigo-800 text-white p-2">
        <h2 className="text-2xl font-semibold mb-8">Admin Dashboard</h2>
        <ul className="space-y-4">
          <li>
            <button
              className={`w-full text-left py-2 px-4 rounded-lg ${
                selectedTab === "profile" ? "bg-indigo-600" : "bg-indigo-500"
              } hover:bg-indigo-600 focus:outline-none`}
              onClick={() => setSelectedTab("profile")}
            >
              Profile Settings
            </button>
          </li>
          <li>
            <button
              className={`w-full text-left py-2 px-4 rounded-lg ${
                selectedTab === "business" ? "bg-indigo-600" : "bg-indigo-500"
              } hover:bg-indigo-600 focus:outline-none`}
              onClick={() => setSelectedTab("business")}
            >
              Business Details
            </button>
          </li>
          <li>
            <button
              className={`w-full text-left py-2 px-4 rounded-lg ${
                selectedTab === "password" ? "bg-indigo-600" : "bg-indigo-500"
              } hover:bg-indigo-600 focus:outline-none`}
              onClick={() => setSelectedTab("password")}
            >
              Change Password
            </button>
          </li>
          <li>
            <button
              className={`w-full text-left py-2 px-4 rounded-lg ${
                selectedTab === "security" ? "bg-indigo-600" : "bg-indigo-500"
              } hover:bg-indigo-600 focus:outline-none`}
              onClick={() => setSelectedTab("security")}
            >
              Security Settings
            </button>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-gray-800">
            Profile Dashboard
          </h2>
          {/* Error or Success Message */}
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          {success && (
            <p className="text-green-500 text-sm text-center">{success}</p>
          )}

          {/* Profile Settings Tab */}
          {selectedTab === "profile" && (
            <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">
                Personal Information
              </h3>
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                {/* Profile Photo */}
                <div>
                  <label
                    htmlFor="profileImage"
                    className="block text-gray-700 text-sm"
                  >
                    Profile Photo
                  </label>
                  <input
                    type="file"
                    id="profileImage"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="mt-2"
                  />
                  {profileImage && (
                    <p className="text-sm text-gray-600 mt-2">
                      Selected file: {profileImage.name}
                    </p>
                  )}
                </div>

                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-gray-700 text-sm">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full p-3 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                  />
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-gray-700 text-sm"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full p-3 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    disabled
                  />
                </div>

                {/* Phone */}
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-gray-700 text-sm"
                  >
                    Phone Number
                  </label>
                  <input
                    type="text"
                    id="phone"
                    className="w-full p-3 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter your phone number"
                  />
                </div>

                {/* Address */}
                <div>
                  <label
                    htmlFor="address"
                    className="block text-gray-700 text-sm"
                  >
                    Address
                  </label>
                  <input
                    type="text"
                    id="address"
                    className="w-full p-3 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter your address"
                  />
                </div>

                {/* Save Button */}
                <div className="mt-4 flex justify-center">
                  <button
                    type="submit"
                    className="bg-indigo-600 text-white py-2 px-6 rounded-lg transition duration-300 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Business Details Tab */}
          {selectedTab === "business" && (
            <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">
                Business Details
              </h3>
              <form onSubmit={handleUpdateBusiness} className="space-y-4">
                {/* Business Name */}
                <div>
                  <label
                    htmlFor="businessName"
                    className="block text-gray-700 text-sm"
                  >
                    Business Name
                  </label>
                  <input
                    type="text"
                    id="businessName"
                    className="w-full p-3 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="Enter your business name"
                  />
                </div>

                {/* Website */}
                <div>
                  <label
                    htmlFor="website"
                    className="block text-gray-700 text-sm"
                  >
                    Website
                  </label>
                  <input
                    type="url"
                    id="website"
                    className="w-full p-3 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="Enter your business website"
                  />
                </div>

                {/* Social Links */}
                <div>
                  <label
                    htmlFor="socialLinks"
                    className="block text-gray-700 text-sm"
                  >
                    Social Media Links
                  </label>
                  <div className="space-y-2 mt-2">
                    <input
                      type="text"
                      id="facebook"
                      value={socialLinks.facebook}
                      onChange={(e) =>
                        setSocialLinks({
                          ...socialLinks,
                          facebook: e.target.value,
                        })
                      }
                      className="w-full p-3 mt-2 border border-gray-300 rounded-lg shadow-sm"
                      placeholder="Facebook link"
                    />
                    <input
                      type="text"
                      id="instagram"
                      value={socialLinks.instagram}
                      onChange={(e) =>
                        setSocialLinks({
                          ...socialLinks,
                          instagram: e.target.value,
                        })
                      }
                      className="w-full p-3 mt-2 border border-gray-300 rounded-lg shadow-sm"
                      placeholder="Instagram link"
                    />
                    <input
                      type="text"
                      id="twitter"
                      value={socialLinks.twitter}
                      onChange={(e) =>
                        setSocialLinks({
                          ...socialLinks,
                          twitter: e.target.value,
                        })
                      }
                      className="w-full p-3 mt-2 border border-gray-300 rounded-lg shadow-sm"
                      placeholder="Twitter link"
                    />
                  </div>
                </div>

                {/* Save Button */}
                <div className="mt-4 flex justify-center">
                  <button
                    type="submit"
                    className="bg-indigo-600 text-white py-2 px-6 rounded-lg transition duration-300 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    Save Business Info
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Change Password Tab */}
          {selectedTab === "password" && (
            <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">
                Change Password
              </h3>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                {/* Current Password */}
                <div>
                  <label
                    htmlFor="currentPassword"
                    className="block text-gray-700 text-sm"
                  >
                    Current Password
                  </label>
                  <input
                    type="password"
                    id="currentPassword"
                    className="w-full p-3 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                  />
                </div>

                {/* New Password */}
                <div>
                  <label
                    htmlFor="newPassword"
                    className="block text-gray-700 text-sm"
                  >
                    New Password
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    className="w-full p-3 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                  />
                </div>

                {/* Confirm Password */}
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-gray-700 text-sm"
                  >
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    className="w-full p-3 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                  />
                </div>

                {/* Save Button */}
                <div className="mt-4 flex justify-center">
                  <button
                    type="submit"
                    className="bg-indigo-600 text-white py-2 px-6 rounded-lg transition duration-300 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    Update Password
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Security Settings Tab */}
          {selectedTab === "security" && (
            <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">
                Security Settings
              </h3>
              <form className="space-y-4">
                {/* Two Factor Authentication */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="twoFactorAuth"
                    name="twoFactorAuth"
                    checked={securitySettings.twoFactorAuth}
                    onChange={handleSecuritySettingsChange}
                    className="mr-2"
                  />
                  <label htmlFor="twoFactorAuth" className="text-gray-700">
                    Enable Two Factor Authentication
                  </label>
                </div>

                {/* Save Button */}
                <div className="mt-4 flex justify-center">
                  <button
                    type="button"
                    className="bg-indigo-600 text-white py-2 px-6 rounded-lg transition duration-300 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    onClick={() => alert("Security settings updated")}
                  >
                    Save Security Settings
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfileDashboard;
