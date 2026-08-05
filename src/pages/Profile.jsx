import { useState } from "react";
import { getAuth } from "firebase/auth";
import { uploadProfileImage } from "../services/supabase/storage";
import "../assets/styles/Profile.css";
function Profile() {
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];

    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      alert("Only JPG, PNG and WEBP images are allowed.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Maximum file size is 5 MB.");
      return;
    }

    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      alert("Please log in first.");
      return;
    }

    try {
      setUploading(true);

      const url = await uploadProfileImage(file, user.uid);

      setImageUrl(url);

      alert("Profile image uploaded successfully!");

      // Later we'll save this URL in Firestore
    } catch (error) {
      console.error(error);
      alert(error.message || "Image upload failed.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="profile-container
    ">
      <h2 className="profile-title">My Profile</h2>

      {imageUrl && (
        <img
          src={imageUrl}
          alt="Profile"
          className="profile-image"
          style={{
            width: "120px",
            height: "120px",
            borderRadius: "50%",
            objectFit: "cover",
            marginBottom: "20px",
          }}
        />
      )}

      <label className="upload-btn">
        {uploading ? "Uploading..." : "Upload Profile Image"}

        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleImageUpload}
          hidden
        />
      </label>
    </div>
  );
}

export default Profile;