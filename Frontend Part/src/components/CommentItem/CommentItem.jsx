function CommentItem({
  comment,
  loggedInUser,
  video,
  onLike,
  onEdit,
  onDelete,
  editingCommentId,
  editingText,
  setEditingText,
  onSaveEdit,
  onCancelEdit,
}) {
 const isCommentOwner =
  comment.owner?._id?.toString() === loggedInUser?._id?.toString();

const isVideoOwner =
  video?.owner?._id?.toString() === loggedInUser?._id?.toString();

  const isEditing = editingCommentId === comment._id;

  return (
    <div className="flex gap-3">
      {/* Avatar */}
      {comment.owner?.avatar?.url ? (
        <img
          src={comment.owner.avatar.url}
          alt={comment.owner.username}
          className="w-10 h-10 rounded-full object-cover"
        />
      ) : (
        <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white flex items-center justify-center font-semibold">
          {comment.owner?.username?.[0]?.toUpperCase()}
        </div>
      )}

      <div className="flex-1">
        {/* Username */}
        <p className="font-semibold text-gray-900 dark:text-white">
          {comment.owner?.username}
        </p>

        {/* EDIT MODE */}
        {isEditing ? (
          <div className="mt-2">
            <input
              value={editingText}
              onChange={(e) => setEditingText(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg p-2"
            />

            <div className="flex gap-2 mt-2">
              <button
                onClick={() => onSaveEdit(comment._id)}
                className="text-sm bg-black text-white dark:bg-white dark:text-black px-3 py-1 rounded-full"
              >
                Save
              </button>

              <button
                onClick={onCancelEdit}
                className="text-sm bg-gray-200 text-black dark:bg-gray-800 dark:text-white px-3 py-1 rounded-full"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Normal comment */}
            <p className="text-gray-700 dark:text-gray-300">
              {comment.content}
            </p>

            {/* Like */}
            <button
              onClick={() => onLike(comment._id)}
              className={`text-sm mt-1 ${
                comment.isLiked
                  ? "text-red-500"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              {comment.isLiked ? "❤️" : "♡"}{" "}
              {comment.likesCount}
            </button>

            {/* Edit / Delete */}
            <div className="flex gap-3 mt-2">
              {isCommentOwner && (
                <button
                  onClick={() => onEdit(comment)}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Edit
                </button>
              )}

              {(isCommentOwner || isVideoOwner) && (
                <button
                  onClick={() => onDelete(comment._id)}
                  className="text-sm text-red-500 hover:underline"
                >
                  Delete
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default CommentItem;