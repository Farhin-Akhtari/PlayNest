# PlayNest — Frontend

PlayNest is a modern video-sharing platform built with React. It provides a YouTube-like experience where users can browse, search, watch, upload, like, comment on, and organize videos.

This repository contains the **frontend** of the PlayNest application. The frontend communicates with the PlayNest backend through REST APIs and real-time socket connections.

## ✨ Features

* 🔐 User authentication with JWT and Google OAuth 2.0
* 🏠 Home page with video feed
* 🔎 Video search with search suggestions
* 🕘 Search history
* 🎬 Video playback and video details
* ⬆️ Video upload
* ✏️ Edit uploaded videos
* 🗑️ Delete uploaded videos
* 👍 Like videos
* 💬 Comment on videos
* 🔔 Real-time notifications
* 👤 User channels
* 📺 Channel subscriptions
* 📋 Playlists
* ❤️ Liked videos
* 🕐 Watch Later
* 📜 Watch history
* 🌙 Dark mode
* 📱 Responsive user interface

## 🛠️ Technologies Used

* **React** — UI development
* **Vite** — Frontend build tool
* **Tailwind CSS** — Styling and responsive design
* **React Router** — Client-side routing
* **Axios** — API requests
* **React Icons** — Icons and UI elements
* **Socket.IO** — Real-time notifications
* **JavaScript (ES6+)** — Application logic

## 🧩 Main Frontend Sections

### Components

Reusable UI components used throughout the application.

* **Navbar** — Navigation, search, notifications, user menu, and theme toggle
* **Sidebar** — Main application navigation
* **CategoryBar** — Video category filtering
* **VideoCard** — Displays video information in the video feed
* **VideoPlayer** — Handles video playback
* **VideoInfo** — Displays video information
* **VideoAction** — Like and other video actions
* **ChannelInfo** — Displays channel information
* **CommentForm** — Adds comments
* **CommentItem** — Displays individual comments
* **ProtectedRoute** — Protects authenticated routes

### Pages

The application contains separate pages for major user features, including:

* Home
* Login
* Channel
* Channel Subscribers
* Channel Subscriptions
* Video Details
* Upload Video
* Edit Video
* My Videos
* History
* Liked Videos
* Watch Later
* Playlists
* Playlist Details
* Subscriptions
* Notifications
* Settings
* Shorts

### Services

The service layer handles communication between the frontend and backend APIs.

Services include:

* Authentication and Google OAuth login
* Videos
* Comments
* Likes
* Notifications
* Playlists
* Search History
* Subscriptions
* Watch Later
* Socket connection

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Farhin-Akhtari/PlayNest.git
```

### 2. Navigate to the frontend folder

```bash
cd "Frontend Part"
```

### 3. Install dependencies

```bash
npm install
```

### 4. Start the development server

```bash
npm run dev
```

The frontend will then be available through the local Vite development server.

## 🔗 Backend

The PlayNest frontend communicates with the PlayNest backend through REST APIs and Socket.IO.

The backend is available in the Backend Part folder of this repository.

See the [Backend Part README](../Backend%20Part/README.md) for backend setup and API details.

## 🌙 Dark Mode

PlayNest supports both:

* ☀️ Light Mode
* 🌙 Dark Mode 

Theme state is managed using `ThemeContext` and can be switched through the application's user menu.

## 🔔 Real-Time Notifications

PlayNest uses Socket.IO for real-time notification updates.

Users can receive notifications for activities such as:

* Likes
* Comments
* Subscriptions

The notification system also supports marking notifications as read.

## 📱 Responsive UI

The frontend is designed to provide a responsive experience across different screen sizes using Tailwind CSS.

## 📌 Future Improvements

Possible future improvements include:

* Improved mobile navigation
* More advanced video recommendations
* Additional profile customization
* Improved search and filtering
* Further UI/UX enhancements

## 👨‍💻 Author

Farhin Akhtari

Computer Science Engineering Student

Interested in Full Stack Development, Data Structures & Algorithms, and AI.

## ⭐ Support

If you like this project, consider giving the repository a ⭐ on GitHub.