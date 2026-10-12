import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.models.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  console.time("VERIFY_JWT_TOTAL");

  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    throw new ApiError(401, "Unauthorized request");
  }

  try {
    console.time("JWT_VERIFY");

    const decodedToken = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET
    );

    console.timeEnd("JWT_VERIFY");

    console.time("AUTH_USER_FIND");

    const user = await User.findById(decodedToken?._id)
      .select("-password -refreshToken");

    console.timeEnd("AUTH_USER_FIND");

    if (!user) {
      throw new ApiError(401, "Invalid Access Token");
    }

    req.user = user;

    console.timeEnd("VERIFY_JWT_TOTAL");

    next();
  } catch (error) {
    throw new ApiError(
      401,
      error?.message || "Invalid Access Token"
    );
  }
});

export const optionalVerifyJWT = asyncHandler(async (req, res, next) => {
  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return next();
  }

  try {
    const decodedToken = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id)
      .select("-password -refreshToken");

    if (user) {
      req.user = user;
    }

    next();
  } catch (error) {
    next();
  }
});