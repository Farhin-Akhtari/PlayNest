import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute/ProtectedRoute.jsx";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home";
import VideoDetails from "../pages/VideoDetails";
import Login from "../pages/Login";
import Register from "../pages/Register";
import UploadVideo from "../pages/UploadVideo";
import MyVideos from "../pages/MyVideos";
import EditVideo from "../pages/EditVideo";
import Channel from "../pages/Channel";
import ChannelSubscribers from "../pages/ChannelSubscribers";
import ChannelSubscriptions from "../pages/ChannelSubscriptions";
import Subscriptions from "../pages/Subscriptions";
import History from "../pages/History";
import LikedVideos from "../pages/LikedVideos";
import WatchLater from "../pages/WatchLater";
import Playlist from "../pages/Playlist";
import PlaylistDetails from "../pages/PlaylistDetails";
import Notifications from "../pages/Notification";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/videos/:videoId" element={<VideoDetails/>} />
          <Route path="/notifications" element={<ProtectedRoute> <Notifications/> </ProtectedRoute>} />
          <Route path="/upload" element={ <ProtectedRoute> <UploadVideo/> </ProtectedRoute>} />
          <Route path="/my-videos" element={<ProtectedRoute> <MyVideos/> </ProtectedRoute>} />
          <Route path="/edit-video/:videoId" element={<ProtectedRoute> <EditVideo/> </ProtectedRoute>} />
          <Route path="/channel/:username" element={<Channel />} />
          <Route path="/channel/:channelId/subscribers" element={<ProtectedRoute> <ChannelSubscribers/> </ProtectedRoute>} />
          <Route path="/channel/:channelId/subscriptions" element={<ProtectedRoute> <ChannelSubscriptions/> </ProtectedRoute> } />
          <Route path="/subscriptions" element={<ProtectedRoute> <Subscriptions/> </ProtectedRoute>} />
          <Route path="/history" element={<ProtectedRoute> <History/> </ProtectedRoute>} />
          <Route path= "/liked-videos" element={<ProtectedRoute> <LikedVideos/> </ProtectedRoute>} />
          <Route path= "/watch-later" element={<ProtectedRoute> <WatchLater/> </ProtectedRoute>} />
          <Route path= "/playlists" element={<ProtectedRoute> <Playlist/> </ProtectedRoute>} />
          <Route path= "/playlists/:playlistId" element={<ProtectedRoute> <PlaylistDetails/> </ProtectedRoute>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;