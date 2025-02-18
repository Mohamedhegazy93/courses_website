import express from "express";
import {
  getAllUsers,
  getOneUser,
  updateUserData,
  unActivateUser,
  activateUser,
  updatePassword,
  forgetPassword,
  verifyPassResetCode,
  resetPassword,
  
  uploadUserImage,
  getUserProfile
  
} from "../controllers/user.controller.js";
import { protectedRoute, adminRoute } from "../middlewares/auth.middleware.js";
import {
  MonogIdValidator,
  updateUserDataValidator
} from "../validators/courses.validator.js";
import {upload} from '../config/multer.js'
const router = express.Router();
//-------------------------------------------------------------------------------------------------------------//
router.get("/:id", protectedRoute, getOneUser); //Private
router.patch("/:id", protectedRoute,updateUserData); //Private
router.patch("/:id/unactivateuser", protectedRoute, unActivateUser); //Private
router.patch("/:id/activateuser", protectedRoute, activateUser); //Private
router.patch("/:id/updatepassword", protectedRoute, updatePassword); //Private
router.patch("/forgetpassword", protectedRoute, forgetPassword); //Private
router.post("/:id/verifypassresetcode", protectedRoute, verifyPassResetCode); //Private
router.patch("/:id/resetpassword", protectedRoute, resetPassword); //Private
router.post("/:id/uploaduserimage", protectedRoute,upload.single('image') ,uploadUserImage); //Private
//-------------------------------------------------------------------------------------------------------------//
router.get("/:id/profile",getUserProfile); //Public
//-------------------------------------------------------------------------------------------------------------//
router.get("/", protectedRoute, getAllUsers); //Admin
//-------------------------------------------------------------------------------------------------------------//
export default router;

import User from "../models/user.model.js";
router.delete("/deleteusers",async (req,res)=>{
  const users=await User.deleteMany()
  res.json('all users deleted')

  
}); //Admin




