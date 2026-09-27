import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.models.js"
import {Video} from "../models/video.models.js"
import { uploadOnCloudinary, deleteOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import mongoose, { isValidObjectId } from "mongoose";

const generateAccessAndRefreshTokens = async(userId) => {
   try {
      const user = await User.findById(userId)
      const accessToken = user.generateAccessToken()
      const refreshToken = user.generateRefreshToken()

      user.refreshToken = refreshToken
      await user.save({vaidateBeforeSave: false})

      return {accessToken, refreshToken}

   } catch (error) {
      throw new ApiError(500, "Something went wrong while generating refresh and access token")
   }
}

const registerUser = asyncHandler(async (req, res) => {
   //get user details from fronted  
   //how and what to get details is depends on the user model
   //validation - not empty
   //check if user already exists : either from email or username
   //check for images, then check for avatar
   //upload them to cloudinary, avater
   //create user object - create entry in db
   //remove password and refresh token field from response
   //check for user creation
   //if creates then return response

console.log("REGISTER API HIT");
console.log("BODY:", req.body);
console.log("FILES:", req.files);


  const{fullName, email, username, password} = req.body
  console.log("email: ", email);
  console.log("fullname: ", fullName)
   
if(
   [email, username, password].some((field) => field?.trim() === "")
){
   throw new ApiError(400, "Email, username, and password are required")
}

const existedUser = await User.findOne({
   $or: [{username}, {email}]
})

if(existedUser){
   throw new ApiError(409, "User with email or username already exist")
}
console.log(req.files);

const avatarLocalPath = req.files?.avatar?.[0]?.path;
const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

let avatar = null;
let coverImage = null;

if (avatarLocalPath) {
  avatar = await uploadOnCloudinary(avatarLocalPath);
}

if (coverImageLocalPath) {
  coverImage = await uploadOnCloudinary(coverImageLocalPath);
}

const user = await User.create({
   fullName: fullName || "",
   avatar: avatar?.url || "",
   coverImage: coverImage?.url || "",
   email,
   password,
   username: username.toLowerCase()
 })

 const createdUser = await User.findById(user._id).select(
   "-password -refreshToken"
 )
 if(!createdUser){
   throw new ApiError(500, "Something went wrong while registering the user")
 }

return res.status(201).json(
   new ApiResponse(200, createdUser, "User registered successfully")
)

})

const loginUser = asyncHandler(async (req, res) => {
  //req body -> data
  //username or email
  //find the user(check if user is exist or not : if not then throw error)
  //password check
  //access and refresh token
  //send cookie
  //send response of login successfully

const {email, password, username} = req.body
 
if(!username && !email){   //wew can check either by them or by both
   throw new ApiError(400, "username or email is required")
}

const user = await User.findOne({
   $or: [{username}, {email}]
})

if(!user){
   throw new ApiError(404, "User does not exist")
}

const isPasswordValid = await user.isPasswordCorrect(password)

if(!isPasswordValid){
   throw new ApiError(401, "Invalid user credentials")
}

const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id)

const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

const options = {
   httpOnly: true,
   secure: false,
   maxAge: 7 * 24 * 60 * 60 * 1000
}

return res.status(200)
.cookie("accessToken", accessToken, options)
.cookie("refreshToken", refreshToken, options)
.json(
   new ApiResponse(
      200, {user: loggedInUser, accessToken, refreshToken},
      "User logged in successfully"
   )
)

})

const logOutUser = asyncHandler(async (req, res) => {
    const incomingRefreshToken =
        req.cookies?.refreshToken || req.body?.refreshToken;

    if (incomingRefreshToken) {
        try {
            const decodedToken = jwt.verify(
                incomingRefreshToken,
                process.env.REFRESH_TOKEN_SECRET
            );

            await User.findByIdAndUpdate(
                decodedToken?._id,
                {
                    $unset: {
                        refreshToken: 1
                    }
                }
            );
        } catch (error) {
            // Even if refresh token is expired,
            // we still want to clear the browser cookies.
            console.log("Refresh token invalid/expired during logout");
        }
    }

    const options = {
        httpOnly: true,
        secure: false,
    };

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(
            new ApiResponse(
                200,
                {},
                "User logged out successfully"
            )
        );
});

