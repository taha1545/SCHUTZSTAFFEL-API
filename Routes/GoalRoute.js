"use strict";

const express = require('express');
const router = express.Router();
const GoalController = require('../Controllers/GoalController');
const { createGoalValidation, updateGoalValidation } = require('../app/Validators/GoalValidator');
const validate = require('../app/Middlewares/validate');
const { checkAuth, checkAdmin, checkTeacherVerified } = require('../app/Middlewares/Auth');

router.post('/', checkAuth, checkAdmin, checkTeacherVerified, createGoalValidation, validate, GoalController.createGoal);
router.get('/', checkAuth, GoalController.getAllGoals);
router.get('/teacher/:teacherId', checkAuth, checkTeacherVerified, GoalController.getGoalsByTeacher);
router.get('/:id', checkAuth, GoalController.getGoalById);
router.put('/:id', checkAuth, checkAdmin, checkTeacherVerified, updateGoalValidation, validate, GoalController.updateGoal);
router.delete('/:id', checkAuth, checkAdmin, checkTeacherVerified, GoalController.deleteGoal);

module.exports = router;
