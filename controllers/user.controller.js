import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// get user profile
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findOne({ _id: req?.user?._id }).select(
    "-password -refreshToken"
  );
  return res
    .status(200)
    .json(new ApiResponse(200, user, "User profile got successfully"));
});

export { getUserProfile };
