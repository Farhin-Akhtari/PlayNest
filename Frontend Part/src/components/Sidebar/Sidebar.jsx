import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MdHome,
  MdSubscriptions,
  MdHistory,
  MdWatchLater,
  MdVideoLibrary,
  MdPlaylistPlay,
  MdNotifications,
} from "react-icons/md";
import { SiYoutubeshorts } from "react-icons/si";
import { AiFillLike } from "react-icons/ai";
import { FiUpload, FiX } from "react-icons/fi";
import { FaUser } from "react-icons/fa";

function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const navigate = useNavigate();

  const [activeMenu, setActiveMenu] = useState("Home");

  const user = JSON.parse(localStorage.getItem("user"));

  const mainMenuItems = [
    { name: "Home", icon: <MdHome />, path: "/" },
    { name: "Shorts", icon: <SiYoutubeshorts />, path: "/shorts" },
    {
      name: "Subscriptions",
      icon: <MdSubscriptions />,
      path: "/subscriptions",
    },
  ];

  const yourMenuItems = [
    {
      name: "Your Channel",
      icon: <FaUser />,
      path: user ? `/channel/${user.username}` : "/login",
    },
    {
      name: "My Videos",
      icon: <MdVideoLibrary />,
      path: "/my-videos",
    },
    {
      name: "Upload Video",
      icon: <FiUpload />,
      path: "/upload",
    },
  ];

  const otherMenuItems = [
    {
     name: "Notifications",
     icon: <MdNotifications />,
     path: "/notifications",
    },
    { name: "History", 
      icon: <MdHistory />, 
      path: "/history" 
    },
    {
      name: "Watch Later",
      icon: <MdWatchLater />,
      path: "/watch-later",
    },
    {
    name: "Playlists",
    icon: <MdPlaylistPlay />,
    path: "/playlists",
    },
    {
      name: "Liked Videos",
      icon: <AiFillLike />,
      path: "/liked-videos",
    },
  ];

  const handleNavigation = (item) => {
  setActiveMenu(item.name);
  navigate(item.path);
  setSidebarOpen(false);
 };

  const renderMenuItems = (items) => {
    return items.map((item) => (
      <li
        key={item.name}
        onClick={() => handleNavigation(item)}
        className={`flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-all duration-200 ${
          activeMenu === item.name
            ? "bg-gray-200 dark:bg-gray-700 font-semibold"
            : "hover:bg-gray-100 dark:hover:bg-gray-800"
        }`}
      >
        <span className="text-xl">{item.icon}</span>
        <span>{item.name}</span>
      </li>
    ));
  };

  return (
    <aside
     className={`fixed top-[100px] md:top-16 left-0 w-64 h-[calc(100vh-112px)] md:h-[calc(100vh-64px)] bg-white dark:bg-gray-900 text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-700 p-4 overflow-y-auto z-40 transform transition-transform duration-300 ${
     sidebarOpen ? "translate-x-0" : "-translate-x-full"
    } md:translate-x-0`}
   >
  <div className="flex justify-end md:hidden mb-3">
   <button
    onClick={() => setSidebarOpen(false)}
    className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
   >
    <FiX size={24} />
   </button>
  </div>
      
      {/* Main Menu */}
      <ul className="space-y-2">
        {renderMenuItems(mainMenuItems)}
      </ul>

      <hr className="my-4 border-gray-200 dark:border-gray-700" />

      {/* You */}
        <h2 className="px-3 mb-2 text-sm font-semibold text-gray-500 dark:text-gray-400">
        You
      </h2>

      <ul className="space-y-2">
        {renderMenuItems(yourMenuItems)}
      </ul>

      <hr className="my-4 border-gray-200 dark:border-gray-700" />

      {/* Other */}
      <ul className="space-y-2">
        {renderMenuItems(otherMenuItems)}
      </ul>

    </aside>
  );
}

export default Sidebar;
