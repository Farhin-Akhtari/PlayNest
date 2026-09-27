import { Router } from "express";
import { loginUser, logOutUser, registerUser, refreshAccessToken, changeCurrentPassword, getCurrentUser, updateAccountDetails, UpdateUserAvatar, UpdateUserCoverImage, getUserChannelProfile, getWatchHistory, getWatchLater, toggleWatchLater, removeFromWatchHistory, getNotificationPreferences, updateNotificationPreferences, RemoveUserAvatar, RemoveUserCoverImage } from "../controllers/user.controllers.js";
import {upload} from "../middlewares/multer.middlewares.js"
import { verifyJWT } from "../middlewares/auth.middlewares.js";
 
const router = Router()

//middleware
router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser
)

router.route("/login").post(loginUser)
//SECURED ROUTES
router.route("/logout").post(logOutUser)
router.route("/refresh-Token").post(refreshAccessToken)
router.route("/change-password").post(verifyJWT, changeCurrentPassword)
router.route("/current-user").get(verifyJWT, getCurrentUser)
router.route("/update-account").patch(verifyJWT, updateAccountDetails)
router.route("/avatar")
.patch(verifyJWT, upload.single("avatar"), UpdateUserAvatar)
.delete(verifyJWT, RemoveUserAvatar)
router.route("/cover-image")
.patch(verifyJWT, upload.single("coverImage"), UpdateUserCoverImage)
.delete(verifyJWT, RemoveUserCoverImage)
router.route("/c/:username").get(verifyJWT, getUserChannelProfile)
router.route("/watch-history").get(verifyJWT, getWatchHistory)
router.route("/watch-history/:videoId").delete(verifyJWT, removeFromWatchHistory)
router.route("/watch-later").get(verifyJWT, getWatchLater)
router.route("/watch-later/:videoId").post(verifyJWT, toggleWatchLater)
router.route("/notification-preferences")
    .get(verifyJWT, getNotificationPreferences)
    .patch(verifyJWT, updateNotificationPreferences);

export default router