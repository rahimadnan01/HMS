import Router from "express"
const router = Router();
import {upload} from "../middlewares/multer.middleware.js"
import { updateDoctor } from "../controllers/doctor.controller.js";
router.route("/doctors/:id").post(
    upload.fields([
        {
            name:"avatar",
            maxCount:1
        }
    ]),
    updateDoctor
)
export default router