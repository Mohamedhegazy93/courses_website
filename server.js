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
import courseRoute from './routes/course.route.js'
import globalError from './middlewares/error.middleware.js'
import ApiError from './utils/apiError.js'


app.use('/v1/api/auth',authRoute)
app.use('/v1/api/users',userRoute)
app.use('/v1/api/courses',courseRoute)

app.all('*', (req, res, next) => {
	next(new ApiError(`Can't find this route: ${req.originalUrl}`, 400));
  });
  
  // Global error handling middleware for express
  app.use(globalError);
const PORT = process.env.PORT || 6000;
app.listen(PORT, () => {
	console.log("Server is running on http://localhost:" + PORT);
	
});
process.on('unhandledRejection', (err) => {
	console.error(`UnhandledRejection Errors: ${err.name} | ${err.message}`);
	server.close(() => {
	  console.error(`Shutting down....`);
	  process.exit(1);
	});
  });
