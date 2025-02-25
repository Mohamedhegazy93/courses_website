import { check } from "express-validator";
import { validatorMiddleware } from "../middlewares/validator.middleware.js";

export const createCashOrderValidator = [
  check("courseId")
    .notEmpty()
    .withMessage("id required")
    .isMongoId()
    .withMessage("mongo id falied"),
  check("address").notEmpty().withMessage("address required").isString(),

  check("orderedCourse")
    .optional()
    .notEmpty()
    .withMessage("orderedCourse required")
    .isMongoId(),
  check("user").optional().notEmpty().withMessage("user required").isMongoId(),
  check("price")
    .optional()
    .notEmpty()
    .withMessage("price required")
    .isNumeric(),

  validatorMiddleware,
];