const refreshAccessToken = asyncHandler(async (req, res) => {
 const incomingRefreshToken = req.cookies.refreshToken ||
 req.body.refreshToken

 if(!incomingRefreshToken){
   throw new ApiError(401, "Unauthorized request")
 }

 try {
   const decodedToken = jwt.verify(
     incomingRefreshToken,
     process.env.REFRESH_TOKEN_SECRET
   )
  
   const user = await User.findById(decodedToken?._id)
  
   if(!user){
     throw new ApiError(401, "Invalid refresh token")
   }
  
   if(incomingRefreshToken !== user?.refreshToken){
     throw new ApiError(401, "Refresh token is expired or used")
   }
  
   const options = {
     httpOnly: true,
     secure: true,
   }
  
   const {accessToken, newrefreshToken} = await generateAccessAndRefreshTokens(user._id)
  
   return res.status(200)
   .cookie("accessToken", accessToken, options)
   .cookie("refreshToken", newrefreshToken, options)
   .json(
     new ApiResponse(200,
        {accessToken, refreshToken: newrefreshToken},
        "ACCESS TOKEN REFRESHED"
     )
   )
 } catch (error) {
   throw new ApiError(401, error?.message || "Invalid refresh token")
 }

})

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const {oldPassword, newPassword, confirmPassword} = req.body

  if(!(newPassword === confirmPassword)){
   throw new ApiError(400, "Mismatched password")
  }

  const user = await User.findById(req.user?._id)
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

  if(!isPasswordCorrect){
   throw new ApiError(400, "Invalid old password")
  }

  user.password = newPassword
  await user.save({validateBeforeSave: false})

  return res
  .status(200)
  .json(new ApiResponse(200, {}, "PASSWORD CHANGED SUCCESSFULLY"))

})

const getCurrentUser = asyncHandler(async (req, res) => {
   return res
   .status(200)
   .json(new ApiResponse(200, req.user, "CURRENT USER FETCHED SUCCESSFULLY"))
})

const updateAccountDetails = asyncHandler(async (req, res) => {
   const {fullName, email} = req.body

   if(!fullName || !email) {
      throw new ApiError(400, "ALL FIELDS ARE REQUIRED")
   }

   const user = await User.findByIdAndUpdate(
      req.user?._id,
      {
         $set: {
            fullName: fullName,
            email: email
         }
      },
      {new: true}
   ). select("-password")

   return res
   .status(200)
   .json(new ApiResponse(200, user, "Account details updated successfully"))

})

const UpdateUserAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.file?.path

  if(!avatarLocalPath){
   throw new ApiError(400, "Avatar file is missing")
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath)

  if(!avatar.url){
   throw new ApiError(400, "Error while uploading on avatar")
  }

  const user = await User.findByIdAndUpdate(
   req.user?._id,
   {
      $set: {
         avatar: avatar.url,
         avatarPublicId: avatar.public_id,
      }
   },
   {new: true}
  ).select("-password")

  return res
  .status(200)
  .json(
   new ApiResponse(200, user, "Avatar updated successfully")
  )

})

const RemoveUserAvatar = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user?._id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (user.avatarPublicId) {
    await deleteOnCloudinary(user.avatarPublicId);
  }

  user.avatar = "";
  user.avatarPublicId = "";

  await user.save();

  return res
    .status(200)
    .json(
      new ApiResponse(200, user, "Avatar removed successfully")
    );
});

const UpdateUserCoverImage = asyncHandler(async (req, res) => {
  const coverImageLocalPath = req.file?.path

  if(!coverImageLocalPath){
   throw new ApiError(400, "Cover image file is missing")
  }

  const coverImage = await uploadOnCloudinary(coverImageLocalPath)

  if(!coverImage.url){
   throw new ApiError(400, "Error while uploading on cover image")
  }

  const user = await User.findByIdAndUpdate(
   req.user?._id,
   {
      $set: {
         coverImage: coverImage.url,
         coverImagePublicId: coverImage.public_id,
      }
   },
   {new: true}
  ).select("-password")

  return res
  .status(200)
  .json(
   new ApiResponse(200, user, "Cover image updated successfully")
  )

})

const RemoveUserCoverImage = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user?._id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (user.coverImagePublicId) {
    await deleteOnCloudinary(user.coverImagePublicId);
  }

  user.coverImage = "";
  user.coverImagePublicId = "";

  await user.save();

  return res
    .status(200)
    .json(
      new ApiResponse(200, user, "Cover image removed successfully")
    );
});

const getUserChannelProfile = asyncHandler(async (req, res) => {
 const {username} = req.params

 if(!username?.trim()){
   throw new ApiError(400, "username is missing")
 }
 //using aggregation pipeine

 const channel = await User.aggregate([
  {
    $match: {
      username: username?.toLowerCase()
    }
  },

  // People who subscribed to this channel
  {
    $lookup: {
      from: "subscriptions",
      localField: "_id",
      foreignField: "channel",
      as: "subscribers"
    }
  },

  // Channels this user subscribed to
  {
    $lookup: {
      from: "subscriptions",
      localField: "_id",
      foreignField: "subscriber",
      as: "subscriptions"
    }
  },

  {
    $addFields: {
      subscribersCount: {
        $size: "$subscribers"
      },

      subscriptionsCount: {
        $size: "$subscriptions"
      },

      isSubscribed: {
        $cond: {
          if: {
            $in: [req.user?._id, "$subscribers.subscriber"]
          },
          then: true,
          else: false
        }
      }
    }
  },

  {
    $project: {
      fullName: 1,
      username: 1,
      subscribersCount: 1,
      subscriptionsCount: 1,
      isSubscribed: 1,
      avatar: 1,
      coverImage: 1,
      email: 1
    }
  }
 ]);

 if (!channel?.length) {
  throw new ApiError(404, "channel does not exist");
}

return res
  .status(200)
  .json(
    new ApiResponse(
      200,
      channel[0],
      "user channel fetched successfully"
    )
  );
})

