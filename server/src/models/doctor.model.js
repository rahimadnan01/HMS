import mongoose, { Mongoose } from "mongoose";
const doctorSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    dateOfBirth: {
      type: String,
    },
    speciality: {
      type: String,
    },
    phoneNum: {
      type: String,
    },

    degree: {
      type: String,
    },
    gender: {
      type: String,
    },
    aboutMe: {
      type: String,
    },
    avatar: {
      typr: String,
    },
  },
  { timestamps: true }
);

const Doctor = mongoose.model("Doctor", doctorSchema);
export { Doctor };
