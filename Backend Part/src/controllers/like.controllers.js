import mongoose, {isValidObjectId} from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js";
import { Video } from "../models/video.models.js"
import { Comment } from "../models/comment.models.js"
import { Like } from "../models/like.models.js"
import { Tweet } from "../models/tweet.models.js";
import { Notification } from "../models/notification.models.js";
import { getSocketIO } from "../utils/socket.js";

//Toggle video likes
const toggleVideoLike = asyncHandler(async (req, res) => {
    console.time("LIKE_TOTAL");
    const {videoId} = req.params;
     if(!isValidObjectId(videoId)){
            throw new ApiError(400, "INVALID VIDEO ID");
        }
    console.time("VIDEO_FIND");
    const video = await Video.findById(videoId);
    console.timeEnd("VIDEO_FIND");
        if(!video){
            throw new ApiError(404, "VIDEO NOT FOUND");
        }
    console.time("LIKE_FIND");
    const existingLike = await Like.findOne({
        video: videoId,
        likedBy: req.user._id
    })
    console.timeEnd("LIKE_FIND");

    if(existingLike){
        await Like.findByIdAndDelete(existingLike._id);

         // Find notification related to this like
    const notification = await Notification.findOne({
        recipient: video.owner,
        sender: req.user._id,
        type: "like",
        video: videoId
    });

    // Delete the notification
    if(notification){
        await Notification.findByIdAndDelete(notification._id);
    }

    // Send real-time deletion
    const io = getSocketIO();

    if(io && notification){
        io.to(video.owner.toString()).emit(
            "notificationDeleted",
            notification._id.toString()
        );
    }
        
        return res
        .status(200)
        .json(new ApiResponse(200, {liked: false}, "video unliked successfully"));
    }
      console.time("LIKE_CREATE");
    const newLike = await Like.create({
         video: videoId,
        likedBy: req.user._id
    })
    console.timeEnd("LIKE_CREATE");

    if(video.owner.toString() !== req.user._id.toString()){
     
    const owner = await User.findById(video.owner).select("notificationPreferences");

    if(owner?.notificationPreferences?.likes){
    const notification = await Notification.create({
    recipient: video.owner,
    sender: req.user._id,
    type: "like",
    video: videoId,
    });

    const io = getSocketIO();

    // Populate notification
    const populatedNotification = await Notification.findById(notification._id)
        .populate("sender", "username fullName avatar")
        .populate("video", "title thumbnail")

    if(io){
        io.to(video.owner.toString()).emit(
            "newNotification",
            populatedNotification
        );
    }
 }
}
    console.timeEnd("LIKE_TOTAL");
     return res
     .status(200)
     .json(new ApiResponse(200, {liked: true}, "video liked successfully"));

})

//Toggle comment likes
const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params;
     if(!isValidObjectId(commentId)){
            throw new ApiError(400, "INVALID COMMENT ID");
        }
    
    const comment = await Comment.findById(commentId);
        if(!comment){
            throw new ApiError(404, "COMMENT NOT FOUND");
        }

    const existingLike = await Like.findOne({
        comment: commentId,
        likedBy: req.user._id
    })

    if(existingLike){
        await Like.findByIdAndDelete(existingLike._id);
        
        return res
        .status(200)
        .json(new ApiResponse(200, {liked: false}, "comment unliked successfully"));
    }

    const newLike = await Like.create({
         comment: commentId,
        likedBy: req.user._id
    })

     return res
     .status(200)
     .json(new ApiResponse(200, {liked: true}, "comment liked successfully"));

})

//Toggle tweet likes
const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params;
     if(!isValidObjectId(tweetId)){
            throw new ApiError(400, "INVALID TWEET ID");
        }
    
    const tweet = await Tweet.findById(tweetId);
        if(!tweet){
            throw new ApiError(404, "TWEET NOT FOUND");
        }

    const existingLike = await Like.findOne({
        tweet: tweetId,
        likedBy: req.user._id
    })

    if(existingLike){
        await Like.findByIdAndDelete(existingLike._id);
        
        return res
        .status(200)
        .json(new ApiResponse(200, {liked: false}, "Tweet unliked successfully"));
    }

    const newLike = await Like.create({
         tweet: tweetId,
        likedBy: req.user._id
    })

     return res
     .status(200)
     .json(new ApiResponse(200, {liked: true}, "Tweet liked successfully"));

})

//get video like
const getLikedVideos = asyncHandler(async(req, res) => {
    const like = await Like.aggregate([
        {
            $match: {
                likedBy: new mongoose.Types.ObjectId(req.user._id),
                video: { $exists: true }
            }
        },
        {
            $lookup: {
              from: "videos",
              localField: "video",
              foreignField: "_id",
              as: "likedVideos",
              pipeline: [
                {
                  $lookup: {
                     from: "users",
                      localField: "owner",
                     foreignField: "_id",
                     as: "ownerDetails",
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
                            $first: "$ownerDetails"
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
                        owner: 1,
                    }
                }
              ]
            }
        },
        {
            $addFields: {
                likedVideo: {
                    $first: "$likedVideos"
                },
            }
        },
        {
            $project: {
                 _id: 0,
                 likedVideo: 1
            }
        }
    ])

    return res 
    .status(200)
    .json(new ApiResponse(200, like, "LIKE FETHCED SUCCESSFULLY"))
})

export {toggleVideoLike, toggleCommentLike, toggleTweetLike, getLikedVideos}