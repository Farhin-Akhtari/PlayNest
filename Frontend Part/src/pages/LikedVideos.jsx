import { useEffect, useState } from "react";
import { getLikedVideos } from "../services/likeService";
import VideoCard from "../components/VideoCard/VideoCard";

function LikedVideos() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLikedVideos = async () => {
      try {
        const response = await getLikedVideos();

        const likedVideos = response.data
          .map((item) => item.likedVideo)
          .filter(Boolean);

        setVideos(likedVideos);
      } catch (error) {
        console.error("Failed to fetch liked videos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLikedVideos();
  }, []);

  if (loading) {
    return (
      <h2 className="text-center text-xl mt-10 text-gray-900 dark:text-white">
        Loading liked videos...
      </h2>
    );
  }

  if (videos.length === 0) {
    return (
      <h2 className="text-center text-xl mt-10 text-gray-900 dark:text-white">
        You haven't liked any videos yet.
      </h2>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        Liked Videos
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

export default LikedVideos;