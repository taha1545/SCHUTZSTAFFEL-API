"use strict";

const express = require('express');
const router = express.Router();
const UserBadgeController = require('../Controllers/UserBadgeController');
const { createUserBadgeValidation } = require('../app/Validators/UserBadgeValidator');
const validate = require('../app/Middlewares/validate');
const { checkAuth } = require('../app/Middlewares/Auth');

router.post('/', createUserBadgeValidation, validate, UserBadgeController.createUserBadge);
router.get('/', UserBadgeController.getAllUserBadges);
router.get('/user/:userId', UserBadgeController.getUserBadgesByUser);
router.get('/badge/:badgeId', UserBadgeController.getUserBadgesByBadge);
router.get('/:id', UserBadgeController.getUserBadgeById);
router.delete('/:id', UserBadgeController.deleteUserBadge);

module.exports = router;
