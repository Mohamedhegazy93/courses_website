import { check } from "express-validator";
import { validatorMiddleware } from "../middlewares/validator.middleware.js";

export const createCourseValidator = [
  check("title")
    .notEmpty()
    .withMessage("title required")
    .isString()
    .withMessage("title must be string"),

  check("description").notEmpty().withMessage("description required"),
  check("level").notEmpty().withMessage("level required"),
  check("price")
    .notEmpty()
    .withMessage("price required")
    .isNumeric()
    .withMessage("price must be number"),

  validatorMiddleware,
];
