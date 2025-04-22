import { Doctor } from "../models/doctor.model.js";
import { User } from "../models/User.model.js";
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { wrapAsync } from "../utils/wrapAsync.js"
import { generateAccessAndRefreshTokens } from "../utils/generateTokens.js"
const registerDoctor = wrapAsync(async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        throw new ApiError(401, "All fields are required")
    }

    const existedUser = await User.findOne({ email: email })
    if (existedUser) {
        throw new ApiError(401, "User already exists")
    }
    const user = await User.create({
        username: username,
        email: email,
        password: password,
        role: "doctor"
    })

    const createdUser = await User.findById(user._id).select("-password")
    if (!createdUser) {
        throw new ApiError(401, "something went wrong while creating the user")
    }


    const doctor = await Doctor.create({
        user: user._id,
    })

    const createdDoctor = await Doctor.findById(doctor._id).populate({
        path: "user",
        select: "username email role"
    })

    if (!createdDoctor) {
        throw new ApiError(401, "Something went wrong while creating the doctor")
    }


    res.status(200)
        .json(
            new ApiResponse(200,
                doctor,
                "User registered successfully"
            )
        )
})
const loginDoctor = wrapAsync(async (req, res) => {
    const { username, email, password } = req.body
    if (!username || email || password) {
        throw new ApiError(401, "All data is required")
    }

    const user = await User.findOne({ email: email })
    if (!user) {
        throw new ApiError(404, "Invalid credentials User not found")
    }

    if (user.role !== "doctor") {
        throw new ApiError(403, "Access denied to this path ")
    }

    let isPasswordCorrect = await user.validatePassword(password);
    if (!isPasswordCorrect) {
        throw new ApiError(401, "Password is incorrect")
    }

    let tokens = await generateAccessAndRefreshTokens(user._id)
    if (!tokens || !tokens.accessToken || tokens.refreshToken) {
        throw new ApiError(403, "Invalid credentials to generate access and refresh TOken")
    }

    let { accessToken, refreshToken } = tokens;
    let loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    if (!loggedInUser) {
        throw new ApiError(500, "Failed to log in User")
    }

    let options = {
        httpOnly: true,
        secure: true
    }

    res.status(200)
        .cookie("refreshToken", refreshToken, options)
        .cookie("accessToken", accessToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    loggedInUser,
                    accessToken,
                    refreshToken
                },
                "User logged in successfully"
            )
        )
})
export { registerDoctor, loginDoctor }