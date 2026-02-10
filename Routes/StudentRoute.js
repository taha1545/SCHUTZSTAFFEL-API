"use strict";

const express = require("express");
const router = express.Router();
const StudentController = require("../Controllers/StudentController");
const { checkAuth, checkStudent } = require("../app/Middlewares/Auth");

router.get("/dashboard", checkAuth, checkStudent, StudentController.getDashboard);

module.exports = router;
