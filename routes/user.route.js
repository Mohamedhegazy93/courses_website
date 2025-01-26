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
  resetPassword
} from "../controllers/user.controller.js";
// import {signupValidator,loginValidator} from '../validators/auth.validator.js'
import { protectedRoute, adminRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", protectedRoute, getAllUsers);
router.get("/:id", protectedRoute, getUserData);
router.patch("/:id/updatedata", protectedRoute, updateUserData);
router.patch("/:id/unactivateuser", protectedRoute, unActivateUser);
router.patch("/:id/activateuser", protectedRoute, activateUser);
router.patch("/:id/updatepassword", protectedRoute, updatePassword);
router.patch("/forgetpassword", protectedRoute, forgetPassword);
router.post("/:id/verifypassresetcode", protectedRoute, verifyPassResetCode);
router.patch("/:id/resetpassword",protectedRoute,resetPassword);

export default router;
