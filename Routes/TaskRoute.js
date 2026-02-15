"use strict";

const express = require('express');
const router = express.Router();
const TaskController = require('../Controllers/TaskController');
const { createTaskValidation, updateTaskValidation } = require('../app/Validators/TaskValidator');
const validate = require('../app/Middlewares/validate');
const { checkAuth, checkAdmin, checkTeacherVerified } = require('../app/Middlewares/Auth');

router.post('/', checkAuth, checkTeacherVerified, createTaskValidation, validate, TaskController.createTask);
router.post('/:id/assign', checkAuth, checkTeacherVerified, TaskController.assignTask);
//
router.get('/', TaskController.getAllTasks);
router.get('/deadline', TaskController.getAllTasksByDeadline);
router.get('/goal/:goalId', TaskController.getTasksByGoal);
router.get('/:id', TaskController.getTaskById);
//
router.put('/:id', checkAuth, checkTeacherVerified, updateTaskValidation, validate, TaskController.updateTask);
router.delete('/:id', checkAuth, checkTeacherVerified, TaskController.deleteTask);

module.exports = router;
