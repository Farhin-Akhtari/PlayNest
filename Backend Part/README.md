# Backend series

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
- User Registration
- User Login & Logout
- JWT Authentication
- Refresh Token Support
- Google OAuth 2.0 Login
- OAuth 2.0 Authorization Code Flow
- PKCE Verification
- State Verification
- Google ID Token Verification
- Change Password
- Update Account Details
- Upload Avatar & Cover Image
- Get Current User Profile

---

## 🔑 Google OAuth 2.0

PlayNest supports Google OAuth 2.0 login using Google's Authorization Code flow with PKCE and state verification.

The authentication flow works as follows:

1. The user selects Continue with Google from the PlayNest    login page.
2. PlayNest redirects the user to Google's authorization page.
3. Google authenticates the user and redirects back to the PlayNest backend callback.
4. The backend verifies the OAuth state and PKCE verifier.
5. The backend exchanges the authorization code with Google.
6. The Google ID token is verified to obtain the user's Google identity.
7. The backend finds the existing PlayNest account or creates a new account.
8. PlayNest generates a temporary, single-use OAuth code.
9. The frontend exchanges this temporary code with the backend.
10. The backend generates PlayNest access and refresh tokens.
11. The user is logged into PlayNest.

Sensitive OAuth credentials such as the Google Client Secret are stored in environment variables and are not committed to the repository.

---

## 🔒 Security Features

- JWT Authentication
- Google OAuth 2.0
- PKCE Verification
- OAuth State Verification
- Protected Routes
- Owner Authorization
- Input Validation
- MongoDB ObjectId Validation
- Secure Password Hashing
- Refresh Token Mechanism
- Single-use OAuth authorization code
- Environment-based secret management

---

## 📡 API Features

- RESTful API Design
- Pagination
- Searching
- Sorting
- Filtering
- Aggregation
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

Create a `.env` file using `.env.sample`.

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
