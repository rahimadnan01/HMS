import { Doctor } from "../models/doctor.model.js";
import { User } from "../models/User.model.js";
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { wrapAsync } from "../utils/wrapAsync.js"
import { generateAccessAndRefreshTokens } from "../utils/generateTokens.js"
import jwt from "jsonwebtoken"

const refreshToken = wrapAsync(async(req,res)=>{
    const incomingRefreshToken = req.cookie?.refreshToken || req.body?.refreshToken;
    console.log("incoming :",incomingRefreshToken);
    if(!incomingRefreshToken){
        throw  new ApiError(404,"Incoming refreshToken");
    }
    let verifiedToken;
   try {
     if(incomingRefreshToken){
       verifiedToken = jwt.verify(
         incomingRefreshToken,
         process.env.REFRESH_TOKEN_KEY
       )
     }
     console.log("verified " ,  verifiedToken )
   } catch (error) {
    throw new ApiError(500,error.message)
   }

   if(!verifiedToken){
    throw new ApiError(403,"User is unauthorized")
   }

   const user = await User.findById(verifiedToken._id);
   if(!user){
    throw new ApiError(401,"user not found by this id")
   }
   console.log("user's refreshToken ", user.refreshToken);
   if(incomingRefreshToken !== user.refreshToken){
    throw new ApiError(403,"User is unauthorized")
   }

   let {accessToken , refreshToken} = await generateAccessAndRefreshTokens(user._id)
   if(!accessToken || !refreshToken){
    throw new ApiError(500,"Failed to create new access and refresh Token")
   }

   let options = {
    httpOnly:true,
    secure:true
   }

   res.status(200)
   .cookie("refreshToken",refreshToken,options)
   .cookie("accessToken",accessToken,options)
   .json(
    new ApiResponse(
        200,
        {
            refreshToken,
            accessToken
        },
        "access and refresh Token generated successfully"
    )
   )
})

export {refreshToken}