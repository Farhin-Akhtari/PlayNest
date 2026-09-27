import { useEffect, useRef, useState } from "react";
import {
  updateAccountDetails,
  updateAvatar,
  removeAvatar,
  updateCoverImage,
  removeCoverImage,
} from "../services/authService.js";
import { useAuth } from "../context/AuthContext.jsx";

function ProfileSettings() {
  const { user, updateUser, authLoading } = useAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");

  const [saving, setSaving] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [coverUploading, setCoverUploading] = useState(false);

  const [message, setMessage] = useState("");

  const [previewImage, setPreviewImage] = useState(null);

  const avatarInputRef = useRef(null);
  const coverInputRef = useRef(null);
  const [avatarRemoving, setAvatarRemoving] = useState(false);
  const [coverRemoving, setCoverRemoving] = useState(false);


  // Load current user details
  useEffect(() => {
    if (user) {
      setFullName(user.fullName || "");
      setEmail(user.email || "");
    }
  }, [user]);


  // Save profile details
  const handleSave = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setMessage("");

      const response = await updateAccountDetails({
        fullName,
        email,
      });

      updateUser(response.data);

      setMessage("Profile updated successfully.");
    } catch (error) {
      console.error("Failed to update profile:", error);

      setMessage(
        error.response?.data?.message ||
        "Failed to update profile."
      );
    } finally {
      setSaving(false);
    }
  };


  // Update avatar
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const formData = new FormData();

    formData.append("avatar", file);

    try {
      setAvatarUploading(true);
      setMessage("");

      const response = await updateAvatar(formData);

      updateUser(response.data);

      setMessage("Avatar updated successfully.");
    } catch (error) {
      console.error("Failed to update avatar:", error);

      setMessage(
        error.response?.data?.message ||
        "Failed to update avatar."
      );
    } finally {
      setAvatarUploading(false);

      // Allow selecting the same file again
      e.target.value = "";
    }
  };

  const handleRemoveAvatar = async () => {
  try {
    setAvatarRemoving(true);
    setMessage("");

    const response = await removeAvatar();

    updateUser(response.data);

    setMessage("Avatar removed successfully.");
  } catch (error) {
    console.error("Failed to remove avatar:", error);

    setMessage(
      error.response?.data?.message ||
      "Failed to remove avatar."
    );
  } finally {
    setAvatarRemoving(false);
  }
};


  // Update cover image
const handleCoverImageChange = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const formData = new FormData();

    formData.append("coverImage", file);

    try {
      setCoverUploading(true);
      setMessage("");

      const response = await updateCoverImage(formData);

      updateUser(response.data);

      setMessage("Cover image updated successfully.");
    } catch (error) {
      console.error("Failed to update cover image:", error);

      setMessage(
        error.response?.data?.message ||
        "Failed to update cover image."
      );
    } finally {
      setCoverUploading(false);

      // Allow selecting the same file again
      e.target.value = "";
    }
};

