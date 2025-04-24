import Router from "express"
import { loginDoctor, logoutDoctor, registerDoctor } from "../controllers/doctor.controller.js"
const router = Router();
router.route("/doctor/register").post(registerDoctor)
router.route("/doctor/login").post(loginDoctor)
router.route("/doctor/logout").post(logoutDoctor)
export default router