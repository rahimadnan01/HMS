import { wrapAsync } from "../utils/wrapAsync.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { User } from "../models/User.model.js"
const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId)
        if (!user) {
            throw new ApiError(404, "User of this id is not found")
        }
        let accessToken = user.generateAccessToken()
        let refreshToken = user.generateRefreshToken()

        if (!accessToken || !refreshToken) {
            throw new ApiError(500, "Something went wrong while generating tokens")
        }

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })
        await User.findByIdAndUpdate(user._id, {
            refreshToken: refreshToken
        })
        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError(500, error.message)
    }
}
export { generateAccessAndRefreshTokens }