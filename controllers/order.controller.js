import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import asyncHandler from "express-async-handler";
import ApiError from "../utils/apiError.js";
import Course from "../models/course.model.js";
import Order from "../models/order.model.js";
import dotenv from "dotenv";
dotenv.config();
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET);

export const createCashOrder = asyncHandler(async (req, res, next) => {
  //get course id
  const course = await Course.findById(req.params.courseId);
  if (!course) {
    return next(new ApiError("course not found"));
  }

  const coursePrice = course.price;

  const order = await Order.create({
    user: req.user.userId,
    orderedCourse: req.params.courseId,
    price: course.price,
    address: req.body.address,
  });

  res.json({
    message: "order created sucessfully",
    order,
  });
});

export const getAllOrders = asyncHandler(async (req, res, next) => {
  const orders = await Order.find();
  res.json({
    length: orders.length,
    orders,
  });
});
export const getOneOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if(req.user.userId!==order.user.toString()){
    return next(new ApiError("cant get this order"));


  }
  res.json({
    order,
  });
});

export const updateOrderToPaid = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.orderId);
  if (!order) {
    return next(new ApiError("order not found"));
  }

  if(order.isPaid==true){
    return next(new ApiError("order already paid"));
  }

  order.isPaid = true;
  order.payedAt = Date.now();
  order.isDeliverd = true;

  const updatedOrder = await order.save();
  res.json({
    message: "oreder updated to paid sucessfully",
    updatedOrder,
  });
});

export const checkoutSession = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id);
  if (!course) {
    return next(new ApiError("course not found"));
  }
  const user = await User.findById(req.user.userId);
  if (!user) {
    return next(new ApiError("user not found"));
  }
  //price
  const coursePrice = course.price;

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "egp",
          product_data: {
            name: course.title,
          },
          unit_amount: coursePrice * 100,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${req.protocol}://${req.get("host")}`,
    cancel_url: `${req.protocol}://${req.get("host")}/course`,
    customer_email: user.email,
    client_reference_id: req.params.id,
    metadata: req.body.address,
  });

  res.json({
    message: "session successfull",

    session,
  });
});
