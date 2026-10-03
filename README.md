# 🎥 PlayNest

PlayNest is a full-stack video-sharing platform built with **React, Node.js, Express.js, MongoDB, and other modern web technologies**.

It provides features such as video uploading and playback, user authentication, channel subscriptions, playlists, real-time notifications, and Google OAuth 2.0 authentication.

## 🚀 Features

### 🔐 Authentication & Authorization

* User registration and login
* JWT-based authentication
* Access and refresh token system
* Google OAuth 2.0 login
* OAuth 2.0 Authorization Code flow with PKCE and state verification
* Protected routes and authenticated API requests

### 🎬 Video Features

* Video upload and management
* Video playback
* Video search
* Video categories
* Edit and delete videos
* Cloudinary-based media storage

### 👥 User Interaction

* Likes and dislikes
* Comments
* Channel subscriptions
* Subscribers and subscriptions
* Playlists
* Watch Later
* Watch history
* Liked videos

### 🔔 Real-Time Features

* Real-time notifications using Socket.IO
* Notification updates without page refresh

### 👤 User & Profile

* Profile management
* Avatar and cover image updates
* User channels
* Notification preferences
* Dark mode
* Responsive UI

### 🔎 Search

* Video search
* Search suggestions
* Search history
* Delete and clear search history

### 📊 Dashboard

* Creator dashboard
* Video and channel analytics

## 🛠️ Tech Stack

### Frontend

* React
* Vite
* Tailwind CSS
* Axios
* React Router
* Socket.IO Client

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* Google OAuth 2.0
* Cloudinary
* Socket.IO

### Deployment
* Render 

### Services

* MongoDB Atlas
* Cloudinary
* Google Cloud Console

## 🔑 Authentication

PlayNest supports both traditional authentication and Google OAuth 2.0.

The Google login uses the **OAuth 2.0 Authorization Code flow with PKCE and state verification**. After successful Google authentication, the backend verifies the user's Google identity, finds or creates the corresponding PlayNest account, and generates PlayNest access and refresh tokens.

## 🌐 Live Demo

[PlayNest](https://playnest-frontend.onrender.com)

## 📂 Project Structure

* [Frontend Part](./Frontend%20Part)
* [Backend Part](./Backend%20Part)

## 📖 Documentation

* [Frontend Part README](./Frontend%20Part/README.md)
* [Backend Part README](./Backend%20Part/README.md)

## 👨‍💻 Author

**Farhin Akhtari**

Computer Science Engineering Student

