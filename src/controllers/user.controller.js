import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  // get user details from frontend
  // validation - not empty
  // check if user already exist: email,username
  //check for image, check for avatar
  //upload them to cloudinary, avatar
  //create user object - create entry in db (as mongodb is nosql so object is required to put data into it)
  //remove password and refresh token field from response
  //check for user creation
  // return res

  const { username, fullname, email, password } = req.body;

  console.log("email:", email);
  // validation if field is empty or not
  if (
    [username, fullname, email, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  // if already user exist
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  console.log("\n existedUser:", existedUser);

  if (existedUser) {
    throw new ApiError(409, "User with email or username already exist");
  }

  // check for avatar and coverImage
  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;
  // console.log("\n files:", avatarLocalPath);

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  // upload on cloudinary
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);
  // recheck for avatar
  if (!avatar) {
    throw new ApiError(400, "Avatar file is required");
  }

  // create user object annd make entry in db
  const user = await User.create({
    fullname,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Internal server error while registering user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered successfully"));
});

export { registerUser };
