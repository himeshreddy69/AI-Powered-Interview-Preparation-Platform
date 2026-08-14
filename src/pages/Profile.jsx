import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { uploadProfileImage } from "../services/supabase/storage";
import {
  getUserProfile,
  updateUserProfile
} from "../services/supabase/profiles";
import "../assets/styles/Profile.css";

function Profile() {
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [imageUrl, setImageUrl] = useState("");

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    bio: ""
  });

  const [editProfile, setEditProfile] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) return;

      try {
        const data = await getUserProfile(user.uid);

        setProfile({
          name: data?.name || user.displayName || "",
          email: data?.email || user.email || "",
          phone: data?.phone || "",
          role: data?.role || "Software Engineer",
          bio: data?.bio || ""
        });

        if (data?.photo) {
          setImageUrl(data.photo);
        }
      } catch (error) {
        console.error("Error loading profile:", error);
      }
    };

    loadProfile();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setProfile((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      alert("Please log in first.");
      return;
    }

    if (!profile.name.trim()) {
      alert("Please enter your name.");
      return;
    }

    try {
      setSaving(true);

      await updateUserProfile(user.uid, {
        name: profile.name.trim(),
        phone: profile.phone.trim(),
        role: profile.role.trim(),
        bio: profile.bio.trim()
      });

      setEditProfile(false);

      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Profile update error:", error);
      alert(error.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];

    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp"
    ];

    if (!allowedTypes.includes(file.type)) {
      alert("Only JPG, PNG and WEBP images are allowed.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Maximum file size is 5 MB.");
      event.target.value = "";
      return;
    }

    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      alert("Please log in first.");
      event.target.value = "";
      return;
    }

    try {
      setUploading(true);

      const url = await uploadProfileImage(
        file,
        user.uid
      );

      await updateUserProfile(user.uid, {
        photo: url
      });

      setImageUrl(url);

      alert("Profile image uploaded successfully!");
    } catch (error) {
      console.error(
        "Profile image upload error:",
        error
      );

      alert(
        error.message ||
        "Image upload failed."
      );
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  const handleCancelEdit = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) return;

    const data = await getUserProfile(user.uid);

    setProfile({
      name: data?.name || user.displayName || "",
      email: data?.email || user.email || "",
      phone: data?.phone || "",
      role: data?.role || "Software Engineer",
      bio: data?.bio || ""
    });

    setEditProfile(false);
  };

  return (
    <div className="profile-container">

      <div className="profile-header">
        <div>
          <h2 className="profile-title">
            My Profile
          </h2>

          <p>
            Manage your personal information
            and profile picture.
          </p>
        </div>

        {!editProfile && (
          <button
            type="button"
            className="edit-profile-btn"
            onClick={() => {
  console.log("EDIT PROFILE CLICKED");
  setEditProfile(true);
}}
          >
            ✏️ Edit Profile
          </button>
        )}
      </div>

      <div className="profile-card">

        <div className="profile-image-section">

          {imageUrl ? (
            <img
              src={imageUrl}
              alt="Profile"
              className="profile-image"
              style={{
                width: "120px",
                height: "120px",
                borderRadius: "50%",
                objectFit: "cover"
              }}
            />
          ) : (
            <div
              className="profile-image"
              style={{
                width: "120px",
                height: "120px",
                borderRadius: "50%",
                background: "#e2e8f0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "40px"
              }}
            >
              👤
            </div>
          )}

          <label className="upload-btn">
            {uploading
              ? "Uploading..."
              : imageUrl
              ? "Change Profile Image"
              : "Upload Profile Image"}

            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageUpload}
              hidden
              disabled={uploading}
            />
          </label>

          <small>
            JPG, PNG or WEBP · Maximum 5 MB
          </small>

        </div>

        <div className="profile-details">

          <div className="profile-field">
            <label>Name</label>

            {editProfile ? (
              <input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleChange}
                placeholder="Enter your name"
              />
            ) : (
              <div className="profile-value">
                {profile.name || "Not provided"}
              </div>
            )}
          </div>

          <div className="profile-field">
            <label>Email</label>

            <div className="profile-value">
              {profile.email || "Not provided"}
            </div>
          </div>

          <div className="profile-field">
            <label>Phone</label>

            {editProfile ? (
              <input
                type="tel"
                name="phone"
                value={profile.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
              />
            ) : (
              <div className="profile-value">
                {profile.phone || "Not provided"}
              </div>
            )}
          </div>

          <div className="profile-field">
            <label>Role</label>

            {editProfile ? (
              <input
                type="text"
                name="role"
                value={profile.role}
                onChange={handleChange}
                placeholder="Enter your role"
              />
            ) : (
              <div className="profile-value">
                {profile.role || "Not provided"}
              </div>
            )}
          </div>

          <div className="profile-field">
            <label>Bio</label>

            {editProfile ? (
              <textarea
                name="bio"
                value={profile.bio}
                onChange={handleChange}
                placeholder="Tell us about yourself"
                rows="4"
              />
            ) : (
              <div className="profile-value">
                {profile.bio || "No bio added yet."}
              </div>
            )}
          </div>

          {editProfile && (
            <div className="profile-actions">

              <button
                type="button"
                className="cancel-profile-btn"
                onClick={handleCancelEdit}
                disabled={saving}
              >
                Cancel
              </button>

              <button
                type="button"
                className="save-profile-btn"
                onClick={handleSaveProfile}
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : "Save Changes"}
              </button>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}

export default Profile;