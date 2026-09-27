import { createContext, useEffect, useState } from "react";
import { getUserNotification, markNotificationAsRead } from "../services/notificationService.js";
import socket from "../services/socketService.js"

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const user = localStorage.getItem("user");

useEffect(() => {
  if (!user) {
    return;
  }

  const userData = JSON.parse(user);

  const fetchNotifications = async () => {
    try {
      const response = await getUserNotification();
      setNotifications(response.data || []);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };

  fetchNotifications();

  socket.emit("join", userData._id);

  const handleNewNotification = (notification) => {
  setNotifications((prev) => {
    const alreadyExists = prev.some(
      (item) => item._id === notification._id
    );

    if (alreadyExists) {
      return prev;
    }

    return [notification, ...prev];
  });
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
}, [user]);

  const markAsRead = async (notificationId) => {
  try {
    await markNotificationAsRead(notificationId);

    setNotifications((prev) =>
      prev.filter((notification) => notification._id !== notificationId)
    );
  } catch (error) {
    console.error("Failed to mark notification as read:", error);
  }
};

  return (
    <NotificationContext.Provider
      value={{ notifications, setNotifications, markAsRead }}
    >
      {children}
    </NotificationContext.Provider>
  );
};