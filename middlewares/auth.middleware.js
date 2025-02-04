import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
import User from "../models/user.model.js";

export const protectedRoute = async (req, res, next) => {
  try {
    const authorization = req.headers.cookie;
    if (!authorization) {
      return res.json({ message: "you cant perform this action" });
    }

    const token = authorization.split(" ")[0].slice(0, -1).split("=")[1];
    if (!token) {
      return res.json({ message: "you cant perform this action" });
    }
    // console.log(token);
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    // console.log(decoded);
    req.user = decoded;
    // console.log(req.user.userId);
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.json({ message: "user not found" });
    }
  } catch (error) {
    console.log(error);
    return res.json({ message: error.message });
  }
  next();
};

export const adminRoute = async (req, res, next) => {
  const user = await User.findById(req.user.userId);
  if (user.role !== "admin") {
    return res.json({ message: "access denied | admin only" });
  }

  next();
};
export const teacherRoute = async (req, res, next) => {
  const user = await User.findById(req.user.userId);
  if (user.role !== "teacher") {
    return res.json({ message: "access denied | teacher only" });
  }

  next();
};
