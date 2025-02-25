import express from "express";
import { signup, login, refreshToken } from "../controllers/auth.controller.js";
import {
  signupValidator,
  loginValidator,
} from "../validators/auth.validator.js";


import { protectedRoute } from "../middlewares/auth.middleware.js";
const router = express.Router();

router.post("/signup", signupValidator, signup)
.post("/login", loginValidator, login)
.post("/refresh-token", protectedRoute, refreshToken)

export default router;
