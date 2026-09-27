import mongoose, { isValidObjectId } from "mongoose";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js";
import { Subscription } from "../models/subscription.models.js";
import { Notification } from "../models/notification.models.js";
import { getSocketIO } from "../utils/socket.js";

//toggle subscription
//STEPS: 
 //User clicked Subscribe
//Who clicked?
//req.user._id
//Whose channel?
//req.params.channelId
//Is channelId valid?
//Does that channel exist?
//Is user subscribing to themselves?
//Does subscription already exist?
//Yes → Delete
// No → Create
//Return success response

const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params;

    if(!isValidObjectId(channelId)){
        throw new ApiError(400, "INVALID CHANNEL ID");
    }

    const channel = await User.findById(channelId);
    if(!channel){
        throw new ApiError(404, "CHANNEL NOT FOUND")
    }

    if(channel._id.toString() === req.user._id.toString()){
        throw new ApiError(403, "You cant't subscribe the channel as you are the owner")
    }

    const existingSubscription = await Subscription.findOne({
        subscriber: req.user._id,
        channel: channelId,
    })

    if(existingSubscription){
        await Subscription.findByIdAndDelete(existingSubscription._id);

      const notification = await Notification.findOne({
       recipient: channelId,
       sender: req.user._id,
       type: "subscribe"
      });

      if(notification){
        await Notification.findByIdAndDelete(notification._id)
      }

      const io = getSocketIO();

       if(io && notification){
        io.to(channelId.toString()).emit(
          "notificationDeleted", notification._id.toString()
        )
       }

        return res.status(200).json(
        new ApiResponse(
            200,
            { subscribed: false },
            "Unsubscribed successfully"
        )
    );
    }else{
        const newSubscription = await Subscription.create({
             subscriber: req.user._id,
             channel: channelId,
        })
        if(!newSubscription){
            throw new ApiError(500, "FAILED TO SUBSCRIBE")
        }
    }

    const owner = await User.findById(channelId)
    .select("notificationPreferences");

    if(owner?.notificationPreferences?.newSubscribers){

   const existingNotification = await Notification.findOne({
    recipient: channelId,
    sender: req.user._id,
    type: "subscribe"
  });

  if (!existingNotification) {
    const notification = await Notification.create({
        recipient: channelId,
        sender: req.user._id,
        type: "subscribe"
      });
    
    const io = getSocketIO();

    const populatedNotification = await Notification.findById(notification._id)
        .populate("sender", "username fullName avatar");

    if (io) {
        io.to(channelId.toString()).emit(
            "newNotification",
            populatedNotification
        );
    }
  }
}

    return res
    .status(200)
    .json(new ApiResponse(200, { subscribed: true}, "Subscription successfully."))

})

//get user channel subscription
const getUserChannelSubscription = asyncHandler(async (req, res) => {
     const {channelId} = req.params;

    if(!isValidObjectId(channelId)){
        throw new ApiError(400, "INVALID CHANNEL ID");
    }

    const channel = await User.findById(channelId);
    if(!channel){
        throw new ApiError(404, "CHANNEL NOT FOUND")
    }

    const subscribers = await Subscription.find({
        channel: channelId
    }).populate("subscriber", "fullName username avatar") 

    return res
    .status(200)
    .json(new ApiResponse(200,
         {subscribers, totalSubscriber: subscribers.length},
          "SUBSCRIBERS FETCHED SUCCESSFULLY"));
})

//get subscribed channel
const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { channelId } = req.query;

  let subscriberId = req.user._id;

  // If channelId is provided, get subscriptions
  // of that channel/user instead.
  if (channelId) {
    if (!isValidObjectId(channelId)) {
      throw new ApiError(400, "INVALID CHANNEL ID");
    }

    const user = await User.findById(channelId);

    if (!user) {
      throw new ApiError(404, "USER NOT FOUND");
    }

    subscriberId = user._id;
  }

  const subscribedChannels = await Subscription.find({
    subscriber: subscriberId,
  }).populate(
    "channel",
    "fullName username avatar"
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {
          subscribedChannels,
          totalChannelSubscribed: subscribedChannels.length,
        },
        "SUBSCRIBED CHANNELS FETCHED SUCCESSFULLY"
      )
    );
});

export {toggleSubscription, getUserChannelSubscription, getSubscribedChannels}