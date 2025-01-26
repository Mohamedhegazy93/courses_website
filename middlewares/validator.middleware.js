import { validationResult } from "express-validator";

// @desc  Finds the validation errors in this request and wraps them in an object with handy functions
export const validatorMiddleware = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

