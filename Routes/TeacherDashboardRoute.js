"use strict";

const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const TeacherController = require("../Controllers/TeacherController");
const { checkAuth, checkTeacherVerified } = require("../app/Middlewares/Auth");
const validate = require("../app/Middlewares/validate");

const addStudentValidation = [
  body("userId").isInt({ min: 1 }).withMessage("Valid userId is required"),
];

router.get("/progress/:userId", checkAuth, checkTeacherVerified, TeacherController.getStudentProgress);
router.post("/students", checkAuth, checkTeacherVerified, addStudentValidation, validate, TeacherController.addStudent);

module.exports = router;