const handleRemoveCoverImage = async () => {
  try {
    setCoverRemoving(true);
    setMessage("");

    const response = await removeCoverImage();

    updateUser(response.data);

    setMessage("Cover image removed successfully.");
  } catch (error) {
    console.error("Failed to remove cover image:", error);

    setMessage(
      error.response?.data?.message ||
      "Failed to remove cover image."
    );
  } finally {
    setCoverRemoving(false);
  }
};


  // Open avatar file picker
  const openAvatarPicker = () => {
    avatarInputRef.current?.click();
  };


  // Open cover file picker
  const openCoverPicker = () => {
    coverInputRef.current?.click();
  };


  // Loading state
  if (authLoading) {
    return (
      <p className="p-6">
        Loading...
      </p>
    );
  }


  // User not available
  if (!user) {
    return (
      <p className="p-6">
        Unable to load user details.
      </p>
    );
  }


  return (
    <div className="max-w-3xl mx-auto">

      {/* Back button */}
      <button
        type="button"
        onClick={() => window.history.back()}
        className="mb-4 text-sm text-blue-600 hover:underline"
      >
        ← Back to Settings
      </button>


      {/* Page title */}
      <h1 className="text-3xl font-bold mb-6">
        Profile
      </h1>


      <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">

        <h2 className="text-xl font-semibold mb-6">
          Edit Profile
        </h2>


        <form
          onSubmit={handleSave}
          className="space-y-6"
        >

          {/* Cover Image */}
          <div>
            <label className="block mb-2 font-medium">
              Cover Image
            </label>

            <div className="space-y-3">

              {user.coverImage && (
                <img
                  src={user.coverImage}
                  alt="Cover"
                  onClick={() =>
                    setPreviewImage(user.coverImage)
                  }
                  className="w-full h-40 object-cover rounded-xl border border-gray-300 cursor-pointer hover:opacity-90 transition"
                />
              )}

              <input
                ref={coverInputRef}
                type="file"
                accept="image/*"
                onChange={handleCoverImageChange}
                className="hidden"
              />

<div className="flex gap-2">
  <button
    type="button"
    onClick={openCoverPicker}
    disabled={coverUploading || coverRemoving}
    className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 active:scale-95 transition-transform duration-150 disabled:opacity-50"
  >
    {coverUploading ? "Uploading..." : "Choose Cover Image"}
  </button>

  {user.coverImage && (
    <button
      type="button"
      onClick={handleRemoveCoverImage}
      disabled={coverUploading || coverRemoving}
      className="px-4 py-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50 active:scale-95 transition-transform duration-150 disabled:opacity-50"
    >
      {coverRemoving ? "Removing..." : "Remove Cover Image"}
    </button>
  )}
</div>

    </div>
  </div>

        {/* Avatar */}
  <div>
    <label className="block mb-2 font-medium">
      Avatar
    </label>

  <div className="flex items-center gap-4">

  {user.avatar ? (
  <img
    src={user.avatar}
    alt={user.username}
    onClick={() =>
      setPreviewImage(user.avatar)
    }
    className="w-20 h-20 rounded-full object-cover border border-gray-300 cursor-pointer hover:opacity-90 transition"
  />
) : (
  <div
    className="w-20 h-20 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-2xl font-semibold text-gray-700 dark:text-white border border-gray-300"
  >
    {user.username?.charAt(0).toUpperCase()}
  </div>
)}

  <div>
    <input
      ref={avatarInputRef}
      type="file"
      accept="image/*"
      onChange={handleAvatarChange}
      className="hidden"
    />

  <div className="flex gap-2">
   <button
    type="button"
    onClick={openAvatarPicker}
    disabled={avatarUploading || avatarRemoving}
    className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 active:scale-95 transition-transform duration-150 disabled:opacity-50"
  >
    {avatarUploading ? "Uploading..." : "Choose Avatar"}
  </button>

  {user.avatar && (
    <button
      type="button"
      onClick={handleRemoveAvatar}
      disabled={avatarUploading || avatarRemoving}
      className="px-4 py-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50 active:scale-95 transition-transform duration-150 disabled:opacity-50"
    >
      {avatarRemoving ? "Removing..." : "Remove Avatar"}
    </button>
  )}
</div>

      </div>

   </div>
  </div>


          {/* Full Name */}
          <div>
            <label className="block mb-2 font-medium">
              Full Name
            </label>

            <input
              type="text"
              value={fullName}
              onChange={(e) =>
                setFullName(e.target.value)
              }
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

          </div>


          {/* Email */}
          <div>

            <label className="block mb-2 font-medium">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

          </div>


          {/* Username */}
          <div>

            <label className="block mb-2 font-medium">
              Username
            </label>

            <input
              type="text"
              value={`@${user.username}`}
              disabled
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-500 cursor-not-allowed"
            />

          </div>


          {/* Message */}
          {message && (
            <p className="text-sm text-green-600">
              {message}
            </p>
          )}


          {/* Save Changes */}
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 active:scale-95 transition-transform duration-150 disabled:opacity-50"
          >
            {saving
              ? "Saving..."
              : "Save Changes"}
          </button>

        </form>


        {/* Preview Modal */}
        {previewImage && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
            onClick={() => setPreviewImage(null)}
          >

            <div
              className="relative max-w-5xl max-h-[90vh]"
              onClick={(e) =>
                e.stopPropagation()
              }
            >

              <img
                src={previewImage}
                alt="Preview"
                className="max-w-full max-h-[85vh] object-contain rounded-xl"
              />

              <button
                type="button"
                onClick={() =>
                  setPreviewImage(null)
                }
                className="absolute -top-3 -right-3 w-9 h-9 rounded-full bg-white text-black text-xl hover:bg-gray-200 active:scale-90 transition-transform"
              >
                ×
              </button>

            </div>

          </div>
        )}

      </div>

    </div>
  );
}

export default ProfileSettings;