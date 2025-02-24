import express from "express";
import {createCashOrder,getAllOrders,getOneOrder,updateOrderToPaid,checkoutSession} from '../controllers/order.controller.js'
import {
    protectedRoute,

  } from "../middlewares/auth.middleware.js";
const router = express.Router();

router.post("/:courseId",protectedRoute,createCashOrder);
router.get("/",getAllOrders);
router.get("/:orderId",protectedRoute,getOneOrder);
router.patch("/:orderId/paid",protectedRoute,updateOrderToPaid);
router.get("/checkoutsession/:courseId",protectedRoute,checkoutSession);

export default router;
