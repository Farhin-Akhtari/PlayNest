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

export const getWatchHistory = async () => {
  const response = await api.get("/users/watch-history");
  return response.data;
};

export const removeFromWatchHistory = async (videoId) => {
  const response = await api.delete(`/users/watch-history/${videoId}`);
  return response.data;
};