const getWatchHistory = asyncHandler(async (req, res) => {
 const user = await User.aggregate([
   {
      $match: {
         _id: new mongoose.Types.ObjectId(req.user._id)
      }
   },
   {
      $lookup: {
         from: "videos",
         localField: "watchHistory",
         foreignField: "_id",
         as: "watchHistory",
         pipeline:[
            {
               $lookup:{
                  from: "users",
                  localField: "owner",
                  foreignField: "_id",
                  as: "owner",
                  pipeline:[
                     {
                        $project: {
                           fullName: 1,
                           username: 1,
                           avatar: 1
                        }
                     }
                  ]
               }
            },
            {
               $addFields: {
                  owner: {
                     $first: "$owner"
                  }
               }
            }
         ]
      }
   }
 ])

 return res
 .status(200)
 .json(new ApiResponse(200, user[0].watchHistory, "Watch history fetched successfully"))

})

const getWatchLater = asyncHandler(async (req, res) => {

   const user = await User.aggregate([
      {
         $match: {
            _id: new mongoose.Types.ObjectId(req.user._id)
         }
      },
      {
      $lookup: {
        from: "videos",
        localField: "watchLater",
        foreignField: "_id",
        as: "watchLater",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "owner",
              pipeline: [
                {
                  $project: {
                    username: 1,
                    fullName: 1,
                    "avatar.url": 1
                  }
                }
              ]
            }
          },
          {
            $addFields: {
              owner: {
                $first: "$owner"
              }
            }
          },
          {
            $project: {
              title: 1,
              thumbnail: 1,
              duration: 1,
              views: 1,
              createdAt: 1,
              owner: 1
            }
          }
        ]
      }
    },
    {
      $project: {
        _id: 0,
        watchLater: 1
      }
    }
  ]);
 
  return res
  .status(200)
  .json(new ApiResponse(200, user[0].watchLater || [], "WATCH LATER VIDEOS FETCHED SUCCESSFULLY"));

})

const removeFromWatchHistory = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "INVALID VIDEO ID");
    }

    await User.findByIdAndUpdate(
        req.user._id,
        {
            $pull: {
                watchHistory: videoId
            }
        }
    );

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {},
                "Video removed from watch history"
            )
        );
});

const toggleWatchLater = asyncHandler(async (req, res) => {
   const {videoId} = req.params;

   if(!isValidObjectId(videoId)){
       throw new ApiError(400, "INVALID VIDEO ID");
   }

   const video = await Video.findById(videoId);
   if(!video){
       throw new ApiError(404, "VIDEO NOT FOUND");
   }

   const user = await User.findById(req.user._id);
   
   const alreadySaved = user.watchLater.includes(videoId);

   if(alreadySaved){
      await User.findByIdAndUpdate(req.user._id,
         {
            $pull: {
               watchLater: videoId
            }
         }
      );
       return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { watchLater: false },
          "Video removed from watch later"
        )
      );
   }
    await User.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: {
        watchLater: videoId
      }
    }
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { watchLater: true },
        "Video added to watch later"
      )
    );
});

const getNotificationPreferences = asyncHandler(async (req, res) => {
   const user = await User.findById(req.user?._id)
      .select("notificationPreferences");

   if(!user){
      throw new ApiError(404, "USER NOT FOUND");
   }

   return res
      .status(200)
      .json(
         new ApiResponse(
            200,
            user.notificationPreferences,
            "NOTIFICATION PREFERENCES FETCHED SUCCESSFULLY"
         )
      );
});


const updateNotificationPreferences = asyncHandler(async (req, res) => {
   const {
      newSubscribers,
      likes,
      comments,
      replies
   } = req.body;

   const user = await User.findByIdAndUpdate(
      req.user?._id,
      {
         $set: {
            "notificationPreferences.newSubscribers": newSubscribers,
            "notificationPreferences.likes": likes,
            "notificationPreferences.comments": comments,
            "notificationPreferences.replies": replies
         }
      },
      {
         new: true,
         runValidators: true
      }
   ).select("notificationPreferences");

   if(!user){
      throw new ApiError(404, "USER NOT FOUND");
   }

   return res
      .status(200)
      .json(
         new ApiResponse(
            200,
            user.notificationPreferences,
            "NOTIFICATION PREFERENCES UPDATED SUCCESSFULLY"
         )
      );
});


export { registerUser, 
         loginUser,
         logOutUser,
         refreshAccessToken,
         changeCurrentPassword,
         getCurrentUser,
         updateAccountDetails,
         UpdateUserAvatar,
         RemoveUserAvatar,
         UpdateUserCoverImage,
         RemoveUserCoverImage,
         getUserChannelProfile,
         getWatchHistory,
         getWatchLater,
         toggleWatchLater,
         removeFromWatchHistory,
         getNotificationPreferences,
         updateNotificationPreferences
       }