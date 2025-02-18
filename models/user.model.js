import mongoose from "mongoose";
import  bcrypt from 'bcryptjs'


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
		avgPricePerCourse:{
			type:Number,
			default:undefined
		}

		
    
		
		
	},
	{
		timestamps: true,
		toJSON:{virtuals:true},
		toObject:{virtuals:true}
	}
);

userSchema.virtual('courses',{
	ref:'Course',
	foreignField:'teacher',
	localField:'_id'
})


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
