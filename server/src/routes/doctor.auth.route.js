import Router from "express"
import { loginDoctor, logoutDoctor, registerDoctor } from "../controllers/doctor.controller.js"
const router = Router();
router.route("/doctors/register").post(registerDoctor)
router.route("/doctors/login").post(loginDoctor)
router.route("/doctors/logout").post(logoutDoctor)
export default router