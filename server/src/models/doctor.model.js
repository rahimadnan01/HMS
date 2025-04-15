import mongoose, { Mongoose } from "mongoose";
const doctorSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    qualification: {
        type: String,
    }
}, { timestamps: true })

const Doctor = mongoose.model("Doctor", doctorSchema)
export { Doctor }