"use strict";

const express = require('express');
const router = express.Router();
const UserTaskController = require('../Controllers/UserTaskController');
const { createUserTaskValidation, updateUserTaskValidation } = require('../app/Validators/UserTaskValidator');
const validate = require('../app/Middlewares/validate');
const { checkAuth } = require('../app/Middlewares/Auth');

router.post('/', checkAuth, createUserTaskValidation, validate, UserTaskController.createUserTask);
router.get('/', checkAuth, UserTaskController.getAllUserTasks);
router.get('/user/:userId', checkAuth, UserTaskController.getUserTasksByUser);
router.get('/task/:taskId', checkAuth, UserTaskController.getUserTasksByTask);
router.get('/:id', checkAuth, UserTaskController.getUserTaskById);
router.put('/:id', checkAuth, updateUserTaskValidation, validate, UserTaskController.updateUserTask);
router.delete('/:id', checkAuth, UserTaskController.deleteUserTask);

module.exports = router;
