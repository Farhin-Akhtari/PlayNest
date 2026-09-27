import { useEffect, useState } from "react";
import { getNotificationPreferences, updateNotificationPreferences } from "../services/authService";

function NotificationSettings() {
const [newSubscribers, setNewSubscribers] = useState(true);
const [likes, setLikes] = useState(true);
const [comments, setComments] = useState(true);
const [replies, setReplies] = useState(true);

const [loading, setLoading] = useState(true);
const [saving, setSaving] = useState(false);

useEffect(() => {
  const fetchPreferences = async () => {
    try {
      const response = await getNotificationPreferences();

      const preferences = response.data;

      setNewSubscribers(preferences.newSubscribers);
      setLikes(preferences.likes);
      setComments(preferences.comments);
      setReplies(preferences.replies);
    } catch (error) {
      console.error("Failed to fetch notification preferences:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchPreferences();
}, []);

const savePreferences = async (updatedPreferences) => {
  try {
    setSaving(true);

    const response = await updateNotificationPreferences(
      updatedPreferences
    );

    const preferences = response.data;

    setNewSubscribers(preferences.newSubscribers);
    setLikes(preferences.likes);
    setComments(preferences.comments);
    setReplies(preferences.replies);
  } catch (error) {
    console.error("Failed to update notification preferences:", error);
  } finally {
    setSaving(false);
  }
};

if (loading) {
  return (
    <div className="max-w-3xl mx-auto">
      <p className="text-gray-500 dark:text-gray-400">
        Loading notification settings...
      </p>
    </div>
  );
}

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
        Notifications
      </h1>

      <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 space-y-8">

        {/* New Subscribers */}
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">
              New Subscribers
            </p>

            <p className="text-sm text-gray-500 dark:text-gray-400">
              Get notified when someone subscribes to your channel.
            </p>
          </div>

          <button
            type="button"
           onClick={() =>
            savePreferences({
            newSubscribers: !newSubscribers,
            likes,
            comments,
           replies
           })
          }
            className={`relative w-12 h-6 rounded-full transition-colors ${
              newSubscribers ? "bg-blue-600" : "bg-gray-300"
            }`}
            aria-label="Toggle new subscriber notifications"
          >
            <span
              className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                newSubscribers ? "translate-x-6" : ""
              }`}
            />
          </button>
        </div>

        {/* Likes */}
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">
              Likes
            </p>

            <p className="text-sm text-gray-500 dark:text-gray-400">
              Get notified when someone likes your content.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
             savePreferences({
              newSubscribers,
              likes: !likes,
              comments,
              replies
            })
            }
            className={`relative w-12 h-6 rounded-full transition-colors ${
              likes ? "bg-blue-600" : "bg-gray-300"
            }`}
            aria-label="Toggle like notifications"
          >
            <span
              className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                likes ? "translate-x-6" : ""
              }`}
            />
          </button>
        </div>

        {/* Comments */}
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">
              Comments
            </p>

            <p className="text-sm text-gray-500 dark:text-gray-400">
              Get notified when someone comments on your content.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              savePreferences({
                newSubscribers,
                likes,
                comments: !comments,
                replies
              })
            }
            className={`relative w-12 h-6 rounded-full transition-colors ${
              comments ? "bg-blue-600" : "bg-gray-300"
            }`}
            aria-label="Toggle comment notifications"
          >
            <span
              className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                comments ? "translate-x-6" : ""
              }`}
            />
          </button>
        </div>

        {/* Replies */}
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">
              Replies
            </p>

            <p className="text-sm text-gray-500 dark:text-gray-400">
              Get notified when someone replies to your comments.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              savePreferences({
                newSubscribers,
                likes,
                comments,
                replies: !replies
              })
            }
            className={`relative w-12 h-6 rounded-full transition-colors ${
              replies ? "bg-blue-600" : "bg-gray-300"
            }`}
            aria-label="Toggle reply notifications"
          >
            <span
              className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                replies ? "translate-x-6" : ""
              }`}
            />
          </button>
        </div>

      </div>
    </div>
  );
}

export default NotificationSettings;