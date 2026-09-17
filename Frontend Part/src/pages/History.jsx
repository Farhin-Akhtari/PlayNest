import { useEffect, useState } from "react";
import { getWatchHistory, removeFromWatchHistory } from "../services/authService";
import VideoCard from "../components/VideoCard/VideoCard";

function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleRemoveVideo = async (videoId) => {
    try {
      await removeFromWatchHistory(videoId);

      setHistory((prev) =>
        prev.filter((video) => video._id !== videoId)
      );
    } catch (error) {
      console.error("Failed to remove video from history:", error);
    }
  };

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await getWatchHistory();

        setHistory(response.data || []);
      } catch (error) {
        console.error("Failed to fetch watch history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) {
    return (
      <h2 className="text-center text-xl mt-10 text-gray-900 dark:text-white">
        Loading history...
      </h2>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
        History
      </h1>

      {history.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">
          You haven't watched any videos yet.
        </p>
      ) : (
        <div className="grid gap-8 grid-cols-[repeat(auto-fill,minmax(320px,1fr))]">
          {history.map((video) => (
            <div key={video._id}>
              <VideoCard
                videoId={video._id}
                title={video.title}
                channel={video.owner?.username}
                views={video.views}
                thumbnail={video.thumbnail?.url}
                duration={video.duration}
              />

              <button
                onClick={() => handleRemoveVideo(video._id)}
                className="mt-2 text-sm text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:underline transition"
              >
                Remove from history
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default History;