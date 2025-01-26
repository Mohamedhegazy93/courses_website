import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cookieParser from 'cookie-parser'

import {connectDB} from './config/dbConnection.js'



connectDB()
const app = express();
app.use(cookieParser());

app.use(express.json());
import authRoute from './routes/auth.route.js'
import userRoute from './routes/user.route.js'

app.use('/v1/api/auth',authRoute)
app.use('/v1/api/users',userRoute)
const PORT = process.env.PORT || 6000;
app.listen(PORT, () => {
	console.log("Server is running on http://localhost:" + PORT);
	
});
