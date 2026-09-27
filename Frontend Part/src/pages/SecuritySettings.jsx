import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { changeCurrentPassword } from "../services/authService";

function SecuritySettings() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [passwordChanging, setPasswordChanging] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState("");

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChangePassword = async (e) => {
    e.preventDefault();

    try {
      setPasswordChanging(true);
      setPasswordMessage("");

      const response = await changeCurrentPassword({
        oldPassword,
        newPassword,
        confirmPassword,
      });

      setPasswordMessage(
        response.message || "Password changed successfully."
      );

      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Failed to change password:", error);

      setPasswordMessage(
        error.response?.data?.message ||
          "Failed to change password."
      );
    } finally {
      setPasswordChanging(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">

      {/* Back */}
      <button
        type="button"
        onClick={() => window.history.back()}
        className="mb-4 text-sm text-blue-600 hover:underline"
      >
        ← Back to Settings
      </button>

      <h1 className="text-3xl font-bold mb-6">
        Security
      </h1>

      <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">

        <h2 className="text-xl font-semibold mb-2">
          Change Password
        </h2>

        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          Update your password to keep your account secure.
        </p>

        <form
          onSubmit={handleChangePassword}
          className="space-y-5"
        >

          {/* Current Password */}
          <div>
            <label className="block mb-2 font-medium">
              Current Password
            </label>

            <div className="relative">
              <input
                type={showOldPassword ? "text" : "password"}
                value={oldPassword}
                onChange={(e) =>
                  setOldPassword(e.target.value)
                }
                className="w-full px-4 py-2 pr-12 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your current password"
                required
              />

              <button
                type="button"
                onClick={() =>
                  setShowOldPassword((prev) => !prev)
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                aria-label={
                  showOldPassword
                    ? "Hide password"
                    : "Show password"
                }
              >
                {showOldPassword ? (
                  <FiEyeOff size={20} />
                ) : (
                  <FiEye size={20} />
                )}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="block mb-2 font-medium">
              New Password
            </label>

            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) =>
                  setNewPassword(e.target.value)
                }
                className="w-full px-4 py-2 pr-12 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your new password"
                required
              />

              <button
                type="button"
                onClick={() =>
                  setShowNewPassword((prev) => !prev)
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                aria-label={
                  showNewPassword
                    ? "Hide password"
                    : "Show password"
                }
              >
                {showNewPassword ? (
                  <FiEyeOff size={20} />
                ) : (
                  <FiEye size={20} />
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block mb-2 font-medium">
              Confirm New Password
            </label>

            <div className="relative">
              <input
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
                className="w-full px-4 py-2 pr-12 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Confirm your new password"
                required
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword((prev) => !prev)
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                aria-label={
                  showConfirmPassword
                    ? "Hide password"
                    : "Show password"
                }
              >
                {showConfirmPassword ? (
                  <FiEyeOff size={20} />
                ) : (
                  <FiEye size={20} />
                )}
              </button>
            </div>
          </div>

          {/* Message */}
          {passwordMessage && (
            <p className="text-sm text-green-600">
              {passwordMessage}
            </p>
          )}

          {/* Button */}
          <button
            type="submit"
            disabled={passwordChanging}
            className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 active:scale-95 transition-transform duration-150 disabled:opacity-50"
          >
            {passwordChanging
              ? "Changing..."
              : "Change Password"}
          </button>

        </form>
      </div>
    </div>
  );
}

export default SecuritySettings;