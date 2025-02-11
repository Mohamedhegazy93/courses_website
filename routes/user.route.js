import express from "express";
import {
  getAllUsers,
  getUserData,
  updateUserData,
  unActivateUser,
  activateUser,
  updatePassword,
  forgetPassword,
  verifyPassResetCode,
  resetPassword,
  getCoursesOfTeacher,
  uploadUserImage,
  getUserProfile
  
} from "../controllers/user.controller.js";
import { protectedRoute, adminRoute } from "../middlewares/auth.middleware.js";
import {
  MonogIdValidator,
} from "../validators/courses.validator.js";
import {upload} from '../config/multer.js'

const router = express.Router();


router.get("/", protectedRoute, getAllUsers); //Admin Route
router.get("/:id", protectedRoute, getUserData); //Protected Route (each user)
router.post("/:id/uploaduserimage", protectedRoute,upload.single('image') ,uploadUserImage); //Protected Route (each user)
router.get("/:id/courses",MonogIdValidator,getCoursesOfTeacher); //Protected Route (each user)
router.patch("/:id/updatedata", protectedRoute, updateUserData); //Protected Route (each user)
router.patch("/:id/unactivateuser", protectedRoute, unActivateUser); //Protected Route (each user)
router.patch("/:id/activateuser", protectedRoute, activateUser); //Protected Route (each user)
router.patch("/:id/updatepassword", protectedRoute, updatePassword); //Protected Route (each user)
router.patch("/forgetpassword", protectedRoute, forgetPassword); //Protected Route (each user)
router.post("/:id/verifypassresetcode", protectedRoute, verifyPassResetCode); //Protected Route (each user)
router.patch("/:id/resetpassword", protectedRoute, resetPassword); //Protected Route (each user)
router.get("/:id/profile", protectedRoute,getUserProfile); //Protected Route
export default router;
