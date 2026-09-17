import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getPlaylistById,
  removeVideoFromPlaylist,
  updatePlaylist,
  deletePlaylist,
} from "../services/playlistService";
import VideoCard from "../components/VideoCard/VideoCard";

function PlaylistDetails() {
  const { playlistId } = useParams();
  const navigate = useNavigate();

  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showEditForm, setShowEditForm] = useState(false);

  const [editFormData, setEditFormData] = useState({
    name: "",
    description: "",
  });

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        const response = await getPlaylistById(playlistId);

        setPlaylist(response.data[0]);
      } catch (error) {
        console.error("Failed to fetch playlist:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylist();
  }, [playlistId]);

  // ADD REMOVE VIDEO HANDLER
  const handleRemoveVideo = async (videoId) => {
    try {
      const response = await removeVideoFromPlaylist(
        playlistId,
        videoId
      );

      setPlaylist((prev) => ({
        ...prev,
        videoDetails: prev.videoDetails.filter(
          (video) => video._id !== videoId
        ),
      }));
    } catch (error) {
      console.error("Failed to remove video:", error);
    }
  };

  // ADD HANDLE EDIT PLAYLIST
  const handleUpdatePlaylist = async (e) => {
    e.preventDefault();

    try {
      const response = await updatePlaylist(
        playlistId,
        editFormData
      );

      setPlaylist((prev) => ({
        ...prev,
        name: response.data.name,
        description: response.data.description,
      }));

      setShowEditForm(false);
    } catch (error) {
      console.error("Failed to update playlist:", error);
    }
  };

  // ADD HANDLE DELETE PLAYLIST
  const handleDeletePlaylist = async () => {
    try {
      const response = await deletePlaylist(playlistId);

      // After deletion, go back to playlists page
      navigate("/playlists");
    } catch (error) {
      console.error("Failed to delete playlist:", error);
    }
  };

  if (loading) {
    return (
      <h2 className="text-center text-xl mt-10 text-gray-900 dark:text-white">
        Loading playlist...
      </h2>
    );
  }

  if (!playlist) {
    return (
      <h2 className="text-center text-xl mt-10 text-gray-900 dark:text-white">
        Playlist not found.
      </h2>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {playlist.name}
        </h1>

        <div className="flex gap-3">
          {/* Edit Playlist button */}
          <button
            onClick={() => {
              setEditFormData({
                name: playlist.name,
                description: playlist.description,
              });

              setShowEditForm(!showEditForm);
            }}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white font-medium hover:bg-gray-200 dark:hover:bg-gray-800 transition"
          >
            Edit Playlist
          </button>

          {/* Delete Playlist button */}
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white font-medium hover:bg-red-200 dark:hover:bg-red-900/40 hover:underline transition"
          >
            Delete Playlist
          </button>
        </div>
      </div>

      {showEditForm && (
        <form
          onSubmit={handleUpdatePlaylist}
          className="mt-6 p-6 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-xl"
        >
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Edit Playlist
          </h2>

          <input
            type="text"
            name="name"
            value={editFormData.name}
            onChange={(e) =>
              setEditFormData({
                ...editFormData,
                name: e.target.value,
              })
            }
            className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-lg px-4 py-2 mb-4"
            placeholder="Playlist name"
          />

          <textarea
            name="description"
            value={editFormData.description}
            onChange={(e) =>
              setEditFormData({
                ...editFormData,
                description: e.target.value,
              })
            }
            className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-lg px-4 py-2 mb-4"
            rows="3"
            placeholder="Playlist description"
          />

          <button
            type="submit"
            className="bg-black text-white dark:bg-white dark:text-black px-4 py-2 rounded-lg"
          >
            Save Changes
          </button>
        </form>
      )}

      {showDeleteConfirm && (
        <div className="mt-6 p-5 border border-red-200 dark:border-red-900 bg-white dark:bg-gray-900 rounded-xl">
          <p className="font-semibold text-gray-900 dark:text-white">
            Are you sure you want to delete this playlist?
          </p>

          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            This action cannot be undone.
          </p>

          <div className="flex gap-3 mt-4">
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              Cancel
            </button>

            <button
              onClick={handleDeletePlaylist}
              className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
            >
              Delete
            </button>
          </div>
        </div>
      )}

      <p className="text-gray-500 dark:text-gray-400 mt-2">
        {playlist.description}
      </p>

      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
        {playlist.videoDetails?.length || 0} videos
      </p>

      <div className="mt-8">
        {playlist.videoDetails?.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">
            This playlist doesn't have any videos yet.
          </p>
        ) : (
          <div className="grid gap-8 grid-cols-[repeat(auto-fill,minmax(320px,1fr))]">
            {playlist.videoDetails.map((video) => (
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
                  Remove from playlist
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default PlaylistDetails;