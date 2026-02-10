"use strict";

const express = require('express');
const router = express.Router();
const TaskController = require('../Controllers/TaskController');
const { createTaskValidation, updateTaskValidation } = require('../app/Validators/TaskValidator');
const validate = require('../app/Middlewares/validate');
const { checkAuth, checkAdmin, checkTeacherVerified } = require('../app/Middlewares/Auth');

router.post('/', checkAuth, checkAdmin, checkTeacherVerified, createTaskValidation, validate, TaskController.createTask);
router.post('/:id/assign', checkAuth, checkAdmin, checkTeacherVerified, TaskController.assignTask);
router.get('/', checkAuth, TaskController.getAllTasks);
router.get('/goal/:goalId', checkAuth, TaskController.getTasksByGoal);
router.get('/:id', checkAuth, TaskController.getTaskById);
router.put('/:id', checkAuth, checkAdmin, checkTeacherVerified, updateTaskValidation, validate, TaskController.updateTask);
router.delete('/:id', checkAuth, checkAdmin, checkTeacherVerified, TaskController.deleteTask);

module.exports = router;
