"use strict";

const express = require('express');
const router = express.Router();
const TeacherController = require('../Controllers/TeacherController');
const { createTeacherValidation, updateTeacherValidation, loginTeacherValidation } = require('../app/Validators/TeacherValidator');
const validate = require('../app/Middlewares/validate');
const { checkAuth, checkAdmin, checkTeacherVerified } = require('../app/Middlewares/Auth');


router.post('/', createTeacherValidation, validate, TeacherController.createTeacher);
router.get('/', TeacherController.getAllTeachers);
router.get('/:id', TeacherController.getTeacherById);
router.put('/:id', checkAuth, checkTeacherVerified, updateTeacherValidation, validate, TeacherController.updateTeacher);
router.delete('/:id', checkAuth, checkAdmin, checkTeacherVerified, TeacherController.deleteTeacher);

module.exports = router;
