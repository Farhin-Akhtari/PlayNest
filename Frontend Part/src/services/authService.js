import api from "./axios";

export const loginUser = async (credentials) => {
  const response = await api.post("/users/login", credentials);
  return response.data;
};

export const registerUser = async (formData) => {
  const response = await api.post("/users/register", formData);
  return response.data;
};

export const logoutUser = async () => {
  const response = await api.post("/users/logout");
  return response.data;
};

export const getUserChannelProfile = async (username) => {
  const response = await api.get(`/users/c/${username}`);
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get("/users/current-user");
  return response.data;
};

export const getWatchHistory = async () => {
  const response = await api.get("/users/watch-history");
  return response.data;
};

export const removeFromWatchHistory = async (videoId) => {
  const response = await api.delete(`/users/watch-history/${videoId}`);
  return response.data;
};

export const updateAccountDetails = async (data) => {
  const response = await api.patch("/users/update-account", data);
  return response.data;
};

export const updateAvatar = async (formData) => {
  const response = await api.patch("/users/avatar", formData);
  return response.data;
};

export const removeAvatar = async () => {
  const response = await api.delete("/users/avatar");
  return response.data;
};

export const updateCoverImage = async (formData) => {
  const response = await api.patch("/users/cover-image", formData);
  return response.data;
};

export const removeCoverImage = async () => {
  const response = await api.delete("/users/cover-image");
  return response.data;
};

export const changeCurrentPassword = async (data) => {
  const response = await api.post("/users/change-password", data);
  return response.data;
};

export const getNotificationPreferences = async () => {
  const response = await api.get("/users/notification-preferences");
  return response.data;
};

export const updateNotificationPreferences = async (preferences) => {
  const response = await api.patch("/users/notification-preferences", preferences);
  return response.data;
};