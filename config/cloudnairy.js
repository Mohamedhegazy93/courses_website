import cloudinary from "cloudinary";
import dotenv from "dotenv";
dotenv.config();
import ApiError from "../utils/apiError.js";
//-------------------------------------------------------------------------\\
cloudinary.config({
  cloud_name: process.env.CLOUDNAIRY_NAME,
  api_key: process.env.CLOUDNAIRY_API_KEY,
  api_secret: process.env.CLOUDNAIRY_API_SECRET,
});
//-------------------------------------------------------------------------\\

export const cloudinaryUpload = async (fileToUploded) => {
  try {
    const data = await cloudinary.uploader.upload(fileToUploded, {
      resource_type: "auto",
    });

    return data;
  } catch (error) {
    return error;
  }
};
//-------------------------------------------------------------------------\\
export const cloudinaryUploadMultiple = async (fileToUploded) => {
  try {
    const data = await cloudinary.uploader.upload(fileToUploded, {
      resource_type: "auto",
    });

    return data;
  } catch (error) {
    return error;
  }
};
//-------------------------------------------------------------------------\\
export const cloudinaryRemove = async (imagePublicId) => {
  try {
    const data = await cloudinary.uploader.destroy(imagePublicId);

    return data;
  } catch (error) {
    return error;
  }
};
