import express from "express";
import {
  uploadCourseFiles,
  createCourse,
  getOneCourse,
  getAllCourses,
  deleteCourse,
  updateCourse
} from "../controllers/course.controller.js";
import {
  protectedRoute,
  teacherRoute,
} from "../middlewares/auth.middleware.js";
import { createCourseValidator ,MonogIdValidator,updateCourseValidator} from "../validators/courses.validator.js";
const router = express.Router();
import { upload } from "../config/multer.js";

router.get("/", getAllCourses); //public

router.get("/:courseId", MonogIdValidator,getOneCourse); //public

router.post(
  "/",
  protectedRoute,
  teacherRoute,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "videos", maxCount: 120 },]))
    
router.get("/:courseId", getOneCourse); //public
router.post(
  "/createcourse",
  protectedRoute,
  teacherRoute,
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'videos',maxCount:120 } // No maxCount for videos, allowing unlimited uploads
  ]),

  uploadCourseFiles,

  createCourseValidator,
  createCourse
); //teacher route
router.put("/:courseId", protectedRoute, teacherRoute ,MonogIdValidator,updateCourseValidator,updateCourse); //teacher route
router.delete("/:courseId", protectedRoute, teacherRoute, MonogIdValidator,deleteCourse); //teacher route
router.post("/addcoursevideos", deleteCourse); //teacher route
router.delete("/:courseId",  protectedRoute,
  teacherRoute,deleteCourse); //teacher route

export default router;

// router.post("/uploadcourseimage", upload.single("file"), uploadCourseImage);
