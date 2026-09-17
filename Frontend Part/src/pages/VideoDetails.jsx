import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { getVideoById } from "../services/videoService";
import { toggleSubscription } from "../services/subscriptionService";
import { toggleVideoLike, toggleCommentLike } from "../services/likeService";
import {
  getVideoComments,
  createComment,
  updateComment,
  deleteComment,
} from "../services/commentService";
import CommentItem from "../components/CommentItem/CommentItem";
import VideoPlayer from "../components/VideoPlayer/VideoPlayer";
import VideoInfo from "../components/VideoInfo/VideoInfo";
import ChannelInfo from "../components/ChannelInfo/ChannelInfo";
import VideoActions from "../components/VideoActions/VideoActions";
import CommentForm from "../components/CommentForm/CommentForm";
import { toggleWatchLater } from "../services/watchLaterService";
import {
  getUserPlaylists,
  addVideoToPlaylist,
} from "../services/playlistService";

function VideoDetails() {
  const { videoId } = useParams();

  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [subscribed, setSubscribed] = useState(false);
  const [subscribersCount, setSubscribersCount] = useState(0);

  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingText, setEditingText] = useState("");

  const [watchLater, setWatchLater] = useState(false);
  const [playlists, setPlaylists] = useState([]);
  const [showPlaylistMenu, setShowPlaylistMenu] = useState(false);
  const [playlistMessage, setPlaylistMessage] = useState("");
  const [playlistMessageType, setPlaylistMessageType] = useState("");

  // for login
  const loggedInUser = JSON.parse(localStorage.getItem("user"));

  const fetchedVideoId = useRef(null);

  // for video fetch
  useEffect(() => {
    if (fetchedVideoId.current === videoId) return;

    fetchedVideoId.current = videoId;

    const fetchVideo = async () => {
      try {
        const response = await getVideoById(videoId);

        setVideo(response.data);

        setSubscribed(response.data.owner?.isSubscribed || false);
        setSubscribersCount(
          response.data.owner?.subscribersCount || 0
        );

        setLiked(response.data.isLiked || false);
        setLikesCount(response.data.likesCount || 0);

        setWatchLater(response.data.isWatchLater || false);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch video");
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();
  }, [videoId]);

  // for playlist fetch
  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));

        if (!user?._id) return;

        const response = await getUserPlaylists(user._id);

        setPlaylists(response.data);
      } catch (err) {
        console.error("Failed to fetch playlists:", err);
      }
    };

    fetchPlaylists();
  }, []);

  // For comments fetch
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await getVideoComments(videoId);

        setComments(response.data.docs);
      } catch (err) {
        console.error("Failed to fetch comments:", err);
      } finally {
        setCommentsLoading(false);
      }
    };

    fetchComments();
  }, [videoId]);

  // ADD THE SUBSCRIBE BUTTON HANDLER HERE
  const handleSubscribe = async () => {
    try {
      const response = await toggleSubscription(video.owner._id);

      const isNowSubscribed = response.data.subscribed;

      setSubscribed(isNowSubscribed);

      setSubscribersCount((prev) =>
        isNowSubscribed ? prev + 1 : prev - 1
      );
    } catch (err) {
      console.error("Subscription failed:", err);
    }
  };

  // ADD LIKE BUTTON HANDLER
  const handleLike = async () => {
    try {
      const response = await toggleVideoLike(videoId);

      const isNowLiked = response.data.liked;

      setLiked(isNowLiked);

      setLikesCount((prev) =>
        isNowLiked ? prev + 1 : prev - 1
      );
    } catch (err) {
      console.error("Like failed:", err);
    }
  };

  // ADD CREATE COMMENT HANDLER
  const handleComment = async () => {
    if (!commentText.trim()) return;

    try {
      const response = await createComment(videoId, commentText);

      setComments((prev) => [
        {
          ...response.data,
          likesCount: 0,
          isLiked: false,
        },
        ...prev,
      ]);

      setCommentText("");
    } catch (err) {
      console.error("Failed to create comment:", err);
    }
  };

  // ADD COMMENT LIKE
  const handleCommentLike = async (commentId) => {
    try {
      const response = await toggleCommentLike(commentId);

      const isNowLiked = response.data.liked;

      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment._id === commentId
            ? {
                ...comment,
                isLiked: isNowLiked,
                likesCount: isNowLiked
                  ? comment.likesCount + 1
                  : comment.likesCount - 1,
              }
            : comment
        )
      );
    } catch (err) {
      console.error("Comment like failed:", err);
    }
  };

  // ADD EDIT COMMENT HANDLER
  const handleEditComment = async (commentId) => {
    if (!editingText.trim()) return;

    try {
      const response = await updateComment(
        commentId,
        editingText
      );

      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment._id === commentId
            ? {
                ...comment,
                content: response.data.content,
              }
            : comment
        )
      );

      setEditingCommentId(null);
      setEditingText("");
    } catch (err) {
      console.error("Failed to update comment:", err);
    }
  };

  // ADD DELETE COMMENT HANDLER
  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(commentId);

      setComments((prevComments) =>
        prevComments.filter(
          (comment) => comment._id !== commentId
        )
      );
    } catch (err) {
      console.error("Failed to delete comment:", err);
    }
  };

  // ADD TOGGLE WATCH LATER
  const handleWatchLater = async () => {
    try {
      const response = await toggleWatchLater(videoId);

      const isSaved = response.data.watchLater;

      setWatchLater(isSaved);
    } catch (err) {
      console.error("Watch Later failed:", err);
    }
  };

  // ADD HANDLE PLAYLIST
  const handleAddToPlaylist = async (playlistId) => {
    try {
      const response = await addVideoToPlaylist(
        playlistId,
        videoId
      );

      setPlaylistMessage(
        "Video added to playlist successfully!"
      );
      setPlaylistMessageType("success");

      setShowPlaylistMenu(false);

      setTimeout(() => {
        setPlaylistMessage("");
      }, 3000);
    } catch (err) {
      console.error(
        "Failed to add video to playlist:",
        err
      );

      setPlaylistMessage(
        err.response?.data?.message ||
          "Failed to add video to playlist"
      );
      setPlaylistMessageType("error");

      setShowPlaylistMenu(false);

      setTimeout(() => {
        setPlaylistMessage("");
      }, 3000);
    }
  };

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

  return (
    <>
      {/* Video Player */}
      <VideoPlayer video={video} />

      {/* Video Information */}
      <VideoInfo video={video} />

      {/* Channel Section */}
      <div className="flex items-center justify-between mt-6">
        {/* Channel Info */}
        <ChannelInfo
          video={video}
          subscribersCount={subscribersCount}
        />

        {/* Subscribe Button */}
        <button
          onClick={handleSubscribe}
          className={`px-5 py-2 rounded-full font-semibold transition ${
            subscribed
              ? "bg-gray-200 text-black dark:bg-gray-800 dark:text-white"
              : "bg-black text-white dark:bg-white dark:text-black"
          }`}
        >
          {subscribed ? "Subscribed" : "Subscribe"}
        </button>
      </div>

      {/* Video Actions */}
      <VideoActions
        liked={liked}
        likesCount={likesCount}
        onLike={handleLike}
        watchLater={watchLater}
        onWatchLater={handleWatchLater}
      />

      {/* Playlist Section */}
      <div className="relative mt-4">
        <button
          onClick={() => setShowPlaylistMenu(!showPlaylistMenu)}
          className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        >
          + Add to Playlist
        </button>

        {showPlaylistMenu && (
          <div className="absolute left-0 mt-2 w-64 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-20">
            {playlists.length === 0 ? (
              <p className="p-4 text-gray-500 dark:text-gray-400">
                You don't have any playlists.
              </p>
            ) : (
              <div className="py-2">
                {playlists.map((playlist) => (
                  <button
                    key={playlist._id}
                    onClick={() =>
                      handleAddToPlaylist(playlist._id)
                    }
                    className="w-full text-left px-4 py-3 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-800 transition"
                  >
                    <p className="font-medium">
                      {playlist.name}
                    </p>

                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {playlist.videoCount} videos
                    </p>
                  </button>
                ))}
              </div>
            )}

            {playlistMessage && (
              <p
                className={`mt-3 text-sm ${
                  playlistMessageType === "success"
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                {playlistMessage}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Comment Section */}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
          Comments
        </h2>

        {/* Add Comment */}
        <CommentForm
          commentText={commentText}
          setCommentText={setCommentText}
          onComment={handleComment}
        />

        {/* Comments */}
        {commentsLoading ? (
          <p className="text-gray-700 dark:text-gray-300">
            Loading comments...
          </p>
        ) : comments.length === 0 ? (
          <p className="text-gray-700 dark:text-gray-300">
            No comments yet.
          </p>
        ) : (
          <div className="space-y-5">
            {comments.map((comment) => (
              <CommentItem
                key={comment._id}
                comment={comment}
                loggedInUser={loggedInUser}
                video={video}
                onLike={handleCommentLike}
                onEdit={(comment) => {
                  setEditingCommentId(comment._id);
                  setEditingText(comment.content);
                }}
                onDelete={handleDeleteComment}
                editingCommentId={editingCommentId}
                editingText={editingText}
                setEditingText={setEditingText}
                onSaveEdit={handleEditComment}
                onCancelEdit={() => {
                  setEditingCommentId(null);
                  setEditingText("");
                }}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default VideoDetails;