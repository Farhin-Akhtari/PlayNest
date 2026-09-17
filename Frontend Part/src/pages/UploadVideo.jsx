import { useState } from "react";
import { publishVideo } from "../services/videoService";
import { useNavigate } from "react-router-dom";

function UploadVideo() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Programming");
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);

  const categories = [
    "Music",
    "Gaming",
    "React",
    "Programming",
    "Live",
    "AI",
    "News",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append("title", title);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("videoFile", videoFile);
      formData.append("thumbnail", thumbnail);

      const response = await publishVideo(formData);
       navigate("/my-videos");

    } catch (error) {
      console.error("Failed to publish video:", error);
    }
  };

  return (
  <div className="max-w-2xl mx-auto py-8 px-4 text-gray-900 dark:text-white">
    <h1 className="text-3xl font-bold mb-8">
      Upload Video
    </h1>

    <form onSubmit={handleSubmit} className="space-y-6">

      {/* Title */}
      <div>
        <label className="block font-semibold mb-2">
          Title
        </label>

        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter video title"
          className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block font-semibold mb-2">
          Description
        </label>

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter video description"
          rows="5"
          className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
        />
      </div>

      {/* Category */}
      <div>
        <label className="block font-semibold mb-2">
          Category
        </label>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
         className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg px-4 py-3 outline-none"
        >
          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      {/* Video File */}
      <div>
        <label className="block font-semibold mb-2">
          Video
        </label>

        <input
          type="file"
          accept="video/*"
          onChange={(e) => setVideoFile(e.target.files[0])}
          className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg p-3"
        />
      </div>

      {/* Thumbnail */}
      <div>
        <label className="block font-semibold mb-2">
          Thumbnail
        </label>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setThumbnail(e.target.files[0])}
          className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg p-3"
        />
      </div>

      {/* Publish */}
      <button
        type="submit"
        className="w-full bg-black dark:bg-white text-white dark:text-black py-3 rounded-lg font-semibold hover:bg-gray-800 dark:hover:bg-gray-200 transition"
      >
        Publish Video
      </button>

    </form>
  </div>
);
}

export default UploadVideo;