import mongoose, {Schema} from "mongoose";

const oauthCodeSchema = new Schema({
    codeHash: {
        type: String,
        required: true,
        unique: true,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    expiresAt: {
        type: Date,
        required: true,
    },
}, 
    {timestamps: true}
);

export const OAuthCode = mongoose.model("OAuthCode", oauthCodeSchema);