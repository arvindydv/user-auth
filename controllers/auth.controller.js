import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import validator from "validator";

// genrate access token and refresh token
const generateAccessAndRefereshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating referesh and access token"
    );
  }
};

// register user controller
const register = asyncHandler(async (req, res) => {
  const payload = req.body;
  if (
    !payload.firstName ||
    !payload.lastName ||
    !payload.email ||
    !payload.password ||
    !payload.username
  ) {
    return res
      .status(400)
      .json(new ApiResponse(400, {}, "All fields are required"));
  }

  // if email is invalid
  if (!validator.isEmail(payload.email)) {
    return res
      .status(400)
      .json(new ApiResponse(400, {}, "Enter a valid email address"));
  }

  //   check user exist or not
  const findUser = await User.findOne({
    $or: [{ username: payload.username }, { email: payload.email }],
  });
  if (findUser) {
    return res
      .status(409)
      .json(new ApiResponse(409, {}, "Email or Username is already in use"));
  }

  const user = await User.create(payload);
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User registered successfully"));
});

// User login controller
const login = asyncHandler(async (req, res) => {
  const payload = req.body;
  if ((!payload.email && !payload.username) || !payload.password) {
    return res
      .status(400)
      .json(
        new ApiResponse(
          400,
          {},
          "Email/username and Password both are required"
        )
      );
  }

  //   check user exist or not
  const user = await User.findOne({
    $or: [{ username: payload.username }, { email: payload.email }],
  });
  if (!user) {
    res.status(404).json(new ApiResponse(404, {}, "User not found"));
  }

  //  check password vaild or nt
  const isPasswordValid = await user.isPasswordCorrect(payload.password);
  if (!isPasswordValid) {
    return res.status(400).json(new ApiResponse(400, {}, "Invalid password"));
  }

  const { accessToken } = await generateAccessAndRefereshTokens(user._id);
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  // set cookies
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken: accessToken,
        },
        "User logged in successfully"
      )
    );
});

// user logout controller
const logout = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: { refreshToken: undefined },
    },
    { new: true }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

export { register, login, logout };
