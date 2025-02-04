import asyncHandler from "express-async-handler";
import Course from "../models/course.model.js";
import ApiError from "../utils/apiError.js";
import { getVideoDurationInSeconds } from "get-video-duration";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const uploadCourseFiles = asyncHandler(async (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ApiError("image not found , please upload image", 400));
  }
  if (req.files.image) {
    // req.body.image = req.files.filename;
    req.body.image = req.files.image[0].filename;
  }

  if (req.files.videos) {
    req.body.videos = [];
    const uploadedFilenames = new Set();

    for (const [index, video] of req.files.videos.entries()) {
      // **هنا يتم استخدام req.body.videoTitle إذا كان موجوداً، وإلا يتم استخدام اسم الملف كعنوان افتراضي**
      const title =
        req.body.videoTitle && req.body.videoTitle[index]
          ? req.body.videoTitle[index]
          : video.originalname;

      if (uploadedFilenames.has(video.filename)) {
        return next(
          new ApiError(
            `Video with filename ${video.filename} duplicated , please change filename`,
            400
          )
        );
      }

      uploadedFilenames.add(video.filename);

      try {
        const videoPath = path.join(__dirname, "..", "uploads", video.filename);

        if (fs.existsSync(videoPath)) {
          let durationInSeconds = await getVideoDurationInSeconds(videoPath);
          const durationInMinutes = Math.floor(durationInSeconds / 60);
          const remainingSeconds = Math.round(durationInSeconds % 60);
          const formattedDuration = `${durationInMinutes}:${
            remainingSeconds < 10 ? "0" + remainingSeconds : remainingSeconds
          }`;

          req.body.videos.push({
            filename: video.filename,
            title, // **يتم استخدام العنوان الذي أدخله المستخدم هنا**
            duration: formattedDuration,
          });
        } else {
          console.error("File not found:", videoPath);
          return next(
            new ApiError(`Video file not found: ${video.filename}`, 400)
          );
        }
      } catch (error) {
        console.error(`Error processing video ${video.filename}:`, error);
        return next(
          new ApiError(
            `Error processing video ${video.filename}: ${error.message}`,
            500
          )
        );
      }
    }
  }

  next();
});

export const createCourse = asyncHandler(async (req, res) => {
  const { title, description, level, price, teacher, image, videos } = req.body;
  const courseCreate = await Course.create({
    title,
    description,
    level,
    price,
    teacher: req.user.userId,
    image,
    videos,
  });

  return res.json(courseCreate);
});
export const getAllCourses = asyncHandler(async (req, res, next) => {
  const courses = await Course.find()
    .populate("teacher", "fullName -_id")
    .select("-__v -videos -description");
  if (!courses) {
    return next(new ApiError("no courses yet", 400));
  }
  res.json({
    length:courses.length,
    data:courses
  });
});
export const getOneCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.courseId).populate(
    "teacher",
    "fullName -_id"
  );
  if (!course) {
    return next(new ApiError("course not found", 400));
  }
  res.json(course);
});
export const deleteCourse = asyncHandler(async (req, res, next) => {

  const findCourse=await Course.findById(req.params.courseId)
  if (!findCourse) {
    return next(new ApiError("course not found", 400));
  }
  if(req.user.userId.toString()!==findCourse.teacher._id.toString()){
    return next(new ApiError("you can not perfrom this action", 400));


  }
  
  const course = await Course.findByIdAndDelete(req.params.courseId);
 
  res.json({ message: "Course Deleted" });
});




//update coures
//delete videos from course
//coupon
//buy course
//chat between teacher and student
