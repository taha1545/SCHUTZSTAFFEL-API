"use strict";

const express = require('express');
const router = express.Router();
const GoalController = require('../Controllers/GoalController');
const { createGoalValidation, updateGoalValidation } = require('../app/Validators/GoalValidator');
const validate = require('../app/Middlewares/validate');
const { checkAuth, checkAdmin, checkTeacherVerified } = require('../app/Middlewares/Auth');

router.post('/', checkAuth, checkTeacherVerified, createGoalValidation, validate, GoalController.createGoal);
router.get('/', GoalController.getAllGoals);
router.get('/teacher/:teacherId', GoalController.getGoalsByTeacher);
router.get('/:id', GoalController.getGoalById);
//
router.put('/:id', checkAuth, checkTeacherVerified, updateGoalValidation, validate, GoalController.updateGoal);
router.delete('/:id', checkAuth, checkTeacherVerified, GoalController.deleteGoal);

module.exports = router;
