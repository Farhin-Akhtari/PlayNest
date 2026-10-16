# 🎥 PlayNest — Backend

The backend for **PlayNest**, a full-stack video-sharing platform inspired by modern video streaming platforms.

Built with **Node.js, Express.js, MongoDB, and Mongoose**, the backend provides RESTful APIs for authentication, videos, likes, comments, subscriptions, playlists, notifications, and more.

---

## 🚀 Key Features

* 🔐 JWT-based authentication and authorization
* 🔑 Google OAuth 2.0 authentication
* 🎥 Video upload, management, search, sorting, and pagination
* ❤️ Like and unlike videos, comments, and tweets
* 💬 Comment management
* 👥 Channel subscriptions
* 📂 Playlist management
* 🕐 Watch Later
* 🔎 Search History
* 🔔 Real-time notifications using Socket.IO
* 📊 Channel dashboard and analytics
* ☁️ Media upload and storage using Cloudinary
* 🔒 Protected routes and owner-based authorization

---

### 🔐 Authentication & Authorization
* User registration, login, and logout
* JWT authentication with access and refresh tokens
* Google OAuth 2.0 login
* OAuth 2.0 Authorization Code flow with PKCE
* OAuth state verification
* Google ID token verification
* Change password and update account details
* Avatar and cover image management
* Current user profile retrieval
* Protected API routes

---

## 🔑 Google OAuth 2.0

PlayNest supports Google OAuth 2.0 login using Google's Authorization Code flow with PKCE and state verification.

Authentication flow

1. The user selects Continue with Google on the PlayNest login page.

2. The frontend sends its current origin to the backend.

3. The backend validates the requested frontend origin against an allowlist and initiates Google authentication.

4. Google authenticates the user and redirects to the backend callback.

5. The backend validates the OAuth state and retrieves the PKCE code verifier.

6. The backend exchanges the authorization code with Google and verifies the Google ID token.

7. The backend finds the existing Google-linked PlayNest account or creates a new account.

8. The backend generates a temporary, single-use OAuth code.

9. The backend redirects the user to the appropriate frontend's OAuth callback.

10. The frontend exchanges the temporary OAuth code with the backend.

11. The backend validates and consumes the code, then issues PlayNest access and refresh tokens.

# Supported frontend origins

* Local development: http://localhost:5173
* Production: https://playnest-frontend.onrender.com

The backend uses HTTP-only cookies for OAuth flow data and configures secure cookies for production. OAuth state validation, PKCE, frontend-origin validation, and the short-lived, single-use code exchange help protect the authentication flow.

Google OAuth credentials and other secrets must be stored in environment variables and must never be committed to the repository.

---

## 🔒 Security Features

- JWT authentication and authorization
- Access and refresh token mechanism
- Google OAuth 2.0 authentication
- PKCE verification and OAuth state validation
- Google ID token verification
- Single-use, short-lived OAuth authorization codes
- Protected routes and owner-based authorization
- Password hashing with bcrypt
- Input and MongoDB ObjectId validation
- Environment-based secret management
- HTTP-only cookies for OAuth flow data
- Secure OAuth state validation and PKCE verification

---

## 📡 API Features

- RESTful API Design
- Pagination, Searching, Sorting,Filtering
- MongoDB Aggregation
- Consistent API Responses
- Proper Error Handling

---

## 🛠️ Tech Stack

**Backend**

* Node.js
* Express.js

**Database**

* MongoDB
* Mongoose

**Authentication & Security**

* JWT
* bcrypt
* Google OAuth 2.0

**File Storage**

* Multer
* Cloudinary

**Real-Time Communication**

* Socket.IO

---

## 📦 Installation

### 1. Clone the repository

```bash
git clone https://github.com/Farhin-Akhtari/PlayNest.git
```

### 2. Navigate to the backend

```bash
cd "Backend Part"
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

Create a `.env` file using `.env.sample` as a reference.

```env
PORT=8000

MONGODB_URL=your_mongodb_connection_string

CORS_ORIGIN=your_frontend_url

ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRY=1d

REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRY=10d

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:8000/api/v1/users/google/callback
FRONTEND_URL=http://localhost:5173

```

### 5. Start the development server

```bash
npm run dev
```

---

## ☁️ Deployment

PlayNest's backend is deployed on Render.

Configure production environment variables in the Render dashboard. Set:

NODE_ENV=production

Use production URLs for the Google OAuth callback and the frontend CORS configuration. Never commit production credentials or .env files to Git.

---

## 🔗 Frontend

The PlayNest frontend is available in the `Frontend Part` folder of this repository.

See the [Frontend Part README](../Frontend%20Part/README.md)for frontend setup and details.

---

## 🎯 Future Improvements

* Video streaming optimization
* Video recommendations
* Real-time chat
* Admin dashboard
* Unit testing
* Docker support
* Improved API documentation

---

## 👨‍💻 Author

**Farhin Akhtari**

Computer Science Engineering Student

Interested in Full Stack Development, Data Structures & Algorithms, and AI.

---

## ⭐ Support

If you like this project, consider giving the repository a ⭐ on GitHub.
