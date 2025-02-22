import { check, param } from "express-validator";
import { validatorMiddleware } from "../middlewares/validator.middleware.js";

export const createCourseValidator = [
  check("title")
    .notEmpty()
    .withMessage("title required , please add title to video")
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

export const updateCourseValidator = [
  check("title").optional().isString().withMessage("title must be string"),

  check("description")
    .optional()
    .isString()
    .withMessage("description must be string"),
  check("level")
    .optional()
    .isIn(["begineers", "immdiate", "advanced", "all_levels"])
    .withMessage(
      "Invalid level. Must be one of: begineers, immdiate, advanced, all_levels"
    ),

  check("price").optional().isNumeric().withMessage("price must be number"),

  validatorMiddleware,
];

export const MonogIdValidator = [
  check("courseId").isMongoId().withMessage("invalid monogo id format"),

  validatorMiddleware,
];
export const updateUserDataValidator = [
  check("id").isMongoId().withMessage("invalid monogo id format"),

  validatorMiddleware,
];
