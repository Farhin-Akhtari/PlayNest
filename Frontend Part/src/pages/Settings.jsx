
import { useNavigate } from "react-router-dom";
import {
  FiUser,
  FiLock,
  FiMoon,
  FiBell,
  FiChevronRight
} from "react-icons/fi";

function Settings() {
  const navigate = useNavigate();

  const settingsOptions = [
    {
      title: "Profile",
      description: "Edit your name, avatar, cover image, and profile details.",
      icon: <FiUser size={22} />,
      path: "/settings/profile",
    },
    {
      title: "Security",
      description: "Change your password and manage your account security.",
      icon: <FiLock size={22} />,
      path: "/settings/security",
    },
    {
      title: "Appearance",
      description: "Choose between light and dark theme.",
      icon: <FiMoon size={22} />,
      path: "/settings/appearance",
    },
    {
      title: "Notifications",
      description: "Control which notifications you receive.",
      icon: <FiBell size={22} />,
      path: "/settings/notifications",
    },
  ];

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">
        Settings
      </h1>

      <p className="text-gray-500 dark:text-gray-400 mb-6">
        Manage your PlayNest account and preferences.
      </p>

      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        {settingsOptions.map((option, index) => (
          <button
            key={option.path}
            type="button"
            onClick={() => navigate(option.path)}
            className={`w-full flex items-center gap-4 p-5 text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
              index !== settingsOptions.length - 1
                ? "border-b border-gray-200 dark:border-gray-700"
                : ""
            }`}
          >
            <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
              {option.icon}
            </div>

            <div className="flex-1">
              <h2 className="font-semibold text-lg">
                {option.title}
              </h2>

              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {option.description}
              </p>
            </div>

            <FiChevronRight
              size={20}
              className="text-gray-400"
            />
          </button>
        ))}
      </div>
    </div>
  );
}

export default Settings;