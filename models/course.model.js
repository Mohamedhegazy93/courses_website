import mongoose from "mongoose";
import User from "./user.model.js";


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
      title:String,
     
    }]
  },
  {
    timestamps: true,
  }
);

// courseSchema.aggregate([
//   {
//     $match
//   }
// ])
courseSchema.statics.calculateAvragePriceForTeacher=async function(teacherId){   //call it every time create course
  const result=await this.aggregate([
    {
      $match:{teacher:teacherId},
      
    },
   { $group:{_id:'teacher',avgPricePerCourse:{$avg:'$price'}}}
  ])
  console.log(result)
  if(result.length > 0){
    await User.findByIdAndUpdate(teacherId,{
      avgPricePerCourse:result[0].avgPricePerCourse
    })
  }else{
    await User.findByIdAndUpdate(teacherId,{
      avgPricePerCourse:0
    })

  }

}

courseSchema.post('save',async function(){   //call it at controller
await this.constructor.calculateAvragePriceForTeacher(this.teacher)

})
courseSchema.post('remove',async function(){   //call it at controller
await this.constructor.calculateAvragePriceForTeacher(this.teacher)

})


const Course = mongoose.model("Course", courseSchema);

export default Course;
