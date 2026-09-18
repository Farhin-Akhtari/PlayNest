import { useState, useEffect, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiClock, FiX, FiBell, FiSun, FiMoon, FiMenu } from "react-icons/fi";
import { logoutUser } from "../../services/authService.js";
import { getSearchHistory, addSearchHistory, deleteSearchHistory, clearSearchHistory } from "../../services/searchHistory.js";
import {getAllVideos} from "../../services/videoService.js"
import socket from "../../services/socketService.js";
import { NotificationContext } from "../../context/NotificationContext.jsx";
import {useTheme} from "../../context/ThemeContext.jsx";

const getTimeAgo = (date) => {
  const seconds = Math.floor(
    (new Date() - new Date(date)) / 1000
  );

  if (seconds < 60) {
    return "Just now";
  }

  const minutes = Math.floor(seconds / 60);

  if (minutes < 60) {
    return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  }

  const days = Math.floor(hours / 24);

  if (days < 7) {
    return `${days} day${days > 1 ? "s" : ""} ago`;
  }

  return new Date(date).toLocaleDateString();
};

function Navbar({onMenuClick}) {
  const navigate = useNavigate();
  const searchRef = useRef(null);

  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user"))
  );
  const { darkMode, toggleTheme } = useTheme();

  const [search, setSearch] = useState("");
  const [searchHistory, setSearchHistory] = useState([]);
  const {notifications, setNotifications, markAsRead} = useContext(NotificationContext);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSearchHistory, setShowSearchHistory] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  const [showMenu, setShowMenu] = useState(false);
  const [avatarError, setAvatarError] = useState(false);

  useEffect(() => {
    const fetchSearchHistory = async () => {
      if(!user){
        return;
      }
      try {
        const response = await getSearchHistory();
        setSearchHistory(response.data);
       
      }catch(error){
        console.error("Failed to fetch search history:", error);
      }
    };
    fetchSearchHistory();
  }, [user])

  useEffect(() => {
  const handleClickOutside = (event) => {
    if (searchRef.current && !searchRef.current.contains(event.target)) {
      setShowSearchHistory(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);

useEffect(() => {
  const fetchSuggestions = async () => {
    if (!search.trim()) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await getAllVideos(search.trim());

      setSuggestions(response || []);
    } catch (error) {
      console.error("Failed to fetch suggestions:", error);
      setSuggestions([]);
    }
  };

  const timer = setTimeout(() => {
    fetchSuggestions();
  }, 300);

  return () => clearTimeout(timer);
}, [search]);

//SET SOCKET USEEFFECT
useEffect(() => {
  if(!user?._id) return;

  socket.on("connect", () => {
    socket.emit("join", user._id);

  });
  return () => {
    socket.off("connect");
  };
}, [user]);

//SET HANDLE AND DELETE NEW NOTIFICATION USEEFFECT
useEffect(() => {
  const handleNewNotification = (notification) => {
    setNotifications((prev) => [
      notification,
      ...prev
    ]);
  };

  const handleNotificationDeleted = (notificationId) => {

    setNotifications((prev) =>
      prev.filter(
        (notification) => notification._id !== notificationId
      )
    );
  };

  socket.on("newNotification", handleNewNotification);
  socket.on("notificationDeleted", handleNotificationDeleted);

  return () => {
    socket.off("newNotification", handleNewNotification);
    socket.off("notificationDeleted", handleNotificationDeleted);
  };
}, []);

const handleSearch = async () => {
  if (!search.trim()) return;

  const trimmedSearch = search.trim();

  try {
    const response = await addSearchHistory(trimmedSearch);

    setSearchHistory((prev) => [response.data, ...prev]);

    setShowSearchHistory(false);

    navigate(`/?search=${encodeURIComponent(trimmedSearch)}`);
  } catch (error) {
    console.error("Failed to save search history:", error);

    setShowSearchHistory(false);

    navigate(`/?search=${encodeURIComponent(trimmedSearch)}`);
  }
};

const handleHistoryClick = (query) => {
  setSearch(query);
  setShowSearchHistory(false);

  navigate(`/?search=${encodeURIComponent(query)}`);
};

const handleDeleteHistory = async (searchHistoryId) => {
  try {
    await deleteSearchHistory(searchHistoryId);

    setSearchHistory((prev) =>
      prev.filter((item) => item._id !== searchHistoryId)
    );
  } catch (error) {
    console.error("Failed to delete search history:", error);
  }
};

const handleClearHistory = async () => {
  try {
    await clearSearchHistory();

    setSearchHistory([])
  } catch (error) {
    console.error("Failed to clear search history:", error);
  }
};

const handleNotificationClick = async (notification) => {
  try {
    await markAsRead(notification._id);

    if (
      notification.type === "comment" ||
      notification.type === "like"
    ) {
      if (notification.video?._id) {
        navigate(`/videos/${notification.video._id}`);
      }
    }

    if (notification.type === "subscribe") {
      if (notification.sender?.username) {
        navigate(`/channel/${notification.sender.username}`);
      }
    }

    setShowNotifications(false);

  } catch (error) {
    console.error("Failed to handle notification:", error);
  }
};

 const handleLogout = async () => {
  try {
    await logoutUser();

    localStorage.removeItem("user");

    setUser(null);
    setShowMenu(false);

    navigate("/login");
  } catch (err) {
    console.error("Logout failed:", err);
  }
};

const highlightMatch = (title) => {
  if (!search.trim()) return title;

  const searchText = search.trim();
  const index = title.toLowerCase().indexOf(searchText.toLowerCase());

  if (index === -1) return title;

  return (
    <>
      {title.slice(0, index)}
      <span className="font-bold text-black dark:text-white">
        {title.slice(index, index + searchText.length)}
      </span>
      {title.slice(index + searchText.length)}
    </>
  );
};

const unreadCount = notifications.filter(
  (notification) => !notification.isRead
).length;

  return (
    <nav className="sticky top-0 z-50 w-full px-3 md:px-6 py-3 border-b bg-white dark:bg-gray-900 dark:border-gray-700">
      <div className="flex flex-wrap items-center gap-2 md:justify-between">

        {/* Logo */}
 <div className="flex items-center gap-1 shrink-0">
  <button
    onClick={onMenuClick}
    className="md:hidden p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
  >
    <FiMenu size={24} />
  </button>

  <h1 className="text-2xl md:text-3xl font-bold text-red-600 cursor-pointer">
    PlayNest
  </h1>
</div>

        {/* Search */}
       <div
  ref={searchRef}
  className="relative order-3 w-full max-w-none md:order-none md:flex-1 md:min-w-0 md:max-w-[450px] mx-0 md:mx-0"
>
        <div className="flex items-center">
          <input
            type="text"
            placeholder="Search videos..."
            value={search}
            onFocus={() => setShowSearchHistory(true)}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
             if (e.key === "Enter") {
               handleSearch();
              }
            }}
            className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-l-full px-4 py-2 w-full outline-none"
          />

         <button
            onClick={handleSearch}
            className="bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 px-4 py-3 rounded-r-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          >
           <FiSearch />
          </button>
        </div>

    {showSearchHistory && (
  <div className="absolute top-full left-0 w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg mt-2 z-50 overflow-hidden">

    {/* Video Suggestions */}
    {search.trim() && suggestions.length > 0 && (
      <div className="py-2">
        {suggestions.slice(0, 5).map((video) => (
          <div
            key={video._id}
            onClick={() => {
              setSearch(video.title);
              setShowSearchHistory(false);

              navigate(
                `/videos/${video._id}`
              );
            }}
           className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition"
          >
            {/* Thumbnail */}
            <img
              src={video.thumbnail?.url}
              alt={video.title}
              className="w-12 h-8 object-cover rounded"
            />

            {/* Video title */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {highlightMatch(video.title)}
              </p>

              {video.category && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {video.category}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    )}

    {/* Search History */}
    {!search.trim() && searchHistory.length > 0 && (
      <div className="py-2">
        {searchHistory.map((item) => (
          <div
            key={item._id}
            onClick={() => handleHistoryClick(item.query)}
            className="flex items-center justify-between px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition"
          >
            <div className="flex items-center gap-3 min-w-0">
              <FiClock className="text-gray-400 flex-shrink-0" />

              <span className="text-sm text-gray-700 dark:text-gray-200 truncate">
                {item.query}
              </span>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteHistory(item._id);
              }}
             className="p-1.5 rounded-full text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            >
              <FiX size={16} />
            </button>
          </div>
        ))}
      </div>
    )}

    {/* Clear All */}
    {!search.trim() && searchHistory.length > 0 && (
     <div className="border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleClearHistory();
          }}
         className="w-full px-4 py-3 text-left text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
        >
          Clear all search history
        </button>
      </div>
    )}

  </div>
)}
    </div>

  <div className="flex items-center gap-1 md:gap-7 shrink-0">

  {/* Notifications */}
   <div className="relative">
    <button
     onClick={() => setShowNotifications(!showNotifications)}
      className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
    >
     <FiBell size={22} />

    {unreadCount > 0 && (
     <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center">
      {unreadCount}
    </span>
   )}
   </button>
  {showNotifications && (
  <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-50 overflow-hidden">

    <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
      <h3 className="font-semibold">
        Notifications
      </h3>
    </div>

    {notifications.length === 0 ? (
      <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
        No notifications
      </div>
    ) : (
      <div className="max-h-96 overflow-y-auto">

        {notifications.map((notification) => (
          <div
            key={notification._id}
            onClick={() => handleNotificationClick(notification)}
            className={`px-4 py-3 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer ${
              !notification.isRead ? "bg-blue-50 dark:bg-blue-900/30" : ""
           }`}
          >
      <div className="flex gap-3">

  {/* Sender Avatar */}
  <img
    src={notification.sender?.avatar}
    alt={notification.sender?.username}
    className="w-9 h-9 rounded-full object-cover"
  />

  <div className="flex-1">

    {/* Comment Notification */}
    {notification.type === "comment" && (
      <>
        <p className="text-sm text-gray-700 dark:text-gray-200">
          <span className="font-semibold">
            {notification.sender?.username}
          </span>{" "}
          commented on your video{" "}
          <span className="font-semibold">
            "{notification.video?.title}"
          </span>
        </p>

        {/* Actual Comment */}
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          "{notification.comment?.content}"
        </p>
      </>
    )}

    {/* Like Notification */}
    {notification.type === "like" && (
      <p className="text-sm text-gray-700 dark:text-gray-200">
        <span className="font-semibold">
          {notification.sender?.username}
        </span>{" "}
        liked your video{" "}
        <span className="font-semibold">
          "{notification.video?.title}"
        </span>
      </p>
    )}

    {/* Subscribe Notification */}
    {notification.type === "subscribe" && (
      <p className="text-sm text-gray-700 dark:text-gray-200">
        <span className="font-semibold">
          {notification.sender?.username}
        </span>{" "}
        subscribed to your channel.
      </p>
    )}

    {/* New indicator */}
    {!notification.isRead && (
      <p className="text-xs text-blue-500 mt-1">
        New
      </p>
    )}

    <p className="text-xs text-gray-400 mt-2">
     {getTimeAgo(notification.createdAt)}
    </p>

  </div>

</div>

      </div>
    ))}

    </div>
    )}
  </div>
)}
  </div>

  {/* User */}
   <div className="relative">

   {user ? (
     <>
    {/* Avatar */}
     <button
       onClick={() => setShowMenu(!showMenu)}
         className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-700 dark:text-white flex items-center justify-center font-semibold overflow-hidden"
      >
       {user.avatar && !avatarError ? (
        <img
          src={user.avatar}
          alt={user.username}
          className="w-full h-full object-cover"
          onError={() => setAvatarError(true)}
        />
        ) : (
         user.username?.charAt(0).toUpperCase()
        )}
      </button>

{/* Logout menu */}
  {showMenu && (
   <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-2 z-50">
      <p className="px-3 py-2 text-sm font-semibold">
        {user.username}
          </p>

  {/* My Channel */}
    <button
      onClick={() => {
       navigate(`/channel/${user.username}`);
       setShowMenu(false);
      }}
      className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
    >
       My Channel
    </button>
 
{/* Upload Video*/}
  <button
    onClick={() => {
     navigate("/upload");
     setShowMenu(false);
    }}
     className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
  >
    Upload Video
  </button>

  <button
    onClick={() => {
     navigate("/my-videos");
     setShowMenu(false);
    }}
       className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
  >
    My Videos
  </button>

 {/* Theme Toggle Button */}
  <button
    onClick={toggleTheme}
   className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
  >
    {darkMode ? (
  <>
    <FiSun className="inline mr-2" />
    Light Mode
  </>
) : (
  <>
    <FiMoon className="inline mr-2" />
    Dark Mode
  </>
)}
  </button>

  <button
    onClick={handleLogout}
    className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-red-500"
  >
    Logout
  </button>

   </div>
   )}
  </>
  ) : (
  <button
    onClick={() => navigate("/login")}
    className="px-5 py-2 bg-black dark:bg-white text-white dark:text-black rounded-full hover:bg-gray-800 dark:hover:bg-gray-200 transition"
  >
    Login
  </button>
  )}

    </div>
    </div>

      </div>
    </nav>
  );
}

export default Navbar;