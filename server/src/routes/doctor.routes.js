import Router from "express";
const router = Router();
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJwt } from "../middlewares/auth.middelware.js";
import {
  addDoctor,
  deleteDoctor,
  updateDoctor,
} from "../controllers/doctor.controller.js";
router.route("/doctors/addDoctor").post(
  verifyJwt("admin"),
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
  ]),
  addDoctor
);
router
  .route("/doctors/:id")
  .put(
    verifyJwt("admin"),
    upload.fields([
      {
        name: "avatar",
        maxCount: 1,
      },
    ]),
    updateDoctor
  )
  .delete(verifyJwt("admin"), deleteDoctor);
export default router;
