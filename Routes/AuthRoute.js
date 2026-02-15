"use strict";

const express = require("express");
const router = express.Router();
//
const AuthController = require("../Controllers/AuthController");
const UserValidator = require("../app/Validators/UserValidator");
const {
  createTeacherValidation,
  loginTeacherValidation,
} = require("../app/Validators/TeacherValidator");
const validate = require("../app/Middlewares/validate");

// Student 
router.post("/student/signup", UserValidator.signupValidation, validate, AuthController.signUp);
router.post("/student/login", UserValidator.loginValidation, validate, AuthController.login);

// Teacher 
router.post(
  "/teacher/signup",
  createTeacherValidation,
  validate,
  AuthController.teacherSignup
);
router.post(
  "/teacher/login",
  loginTeacherValidation,
  validate,
  AuthController.teacherLogin
);

// Teacher password reset
router.post('/reset-password', AuthController.resetPassword);

module.exports = router;
