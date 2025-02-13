import mongoose from "mongoose";
import  bcrypt from 'bcryptjs'
import { object } from "framer-motion/client";


const userSchema = new mongoose.Schema(
	{
		fullName: {
			type: String,
			required: [true, "Name is required"],
		},
		profileImage:{
			type:Object,
			default:{
				url:'https://pixabay.com/vectors/man-avatar-user-drawing-sketch-157699/',
				public_id:null
			}
		},
		email: {
			type: String,
			required: [true, "Email is required"],
			unique: true,
			lowercase: true,
			trim: true,
		},
		password: {
			type: String,
			required: [true, "Password is required"],
			minlength: [6, "Password must be at least 6 characters"],
			maxlength: [100, "Password must be at most 30 characters"],
		},
		cartItems: [
			{
				quantity: {
					type: Number,
					default: 1,
				},
				course: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "Course",
				},
			},
		],
		role: {
			type: String,
            required:[true,'you should choose a role'],
			enum: ["student","teacher", "admin"],
			
		},
		active: {
			type: Boolean,
			enum: [true,false],
			default:true,
		
		},
		passwordResetCode: {
			type: String,
			default:'',
		
		},
		totalCourses:{
			type:Number,
			
		},
		createdCourses: [ // Array to store ObjectIds of created courses
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Course", // Referencing the Course model
            },
        ],

    
		
		
	},
	{
		timestamps: true,
	}
);


// Pre-save hook to hash password before saving to database
userSchema.pre("save", async function (next) {
	if (!this.isModified("password")) return next();

	try {
		const salt = await bcrypt.genSalt(10);
		this.password = await bcrypt.hash(this.password, salt);
		next();
	} catch (error) {
		next(error);
	}
});

userSchema.methods.comparePassword = async function (password) {
	return bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
