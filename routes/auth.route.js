import express from "express";
import {signup,login,refreshToken } from "../controllers/auth.controller.js";
import {signupValidator,loginValidator} from '../validators/auth.validator.js'

const router = express.Router();

router.post("/signup", signupValidator,signup); //public route
router.post("/login",loginValidator,login); //public route
router.post("/refresh-token", refreshToken);

export default router;
