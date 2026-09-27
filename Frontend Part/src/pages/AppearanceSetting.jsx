import { useTheme } from "../context/ThemeContext.jsx";

function AppearanceSettings() {
  const { darkMode, toggleTheme } = useTheme();

  return (
    <div className="max-w-3xl mx-auto">
      <button
        type="button"
        onClick={() => window.history.back()}
        className="mb-4 text-sm text-blue-600 hover:underline"
      >
        ← Back to Settings
      </button>

      <h1 className="text-3xl font-bold mb-6">
        Appearance
      </h1>

      <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold mb-2">
          Appearance
        </h2>

        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          Choose how PlayNest looks on your device.
        </p>

        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">
              Theme
            </p>

            <p className="text-sm text-gray-500 dark:text-gray-400">
              {darkMode
                ? "Dark theme is enabled"
                : "Light theme is enabled"}
            </p>
          </div>

          <button
            type="button"
            onClick={toggleTheme}
            className={`relative w-12 h-6 rounded-full transition-colors ${
              darkMode ? "bg-blue-600" : "bg-gray-300"
            }`}
            aria-label="Toggle dark mode"
          >
            <span
              className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                darkMode ? "translate-x-6" : ""
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}

export default AppearanceSettings;

