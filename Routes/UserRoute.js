"use strict";

const express = require('express');
const router = express.Router();
const UserController = require('../Controllers/UserController');
const { updateUserValidation, updateGamificationValidation } = require('../app/Validators/UserValidator');
const validate = require('../app/Middlewares/validate');
const { checkAuth, checkAdmin, checkTeacherVerified } = require('../app/Middlewares/Auth');

router.get('/me', checkAuth, UserController.getUserByToken);
router.get('/', UserController.getAllUsers);
router.get('/search', UserController.searchUserByNameOrEmail);
router.get('/by-goal/:goalId', UserController.getUsersByGoal);
router.get('/ranking', UserController.getRanking);
router.get('/most-active-week', UserController.getMostActiveThisWeek);
router.get('/:id', UserController.getUserById);

router.put('/me', checkAuth, updateUserValidation, validate, UserController.updateUserByToken);
router.delete('/:id', checkAuth, checkTeacherVerified, UserController.deleteUserById);


module.exports = router;
