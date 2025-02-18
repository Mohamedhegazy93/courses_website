import asyncHandler from "express-async-handler";
import Course from "../models/course.model.js";
import ApiError from "../utils/apiError.js";
import { getVideoDurationInSeconds } from "get-video-duration";
import getVideoDuration  from'get-video-duration';
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";
import User from "../models/user.model.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import {cloudinaryUpload,cloudinaryRemove} from '../config/cloudnairy.js'
//-----------------------------------------------------------------------
//UPLOAD FILES
export const uploadCourseimage = asyncHandler(async (req, res, next) => {
  
  if (!req.file) {
    return next(new ApiError("please upload course files", 400));
  }
   const imagePath=req.file.path

  const result = await cloudinaryUpload(
    imagePath
  );
  // console.log(req.files.image[0].path,'req.files.image[0].path')  uploads\xxxxxxxx.jpg req.files.image[0].path

  req.body.image = result.secure_url;
  fs.unlinkSync(imagePath); 



  
 
  //upload videos
 
  next();
});

export const getCoursesOfTeacher = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.teacherId);
  if (!user) {
    return next(new ApiError("user not found", 400));
  }

  const courses = await Course.find({ teacher: req.params.teacherId }).select(
    "title price level"
  );

  return res.json({
    length: courses.length,
    data: courses,
  });
});
export const getVideosOfCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.courseId);
  if (!course) {
    return next(new ApiError("user not found", 400));
  }
  res.json({
    length: course.videos.length,
    videos: course.videos,
  });
});
export const getOneVideoOfCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.courseId);
  if (!course) {
    return next(new ApiError("user not found", 400));
  }
  res.json({
    length: course.videos.length,
    videos: course.videos,
  });
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
    .select("_id title teacher image createdAt");

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
  )
  if (!course) {
    return next(new ApiError("course not found", 400));
  }
  res.json({
    number_of_lectures:course.videos.length,
    
    course
  });
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
  const { title, description, level, price } = req.body;

  const course = await Course.findById(req.params.id);
  if (!course) {
    return next(new ApiError("Course not found", 404));
  }
  if (req.user.userId.toString() !== course.teacher._id.toString()) {
    return next(
      new ApiError("You are not authorized to update this course", 403)
    );
  }
  const updatedCourse = await Course.findByIdAndUpdate(
    req.params.id,
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

  const course=await Course.findById(req.params.courseId)
 

  const deletedCourse = await Course.findByIdAndDelete(req.params.courseId);
  if (req.user.userId.toString() !== course.teacher._id.toString()) {
    return next(new ApiError("you can not perfrom this action", 400));
  }
  if(!course){
    return next(new ApiError("course not found", 400));


  }
  await Course.calculateAvragePriceForTeacher(deletedCourse.teacher);




  res.json({ message: "Course Deleted" });
});
export const deleteCourses = asyncHandler(async (req, res, next) => {
 const courses=await Course.deleteMany()

 res.json('all courses deleteettetetetetetetd')
});
//-----------------------------------------------------------------------
//DELETE VIDEO FROM COURSE
export const deleteOneVideo = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.courseId);
  if (!course) {
    return next(new ApiError("course not found", 400));
  }
  const video = course.videos.find(
    (ele) => ele._id.toString() === req.params.videoId
  );
  //filter

  if (!video) {
    return next(new ApiError("video not found", 400));
  }
  console.log(video);
  await Course.findByIdAndUpdate(
    req.params.courseId,
    { $pull: { videos: { _id: req.params.videoId } } },
    { new: true }
  );
  res.json({
    message: "video deleted",
  });
});

//delete videos from course
//coupon
//buy course
//chat between teacher and student
