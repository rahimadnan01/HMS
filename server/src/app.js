import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { errorHandler } from "../src/middlewares/errorhandler.middleware.js"
const app = express();

app.use(
  cors({
    credentials: true,
    origin: process.env.CORS_ORIGIN,
  }),
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.set(express.static("public"));
export { app };
import doctorAuthRoute from "./routes/doctor.auth.route.js";
app.use("/api/v1", doctorAuthRoute)


app.use(errorHandler);