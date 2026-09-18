function CommentForm({
  commentText,
  setCommentText,
  onComment,
  showLoginMessage,
  loginMessage,
}) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-6 w-full">
      <input
        type="text"
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
        placeholder="Add a comment..."
      className="flex-1 min-w-0 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-full px-4 py-2 outline-none transition-all duration-200 focus:shadow-md dark:focus:shadow-gray-800"
      />

      <div className="relative w-full sm:w-auto">
  <button
    onClick={onComment}
    className="px-5 py-2 bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 rounded-full font-semibold w-full sm:w-auto transition-all duration-200 active:scale-95"
  >
    Comment
  </button>

  {showLoginMessage && loginMessage.includes("comment on this video") && (
    <div className="absolute top-full right-0 mt-2 z-50 w-max max-w-xs bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-lg rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white">
      {loginMessage}
    </div>
  )}
</div>
    </div>
  );
}

export default CommentForm;