import { useEffect, useState } from "react";
import { getWatchLater } from "../services/watchLaterService";
import VideoCard from "../components/VideoCard/VideoCard";

function WatchLater() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWatchLater = async () => {
      try {
        const response = await getWatchLater();
        setVideos(response.data);
        
      } catch (error) {
        console.error("Failed to fetch watch later videos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWatchLater();
  }, []);

  if (loading) {
    return (
      <h2 className="text-center text-xl mt-10 text-gray-900 dark:text-white">
        Loading watch later videos...
      </h2>
    );
  }

  if (videos.length === 0) {
    return (
      <h2 className="text-center text-xl mt-10 text-gray-900 dark:text-white">
        You haven't saved any videos for later.
      </h2>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        Watch Later
      </h1>

      <div className="grid gap-8 grid-cols-[repeat(auto-fill,minmax(320px,1fr))]">
        {videos.map((video) => (
          <VideoCard
            key={video._id}
            videoId={video._id}
            title={video.title}
            channel={video.owner?.username}
            views={video.views}
            thumbnail={video.thumbnail?.url}
            duration={video.duration}
          />
        ))}
      </div>
    </div>
  );
}

export default WatchLater;
