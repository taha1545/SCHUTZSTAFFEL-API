"use strict";

const express = require('express');
const router = express.Router();
const UserController = require('../Controllers/UserController');
const { updateUserValidation, updateGamificationValidation } = require('../app/Validators/UserValidator');
const validate = require('../app/Middlewares/validate');
const { checkAuth, checkAdmin } = require('../app/Middlewares/Auth');

router.get('/me', checkAuth, UserController.getUserByToken);
router.get('/', checkAuth, checkAdmin, UserController.getAllUsers);
router.get('/:id', checkAuth, checkAdmin, UserController.getUserById);

router.put('/me', checkAuth, updateUserValidation, validate, UserController.updateUserByToken);
router.delete('/:id', checkAuth, checkAdmin, UserController.deleteUserById);

router.get('/search', UserController.searchUserByNameOrEmail);
router.get('/by-goal/:goalId', UserController.getUsersByGoal);

module.exports = router;
