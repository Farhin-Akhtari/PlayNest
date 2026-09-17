import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getUserPlaylists, createPlaylist } from "../services/playlistService";

function Playlist() {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreatePlaylist = async (e) => {
    e.preventDefault();

    try {
      const response = await createPlaylist(formData);

      setPlaylists((prev) => [...prev, response.data]);

      setFormData({
        name: "",
        description: "",
      });

      setShowForm(false);
    } catch (error) {
      console.error("Failed to create playlist:", error);
    }
  };

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));

        const response = await getUserPlaylists(user._id);

        setPlaylists(response.data);
      } catch (error) {
        console.error("Failed to fetch playlists:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylists();
  }, [location]);

  if (loading) {
    return (
      <h2 className="text-center text-xl mt-10 text-gray-900 dark:text-white">
        Loading playlists...
      </h2>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Playlists
        </h1>

        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-black text-white dark:bg-white dark:text-black px-4 py-2 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200"
        >
          + Create Playlist
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleCreatePlaylist}
          className="mb-8 p-6 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-xl"
        >
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Create New Playlist
          </h2>

          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Playlist name"
            className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-lg px-4 py-2 mb-4"
          />

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Playlist description"
            className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-lg px-4 py-2 mb-4"
            rows="3"
          />

          <button
            type="submit"
            className="bg-black text-white dark:bg-white dark:text-black px-4 py-2 rounded-lg"
          >
            Create
          </button>
        </form>
      )}

      {playlists.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">
          You haven't created any playlists yet.
        </p>
      ) : (
        <div className="grid gap-6 grid-cols-[repeat(auto-fill,minmax(280px,1fr))]">
          {playlists.map((playlist) => (
            <div
              key={playlist._id}
              onClick={() => navigate(`/playlists/${playlist._id}`)}
              className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-xl p-5 shadow-sm cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
            >
              <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                {playlist.name}
              </h2>

              <p className="text-gray-500 dark:text-gray-400 mb-4">
                {playlist.description}
              </p>

              <p className="text-sm text-gray-500 dark:text-gray-400">
                {playlist.videoCount} videos
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Playlist;