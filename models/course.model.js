import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "description is required"],
      lowercase: true,
      trim: true,
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require:true
    },

    level: {
      type: String,
      required: [true, "you should choose a level"],
      enum: ["begineers", "immdiate", "advanced", "all_levels"],
    },
    price: {
      type: Number,
      required:true
    },
    image: {
      type: String,
      required:true
    },
    videos:[{
      filename:String,
      title:String,
      duration:String
    }]
  },
  {
    timestamps: true,
  }
);

const Course = mongoose.model("Course", courseSchema);

export default Course;
