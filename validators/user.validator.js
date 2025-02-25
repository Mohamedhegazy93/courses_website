import { check } from "express-validator";
import { validatorMiddleware } from "../middlewares/validator.middleware.js";

export const monogIdValidator = [
  check("id")
    .notEmpty()
    .withMessage("id required")
    .isMongoId()
    .withMessage("mongo id falied"),

  validatorMiddleware
];
export const verifyPassResetCodeValidator = [
  check("id")
    .notEmpty()
    .withMessage("id required")
    .isMongoId()
    .withMessage("mongo id falied"),
  check("resetCode")
    .notEmpty()
    .withMessage("resetCode required")
    .isString()
    .withMessage("resetCode must be string"),

  validatorMiddleware,
];
export const updatedPasswordValidator = [
  check("id")
    .notEmpty()
    .withMessage("id required")
    .isMongoId()
    .withMessage("mongo id falied"),
  check("currentPassword")
    .notEmpty()
    .withMessage("currentPassword required")
    .isString()
    .withMessage("currentPassword must br string")
    .isLength({ min: 6 })
    .withMessage("currentPassword failed length"),

  check("newPassword")
    .notEmpty()
    .withMessage("newPassword required")
    .isString()
    .withMessage("newPassword must br string")
    .isLength({ min: 6 })
    .withMessage("newPassword failed length"),

  validatorMiddleware,
];
export const updateUserDataValidator = [
  check("id")
    .notEmpty()
    .withMessage("id required")
    .isMongoId()
    .withMessage("mongo id falied"),

  check("fullName")
    .optional()
    .isString()
    .isLength({ min: 3 })
    .withMessage("Too short User name"),

  check("email")
    .optional()
    .notEmpty()
    .withMessage("Email required")
    .isEmail()
    .withMessage("Invalid email address"),

  check("password")
    .optional()
    .notEmpty()
    .withMessage("Password required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  validatorMiddleware,
];
export const forgetPasswordValidator = [
  check("email").notEmpty().withMessage("email required").isString().isEmail(),
  validatorMiddleware,
];
export const resetPasswordValidator = [
  check("email").notEmpty().withMessage("email required").isString().isEmail(),
  check("newPassword")
    .notEmpty()
    .withMessage("newPassword required")
    .isString(),
  validatorMiddleware,
];
