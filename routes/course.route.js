import express from "express";
import {
  uploadCourseFiles,
  createCourse,
  getOneCourse,
  getAllCourses,
  deleteCourse,
  updateCourse,
  getOneVideo,
  getCoursesOfTeacher,
  getVideosOfCourse,
  deleteOneVideo,
  deleteCourses,
} from "../controllers/course.controller.js";
import {
  protectedRoute,
  teacherRoute,
} from "../middlewares/auth.middleware.js";
import {
  createCourseValidator,
  updateCourseValidator,
  getOneVideoValidator,
} from "../validators/courses.validator.js";
import { monogIdValidator } from "../validators/user.validator.js";
const router = express.Router();
import { upload } from "../config/multer.js";
//-------------------------------------------------------------------------------------------------------------//
//--Public Routes--//
router
  .get("/", getAllCourses)
  .get("/:id", monogIdValidator, getOneCourse) //get the informations
  .get("/:id/courses", monogIdValidator, getCoursesOfTeacher);
//-------------------------------------------------------------------------------------------------------------//
//--Paid Routes--//
router.get("/:id/:videoId", getOneVideoValidator, getOneVideo); //Paid
router.get("/:id/videos", monogIdValidator, getVideosOfCourse); //Paid    //get the content
//-------------------------------------------------------------------------------------------------------------//
//--Teacher Routes--//
//create course
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
);
//Update Course
router.put(
  "/:id",
  protectedRoute,
  teacherRoute,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "videos", maxCount: 120 }, // MAX 120 VIDEOS
  ]),
  updateCourseValidator,
  updateCourse
);

//Delete Course
router.delete(
  "/:id",
  protectedRoute,
  teacherRoute,
  monogIdValidator,
  deleteCourse
);
router.delete(
  "/:id/:videoId",
  protectedRoute,
  teacherRoute,
  monogIdValidator,
  deleteOneVideo
);
//-------------------------------------------------------------------------------------------------------------//
export default router;

//delete one video of course
