import { Doctor } from "../models/doctor.model.js";
import { User } from "../models/User.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { wrapAsync } from "../utils/wrapAsync.js";
import { generateAccessAndRefreshTokens } from "../utils/generateTokens.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// register doctor
const registerDoctor = wrapAsync(async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    throw new ApiError(401, "All fields are required");
  }

  const existedUser = await User.findOne({ email: email });
  if (existedUser) {
    throw new ApiError(401, "User already exists");
  }
  const user = await User.create({
    username: username,
    email: email,
    password: password,
    role: "doctor",
  });

  const createdUser = await User.findById(user._id).select("-password");
  if (!createdUser) {
    throw new ApiError(401, "something went wrong while creating the user");
  }

  const doctor = await Doctor.create({
    user: user._id,
    firstName: "firstName",
    lastName: "lastName",
    dateOfBirth: "dateOfBirth",
    speciality: "speciality",
    phoneNum: "phoneNum",
    degree: "degree",
    gender: "gender",
    aboutMe: "aboutMe",
    avatar: "",
  });

  const createdDoctor = await Doctor.findById(doctor._id).populate({
    path: "user",
    select: "username email role",
  });

  if (!createdDoctor) {
    throw new ApiError(401, "Something went wrong while creating the doctor");
  }

  res
    .status(200)
    .json(new ApiResponse(200, doctor, "User registered successfully"));
});
// login doctor
const loginDoctor = wrapAsync(async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || email || password) {
    throw new ApiError(401, "All data is required");
  }

  const user = await User.findOne({ email: email });
  if (!user) {
    throw new ApiError(404, "Invalid credentials User not found");
  }

  if (user.role !== "doctor") {
    throw new ApiError(403, "Access denied to this path ");
  }

  let isPasswordCorrect = await user.validatePassword(password);
  if (!isPasswordCorrect) {
    throw new ApiError(401, "Password is incorrect");
  }

  let tokens = await generateAccessAndRefreshTokens(user._id);
  if (!tokens || !tokens.accessToken || tokens.refreshToken) {
    throw new ApiError(
      403,
      "Invalid credentials to generate access and refresh TOken"
    );
  }

  let { accessToken, refreshToken } = tokens;
  let loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!loggedInUser) {
    throw new ApiError(500, "Failed to log in User");
  }

  let options = {
    httpOnly: true,
    secure: true,
  };

  res
    .status(200)
    .cookie("refreshToken", refreshToken, options)
    .cookie("accessToken", accessToken, options)
    .json(
      new ApiResponse(
        200,
        {
          loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged in successfully"
      )
    );
});
// logout doctor
const logoutDoctor = wrapAsync(async (req, res) => {
  // get the user from  the verify jwt
  // access its refresh token and remove it
  // remove the access and refresh token from cookies
  const logoutUser = await User.findByIdAndUpdate(
    req.user?.id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      new: true,
    }
  );

  if (!logoutUser) {
    throw ApiError(401, "Failed to logout User");
  }

  let options = {
    httpOnly: true,
    secure: true,
  };
  res
    .status(200)
    .clearCookie("refreshToken", options)
    .clearCookie("accessToken", options)
    .json(
      new ApiResponse(
        200,
        {
          logoutUser,
        },
        "User logged out successfully"
      )
    );
});
// add doctor
const addDoctor = wrapAsync(async (req, res) => {
  const {
    lastName,
    firstName,
    dateOfBirth,
    speciality,
    phoneNum,
    degree,
    gender,
    aboutMe,
  } = req.body;
  if (
    !lastName ||
    !firstName ||
    !dateOfBirth ||
    !speciality ||
    !phoneNum ||
    !degree ||
    !gender ||
    !aboutMe
  ) {
    throw new ApiError(401, "All fields are required");
  }
  const avatarPath = req.files?.avatar[0]?.path;
  if (!avatarPath) {
    throw new ApiError(401, "Path is required for avatar");
  }
  let avatarUrl;
  if (avatarPath) {
    avatarUrl = await uploadOnCloudinary(avatarPath);
  }

  const existedDoctor = await User.findOne({ email: email });
  if (existedDoctor) {
    throw new ApiError(401, "User already esists of this email");
  }

  const user = await User.create({
    username: firstName,
    email: email,
    password: password,
    role: "doctor",
  });

  if (!user) {
    throw new ApiError(500, " Failed to craete new User");
  }

  const doctor = await Doctor.create({
    user: user._id,
    firstName: firstName,
    lastName: lastName,
    dateOfBirth: dateOfBirth,
    speciality: speciality,
    phoneNum: phoneNum,
    degree: degree,
    gender: gender,
    aboutMe: aboutMe,
    avatar: avatarUrl.url,
  });

  if (!doctor) {
    throw new ApiError(500, "Failed to create new Doctor");
  }

  res
    .status(200)
    .json(new ApiResponse(200, doctor, "successfully created new Doctor"));
});
// update doctor
const updateDoctor = wrapAsync(async (req, res) => {
  const {
    lastName,
    firstName,
    dateOfBirth,
    speciality,
    phoneNum,
    degree,
    gender,
    aboutMe,
  } = req.body;
  const { id } = req.params;
  if (!id) {
    throw new ApiError(404, "The id of user is not given");
  }
  const doctor = await Doctor.findById(id);
  if (!doctor) {
    throw new ApiError(404, "Doctor not found of this id");
  }

  const avatarPath = req.files?.avatar[0].path;
  if (!avatarPath) {
    throw new ApiError(404, "Path for avatar is required");
  }
  let avatarUrl;
  if (avatarPath) {
    avatarUrl = await uploadOnCloudinary(avatarPath);
  }
  if (lastName) doctor.lastName = lastName;
  if (firstName) doctor.firstName = firstName;
  if (dateOfBirth) doctor.dateOfBirth = dateOfBirth;
  if (speciality) doctor.speciality = speciality;
  if (phoneNum) doctor.phoneNum = phoneNum;
  if (degree) doctor.degree = degree;
  if (gender) doctor.gender = gender;
  if (aboutMe) doctor.aboutMe = aboutMe;
  if (avatarUrl) doctor.avatar = avatarUrl.url;

  doctor.save();
  const updatedDoctor = await Doctor.findById(doctor._id);
  if (!updateDoctor) {
    throw new ApiError(500, "Failed to update the doctor");
  }
  res
    .status(200)
    .json(new ApiResponse(200, updatedDoctor, "Doctor updated successfully"));
});

export { registerDoctor, loginDoctor, logoutDoctor, addDoctor, updateDoctor };
