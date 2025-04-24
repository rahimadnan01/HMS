import { v2 as cloudinary } from "cloudinary"
import fs from "fs";

// Configuration
cloudinary.config({
    cloud_name: "dqolqioqw",
    api_key: "159755157937872",
    api_secret: "y_eL4nQRiJ00rW2C8LehxlJG0SM",
});


//   Upload an image
const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) {
            return null;
        }
        if (!fs.existsSync(localFilePath)) {
            console.log("file not found", localFilePath)
            return null
        }

        const response = await cloudinary.uploader.upload(localFilePath, {
            type: "auto"
        })
        fs.unlink(localFilePath)
        return response;
    } catch (error) {
        console.log("Failed to upload the photo", localFilePath)
        fs.unlink(localFilePath)
        return null;
    }
}

export { uploadOnCloudinary }