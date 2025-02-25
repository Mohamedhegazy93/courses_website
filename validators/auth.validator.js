import { check } from "express-validator";
import {validatorMiddleware} from '../middlewares/validator.middleware.js'

export const signupValidator = [
    check('fullName')
      .notEmpty()
      .withMessage('fullname required')
      .isLength({ min: 3 })
      .withMessage('Too short User name'),
     
    
  
    check('email')
      .notEmpty()
      .withMessage('Email required')
      .isEmail()
      .withMessage('Invalid email address')
     
      ,
  
    check('password')
      .notEmpty()
      .withMessage('Password required')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),
      validatorMiddleware
      
 
    ]  


     export const loginValidator = [
      check('email')
        .notEmpty()
        .withMessage('Email required')
        .isEmail()
        .withMessage('Invalid email address'),
    
      check('password')
        .notEmpty()
        .withMessage('Password required')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters'),
    
      validatorMiddleware,
    ];