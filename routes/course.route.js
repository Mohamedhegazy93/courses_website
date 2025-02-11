import express from "express";
import {
  uploadCourseFiles,
  createCourse,
  getOneCourse,
  getAllCourses,
  deleteCourse,
  updateCourse,
  getOneVideo
} from "../controllers/course.controller.js";
import {
  protectedRoute,
  teacherRoute,
} from "../middlewares/auth.middleware.js";
import {
  createCourseValidator,
  
  updateCourseValidator,
} from "../validators/courses.validator.js";
const router = express.Router();
import { upload } from "../config/multer.js";
//GET ALL COURSES
router.get("/", getAllCourses); //PUBLIC
//GET ONE COURSE
router.get("/:courseId", getOneCourse); //PUBLIC
//GET ONE VIDEO OF COURSE
router.get("/:id/:videoId", getOneVideo); //PUBLIC
//CREATE COURSR
router.post(
  "/",
  protectedRoute,
  teacherRoute,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "videos", maxCount: 120 }, // MAX 120 VIDEOS
  ]),

  uploadCourseFiles,

  createCourseValidator,
  createCourse
); //TEACHER ROUTE
//UPDATE COURSE
router.put(
  "/:id",
  protectedRoute,
  teacherRoute,
  
  updateCourseValidator,
  updateCourse
); //TEACHER ROUTE
//DELETE COURSR
router.delete(
  "/:id",
  protectedRoute,
  teacherRoute,
  
  deleteCourse
); //TEACHER ROUTE
router.delete("/:courseId", protectedRoute, teacherRoute, deleteCourse); //TEACHER ROUTE


export default router;

// router.post("/uploadcourseimage", upload.single("file"), uploadCourseImage);



//get one video of course
//get all videos of course
//delete one video of coursr
