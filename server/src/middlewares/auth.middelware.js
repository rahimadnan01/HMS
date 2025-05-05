import { ApiError } from "../utils/ApiError.js";
import { wrapAsync } from "../utils/wrapAsync.js";
import jwt from "jsonwebtoken";
import { User } from "../models/User.model.js";
const verifyJwt = (role) =>
  wrapAsync(async (req, res, next) => {
    try {
      const token =
        req.cookies?.accessToken ||
        req.header("Authorization")?.replace("Bearer", "");
      if (!token) {
        throw new ApiError(404, "access token not found");
      }
      const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_KEY);
      if (!decodedToken) {
        throw new ApiError(500, "failed to decode token");
      }
      const user = await User.findById(user._id).select("-password");

      if (!user) {
        throw new ApiError(404, "User not found ");
      }

      if (role && user.role !== user.role) {
        throw new ApiError(403, "Access denied to this role");
      }
      req.user = user;
      next();
    } catch (error) {
      throw new ApiError(error.statusCode, error.message);
    }
  });
export { verifyJwt };
