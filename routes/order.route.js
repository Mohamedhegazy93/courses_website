import express from "express";
import {createCashOrder,getAllOrders,getOneOrder,updateOrderToPaid,checkoutSession} from '../controllers/order.controller.js'
import {
    protectedRoute,
    adminRoute

  } from "../middlewares/auth.middleware.js";
  import { monogIdValidator } from "../validators/user.validator.js";
  import {createCashOrderValidator} from '../validators/orders.validator.js'
const router = express.Router();


router.post("/:courseId",protectedRoute,createCashOrderValidator,createCashOrder)
.get("/",protectedRoute,adminRoute,getAllOrders)
.get("/:id",protectedRoute,monogIdValidator,getOneOrder)
.patch("/:id/paid",protectedRoute,adminRoute,monogIdValidator,updateOrderToPaid)
.get("/checkoutsession/:id",protectedRoute,monogIdValidator,checkoutSession)

export default router;
