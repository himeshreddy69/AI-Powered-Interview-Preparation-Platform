import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { uploadProfileImage } from "../services/supabase/storage";
import { getUserProfile, saveUserProfile } from "../services/supabase/profiles";
import "../assets/styles/Profile.css";

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

function Profile() {
  const { user } = useAuth();

  const [profile, setProfile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [name, setName] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadProfile() {
      if (!user?.uid) return;
      const data = await getUserProfile(user.uid);
      if (cancelled) return;
      setProfile(data);
      setName(data?.name || user.displayName || "");
    }

    loadProfile();
    return () => {
      cancelled = true;
    };
  }, [user]);

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError("");

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setError("Only JPG, PNG and WEBP images are allowed.");
      return;
    }

    if (file.size > MAX_IMAGE_BYTES) {
      setError("Maximum file size is 5 MB.");
      return;
    }

    if (!user?.uid) {
      setError("Please log in first.");
      return;
    }

    try {
      setUploading(true);
      setStatus("Uploading picture...");

      const photoUrl = await uploadProfileImage(file, user.uid);

      // Save the URL on the profile row, otherwise the picture is lost on reload.
      const updated = await saveUserProfile(user.uid, { photoUrl });

      setProfile(updated);
      setStatus("Profile picture updated.");
    } catch (uploadError) {
      console.error(uploadError);
      setError(uploadError.message || "Image upload failed.");
    } finally {
      setUploading(false);
      // Let the input fire again if the same file is picked twice.
      event.target.value = "";
      setTimeout(() => setStatus(""), 4000);
    }
  };

  const handleSaveName = async (event) => {
    event.preventDefault();
    if (!user?.uid) return;

    setError("");
    try {
      setStatus("Saving...");
      const updated = await saveUserProfile(user.uid, {
        name: name.trim(),
        email: user.email || "",
      });
      setProfile(updated);
      setStatus("Profile saved.");
    } catch (saveError) {
      console.error(saveError);
      setError("Could not save your profile.");
    } finally {
      setTimeout(() => setStatus(""), 4000);
    }
  };

  const photoUrl = profile?.photoUrl || "";
  const initial = (profile?.name || user?.email || "?").charAt(0).toUpperCase();

  return (
    <div className="profile-container">
      <h2 className="profile-title">My Profile</h2>

      <div className="profile-avatar-wrap">
        {photoUrl ? (
          <img src={photoUrl} alt="Profile" className="profile-image" />
        ) : (
          <div className="profile-image profile-image-placeholder" aria-hidden="true">
            {initial}
          </div>
        )}
      </div>

      <label className="upload-btn">
        {uploading ? "Uploading..." : photoUrl ? "Change Picture" : "Upload Picture"}
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleImageUpload}
          disabled={uploading}
          hidden
        />
      </label>

      <form className="profile-form" onSubmit={handleSaveName}>
        <label htmlFor="profile-name">Display name</label>
        <input
          id="profile-name"
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Your name"
        />

        <label htmlFor="profile-email">Email</label>
        <input
          id="profile-email"
          type="email"
          value={user?.email || ""}
          disabled
          readOnly
        />
        <small className="profile-hint">
          Your email comes from your login and cannot be changed here.
        </small>

        <button type="submit" className="profile-save-btn">
          Save Profile
        </button>
      </form>

      {status && <p className="profile-status">{status}</p>}
      {error && <p className="profile-error">{error}</p>}
    </div>
  );
}

export default Profile;
