import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from './user.model.js'
import { video } from "framer-motion/client";

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
      duration:String,
      url:String,
      public_id:String
     
     
     
     
    }]
  },
  {
    timestamps: true,
  }
);


courseSchema.statics.calucaule=async function(teacherId){
  const result=await this.aggregate([
    {
      $match:{teacher:teacherId},  //get courses belong to this schema
    },
    {
      $group:{
        _id:'teacher',
        avgPrice:{$avg:'$price'},
        priceQuantity:{$sum:1}


      }
    }

  ]

)

const teacher=await User.findById(teacherId)
teacher.totalCourses=result[0].priceQuantity
console.log(result[0].priceQuantity)
await teacher.save()
console.log(teacher)
console.log(result)

  
  
}


courseSchema.post('save',async function(){
 await this.constructor.calucaule(this.teacher)
 

})


const Course = mongoose.model("Course", courseSchema);

export default Course;
