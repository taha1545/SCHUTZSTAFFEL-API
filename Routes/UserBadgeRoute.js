"use strict";

const express = require('express');
const router = express.Router();
const UserBadgeController = require('../Controllers/UserBadgeController');
const { createUserBadgeValidation } = require('../app/Validators/UserBadgeValidator');
const validate = require('../app/Middlewares/validate');
const { checkAuth } = require('../app/Middlewares/Auth');

router.post('/', checkAuth, createUserBadgeValidation, validate, UserBadgeController.createUserBadge);
router.get('/', checkAuth, UserBadgeController.getAllUserBadges);
router.get('/user/:userId', checkAuth, UserBadgeController.getUserBadgesByUser);
router.get('/badge/:badgeId', checkAuth, UserBadgeController.getUserBadgesByBadge);
router.get('/:id', checkAuth, UserBadgeController.getUserBadgeById);
router.delete('/:id', checkAuth, UserBadgeController.deleteUserBadge);

module.exports = router;
