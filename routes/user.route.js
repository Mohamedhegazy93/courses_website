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
import {updatedPasswordValidator,forgetPasswordValidator,resetPasswordValidator,monogIdValidator,updateUserDataValidator} from "../validators/user.validator.js"
import {upload} from '../config/multer.js'
const router = express.Router();
//-------------------------------------------------------------------------------------------------------------//
router.get("/:id", protectedRoute, monogIdValidator,getOneUser) //Private
.patch("/:id", protectedRoute,updateUserDataValidator,updateUserData) //Private
.patch("/:id/unactivateuser", protectedRoute, monogIdValidator,unActivateUser) //Private
.patch("/:id/activateuser", protectedRoute, monogIdValidator,activateUser) //Private
.patch("/:id/updatepassword", protectedRoute,updatedPasswordValidator,updatePassword) //Private
.patch("/forgetpassword", protectedRoute, forgetPasswordValidator,forgetPassword) //Private
.post("/:id/verifypassresetcode", protectedRoute, verifyPassResetCode) //Private
.patch("/:id/resetpassword", protectedRoute, resetPasswordValidator,resetPassword) //Private
.post("/:id/uploaduserimage", protectedRoute,upload.single('image') ,monogIdValidator,uploadUserImage) //Private
.get("/:id/profile",protectedRoute,monogIdValidator,getUserProfile) //Public
.get("/", protectedRoute,adminRoute ,getAllUsers); //Admin




export default router;


