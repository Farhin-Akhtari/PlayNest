import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { getAllVideos } from "../services/videoService";
import VideoCard from "../components/VideoCard/VideoCard";
import CategoryBar from "../components/CategoryBar/CategoryBar";

function Home() {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";

  const [videos, setVideos] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await getAllVideos(searchQuery);

        setVideos(response);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch videos");
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [searchQuery]);

  if (loading) {
    return (
      <h2 className="text-center text-xl mt-10 text-gray-900 dark:text-white">
        Loading...
      </h2>
    );
  }

  if (error) {
    return (
      <h2 className="text-center text-red-500 text-xl mt-10">
        {error}
      </h2>
    );
  }

  const filteredVideos =
    selectedCategory === "All"
      ? videos
      : videos.filter(
          (video) => video.category === selectedCategory
        );

  return (
    <div>

      {/* Category bar */}
      <CategoryBar
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      {searchQuery && (
        <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">
          Search results for: "{searchQuery}"
        </h2>
      )}

      {/* Video grid */}
      <div className="grid gap-8 grid-cols-[repeat(auto-fill,minmax(320px,1fr))]">
        {filteredVideos.length > 0 ? (
          filteredVideos.map((video) => (
            <VideoCard
              key={video._id}
              videoId={video._id}
              title={video.title}
              channel={video.owner?.username}
              views={video.views}
              thumbnail={video.thumbnail?.url}
              duration={video.duration}
            />
          ))
        ) : (
          <p className="text-gray-500 dark:text-gray-400">
            No videos found.
          </p>
        )}
      </div>

    </div>
  );
}

export default Home;