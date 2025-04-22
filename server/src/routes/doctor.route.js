import Router from "express"
import { loginDoctor, registerDoctor } from "../controllers/doctor.controller.js"
const router = Router()
router.route("/doctor/register").post(registerDoctor)
router.route("/doctor/login").post(loginDoctor)

export default router