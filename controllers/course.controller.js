import asyncHandler from "express-async-handler";
import Course from "../models/course.model.js";
import ApiError from "../utils/apiError.js";
import { getVideoDurationInSeconds } from "get-video-duration";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";
import User from "../models/user.model.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
//-----------------------------------------------------------------------
//UPLOAD FILES
export const uploadCourseFiles = asyncHandler(async (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ApiError("please upload course files", 400));
  }
  //upload images
  if (req.files.image) {
    // req.body.image = req.files.filename;
    req.body.image = req.files.image[0].filename;
  }
  //upload videos
  if (req.files.videos) {
    req.body.videos = [];
    const uploadedFilenames = new Set();

    for (const [index, video] of req.files.videos.entries()) {
      const title =
        req.body.videoTitle && req.body.videoTitle[index]
          ? req.body.videoTitle[index]
          : video.originalname;
      //check duplicated videos
      if (uploadedFilenames.has(video.filename)) {
        return next(
          new ApiError(
            `Video with filename ${video.filename} duplicated , please change filename`,
            400
          )
        );
      }

      uploadedFilenames.add(video.filename);
      //get video duration in secs
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
            title,
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
//-----------------------------------------------------------------------
//CREATE COURSE
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
  const user = await User.findById(req.user.userId);
  user.createdCourses.push(courseCreate._id);
  await user.save(); // Add the new course's ID

  return res.json(courseCreate);
});
//-----------------------------------------------------------------------
//GET ALL COURSES
export const getAllCourses = asyncHandler(async (req, res, next) => {
  const queryStringObj = { ...req.query };
  const excludesFields = ["page", "sort", "limit", "fields"];
  excludesFields.forEach((field) => delete queryStringObj[field]);
  let queryStr = JSON.stringify(queryStringObj);
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 20;
  const skip = (page - 1) * limit;

  let mongooseQuery = Course.find(JSON.parse(queryStr))
    .skip(skip)
    .limit(limit)
    .populate("teacher", "fullName -_id")
    .select("-__v -videos -description");

  if (req.query.sort) {
    console.log(req.query.sort);
    let sortby = req.query.sort.split(",").join(" ");
    mongooseQuery = mongooseQuery.sort(sortby);
  }

  const courses = await mongooseQuery;
  if (!courses) {
    return next(new ApiError("no courses yet", 400));
  }
  res.json({
    length: courses.length,
    page,
    data: courses,
  });
});
//-----------------------------------------------------------------------
//GET ONE COURSE
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
export const getOneVideo = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id);
  if (!course) {
    return next(new ApiError("course not found", 400));
  }

  const video = course.videos.find(
    (video) => video._id.toString() === req.params.videoId
  );

  if (!video) {
    return next(new ApiError("video not found", 400));
  }

  res.json(video);
});
//-----------------------------------------------------------------------
//UPDATE COURSE
export const updateCourse = asyncHandler(async (req, res, next) => {
  const { courseId } = req.params;
  const { title, description, level, price } = req.body;

  const course = await Course.findById(req.params.courseId);
  if (!course) {
    return next(new ApiError("Course not found", 404));
  }
  if (req.user.userId.toString() !== course.teacher._id.toString()) {
    return next(
      new ApiError("You are not authorized to update this course", 403)
    );
  }
  const updatedCourse = await Course.findByIdAndUpdate(
    courseId,
    { title, description, level, price },
    { new: true, runValidators: true }
  );

  await updatedCourse.save();

  if (!updatedCourse) {
    return next(new ApiError("Failed to update course", 500));
  }

  res.status(200).json({
    message: "Course information updated successfully",
    data: updatedCourse,
  });
});
//-----------------------------------------------------------------------
//DELETE COURSE
export const deleteCourse = asyncHandler(async (req, res, next) => {
  const findCourse = await Course.findById(req.params.courseId);
  if (!findCourse) {
    return next(new ApiError("course not found", 400));
  }
  if (req.user.userId.toString() !== findCourse.teacher._id.toString()) {
    return next(new ApiError("you can not perfrom this action", 400));
  }

  const course = await Course.findByIdAndDelete(req.params.courseId);

  if (course) {
    await Course.calucaule(course.teacher); // to change numbers of total courses for this teacher
  }

  res.json({ message: "Course Deleted" });
});

//delete videos from course
//coupon
//buy course
//chat between teacher and student
