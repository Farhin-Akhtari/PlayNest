import { MdWatchLater } from "react-icons/md";

function VideoActions({
  liked,
  likesCount,
  onLike,
  likeLoading,
  watchLater,
  onWatchLater,
  watchLaterMessage,
  showLoginMessage,
  loginMessage,
}) {
  return (
    <div className="mt-4 flex items-center gap-3">

{/* Like */}
<div className="relative">
  <button
    onClick={onLike}
    disabled={likeLoading}
    className={`px-4 py-2 rounded-full font-semibold transition-all duration-200 active:scale-95 ${
      liked
        ? "bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
        : "bg-gray-200 text-black hover:bg-gray-300 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
    }`}
  >
    {liked ? "❤️ Liked" : "♡ Like"} {likesCount}
  </button>

  {showLoginMessage && loginMessage.includes("like this video") && (
    <div className="absolute top-full left-0 mt-2 z-50 w-max max-w-xs bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-lg rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white">
      {loginMessage}
    </div>
  )}
</div>

     
{/* Watch Later */}
<div className="relative">
  <button
    onClick={onWatchLater}
    className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold transition-all duration-200 active:scale-95 ${
      watchLater
        ? "bg-black text-white dark:bg-white dark:text-black"
        : "bg-gray-200 text-black dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
    }`}
  >
    <MdWatchLater className="text-xl" />
    {watchLater ? "Saved" : "Watch Later"}
  </button>

  {watchLaterMessage && (
    <div
      className={`absolute top-full left-0 mt-2 z-50 w-max max-w-xs rounded-xl border px-4 py-3 text-sm shadow-lg ${
       watchLaterMessage.startsWith("Video removed") ||
       watchLaterMessage.startsWith("Failed")
          ? "border-red-200 bg-white text-red-600 dark:border-red-800 dark:bg-gray-900 dark:text-red-400"
          : "border-gray-200 bg-white text-green-600 dark:border-gray-700 dark:bg-gray-900 dark:text-green-400"
      }`}
    >
      {watchLaterMessage}
    </div>
  )}
</div>


    </div>
  );
}

export default VideoActions;