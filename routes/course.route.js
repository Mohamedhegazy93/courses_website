import express from "express";
import {
  uploadCourseimage,
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
} from "../validators/courses.validator.js";
const router = express.Router();
import { upload} from "../config/multer.js";
//-------------------------------------------------------------------------------------------------------------//
//--Public Routes--//
router.get("/", getAllCourses); 
router.delete("/deleteCourses", deleteCourses); 
router.get("/:courseId", getOneCourse); //get the informations
router.get("/:teacherId/courses",getCoursesOfTeacher); 
//-------------------------------------------------------------------------------------------------------------//
//--Paid Routes--//
router.get("/:id/:videoId", getOneVideo); //Paid
router.get("/:courseId/videos", getVideosOfCourse); //Paid    //get the content
//-------------------------------------------------------------------------------------------------------------//
//--Teacher Routes--//
//create course
// router.post(
//   "/",
//   protectedRoute,
//   teacherRoute,
//   upload.fields([
//     { name: "image", maxCount: 1 },
//     { name: "videos", maxCount: 120 }, // MAX 120 VIDEOS
//   ]),
//   uploadCourseFiles,
//   createCourseValidator,
//   createCourse
// );
router.post(
  "/",
  protectedRoute,
  teacherRoute,
  upload.single('image'),
  uploadCourseimage,
  createCourse
);

//createCourseValidator

//Update Course
router.put(
  "/:id",
  protectedRoute,
  teacherRoute,
  updateCourseValidator,
  updateCourse
);

//Delete Course
router.delete("/:courseId", protectedRoute, teacherRoute, deleteCourse); 
router.delete("/:courseId/:videoId", protectedRoute, teacherRoute, deleteOneVideo); 
//-------------------------------------------------------------------------------------------------------------//
export default router;



//delete one video of course
