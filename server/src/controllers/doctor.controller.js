import { Doctor } from "../models/doctor.model.js";
import { User } from "../models/User.model.js";
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { wrapAsync } from "../utils/wrapAsync.js"

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
export { registerDoctor }