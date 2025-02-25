import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import asyncHandler from "express-async-handler";
import ApiError from "../utils/apiError.js";
import Course from '../models/course.model.js'
import { dirname } from "path";
import {cloudinaryUpload,cloudinaryRemove} from '../config/cloudnairy.js'
import fs from 'fs'
//GET ALL USERS
//ADMIN ROUTE
export const getAllUsers = async (req, res) => {
  const users = await User.find().lean().select('-password');
  res.json({
    length: users.length,
    data: users,
  });
  if(!users){
    res.json({
      message:"no users founded"
    }).status(400)
  }
};
//GET USER DATA
//USER ROUTE AUTH
export const getOneUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id)
  if (!user) {
    return next(new ApiError(`No USER for this id`, 404));
  }

  if (req.user.userId !== user._id.toString()) {
    return res.json({ messgae: "this is not your data" });
  }

  res.status(200).json({
    data: user,
  });
});

export const getUserProfile = asyncHandler(async (req, res, next) => {
const user=await User.findById(req.params.id).populate({path:'courses',select:'-videos'}).select('-passwordResetCode -password -__v ')
if(!user){
  return next(new ApiError('user not found',400))
}
res.json(user)

});
export const uploadUserImage = asyncHandler(async (req, res, next) => {

  
  const user=await User.findById(req.params.id)
  if(!user){
    return next(new ApiError('user not found',400))
  }
  if (req.user.userId !== req.params.id.toString()) {
    return res.json({ messgae: "this is not your data" });
  }
  //image path
  const imagePath=(dirname,`./uploads/${req.file.filename}`)
  //or   const imagePath=req.file.path
  console.log(req.file)

  //pass image path to upload to cloudinary
  const result =await cloudinaryUpload(imagePath) 
  console.log(imagePath) // secure_url + public_id
  console.log(result,'image')
  //delete old image from DB
 
  if(user.profileImage.public_id!==null){
    await cloudinaryRemove(user.profileImage.public_id)
  }
  //update profileimage in DB
  user.profileImage={
    url:result.secure_url,
    public_id:result.public_id
  }
  await user.save()
 
  res.json({
    message:'image added sucessfully',
    profileImage:{url:result.secure_url, public_id:result.public_id}
})

//remove image from server
fs.unlinkSync(imagePath)


});
//UPDATE USER DATA
//USER ROUTE AUTH
export const updateUserData = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.json({ message: "user not found" });
  }
  if (req.user.userId !== req.params.id.toString()) {
    return res.json({ messgae: "this is not your data" });
  }
  if (req.body.role) {
    return res.json({ message: "you can not change your role" });
  }

  if(req.body.password){
    return res.json({ message: "you can not change your password from here" });


  }

  const updateUser = await User.findByIdAndUpdate(
    req.params.id,
    {
      fullName: req.body.fullName,
      email: req.body.email,
    },
    { new: true }
  );
  await updateUser.save();
  res.json(updateUser);
};
//UNACTIVATE USER
//USER ROUTE AUTH
export const unActivateUser = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.json({ message: "user not found" });
  }
  if (req.user.userId !== req.params.id.toString()) {
    return res.json({ messgae: "this is not your data" });
  }

  if (user.active == false) {
    return res.json({ message: "user already un activate" });
  }

  const unActivated = await User.findByIdAndUpdate(
    req.user.userId,
    {
      active: false,
    },
    { new: true }
  );
  res.json({message:'user unactivate sucessfully'});
};
//ACTIVE USER AGAIN
//USER ROUTE AUTH
export const activateUser = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.json({ message: "user not found" });
  }
  if (req.user.userId !== req.params.id.toString()) {
    return res.json({ messgae: "this is not your data" });
  }

  if (user.active == true) {
    return res.json({ message: "user already is active" });
  }

  const unActivated = await User.findByIdAndUpdate(
    req.user.userId,
    {
      active: true,
    },
    { new: true }
  );
  res.json({message:'user activate sucessfully'});
};
//UPDATE USER PASSWORD
//USER ROUTE AUTH
export const updatePassword = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.json({ message: "user not found" });
  }
  //check user authorization
  if (req.user.userId !== req.params.id.toString()) {
    return res.json({ messgae: "this is not your data" });
  }

  let { currentPassword, newPassword } = req.body;
  //check if user try to enter same password
  if (currentPassword == newPassword) {
    return res.json({ message: "please try another password" });
  }

  //check user currentpassword correct or not

  if (await user.comparePassword(currentPassword)) {
    //encrpt new password
    const salt = await bcrypt.genSalt(10);
    newPassword = await bcrypt.hash(newPassword, salt);
    //update password
    const updatePassword = await User.findByIdAndUpdate(
      req.user.userId,
      {
        password: newPassword,
      },
      { new: true }
    );
    updatePassword.save();
    return res.json({
      message:'password upddated sucessfully'
    });
  } else {
    return res.json({
      message: "your current password is not correct from model",
    });
  }
};
export const forgetPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  console.log(email);
  if (!user) {
    return res.json({ message: "user not found" });
  }

  //send code to user
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  // const hashedResetCode = crypto
  //   .createHash('sha256')
  //   .update(resetCode)
  //   .digest('hex');

  const sendEmail = async (options) => {
    // Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT, // if secure false port = 587, if true port= 465
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // 2) Define email options (like from, to, subject, email content)
    const mailOpts = {
      from: "courses <courses@gmail.com>",
      to: options.email,
      subject: options.subject,
      text: options.message,
    };

    // 3) Send email
    await transporter.sendMail(mailOpts);
    user.passwordResetCode = resetCode;
    await user.save();
  };

  // 3) Send the reset code via email
  const message = `Hi ${user.name},\n We received a request to reset the password on your E-shop Account. \n ${resetCode} \n Enter this code to complete the reset. \n Thanks for helping us keep your account secure.\n The E-shop Team`;
  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset code (valid for 10 min)",
      message,
    });
  } catch (err) {
    user.passwordResetCode = "";

    return res.json({ message: err.message });
  }

  return res.json({
    message: "code sent to email",
  });
};

export const verifyPassResetCode = async (req, res) => {
  const { resetCode } = req.body;
  const user = await User.findOne({
    passwordResetCode: resetCode,
  });

  if (!user) {
    return res.json({
      message:
        "reset code not valid , please click forgetPassword again from settings",
    });
  }
  user.passwordResetCode = "";
  await user.save();
  return res.json({
    message: "verfication resetCode successfully",
  });
};

export const resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;
  if (!email || !newPassword) {
    return res.json({ message: "please fill all fields" });
  }
  const user = await User.findById(req.user.userId);
  if (!user) {
    return res.json({ message: "user not found" });
  }

  if (user.email !== email) {
    return res.json({ message: "incorrect email" });
  }

  if (await user.comparePassword(newPassword)) {
    return res.json({
      message: "this is old password , please try another one",
    });
  }
  const salt = await bcrypt.genSalt(10);
  const newPasswordHashed = await bcrypt.hash(newPassword, salt);

  const updatepassword = await User.findByIdAndUpdate(
    req.user.userId,
    {
      password: newPasswordHashed,
    },
    { new: true }
  );

  await user.save();

  return res.json({
    message: "password update successfully",
  });
};
//----------------------------------------------------------------------- getUserProfile
// export const getUserProfile = async (req, res) => {
//   const user=await User.findById(req.params.id)
//   if(!user){
//     return next(new ApiError('user not found',400))
//   }


// }
