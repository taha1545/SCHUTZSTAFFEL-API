"use strict";

const express = require('express');
const router = express.Router();
const BadgeController = require('../Controllers/BadgeController');
const { createBadgeValidation, updateBadgeValidation } = require('../app/Validators/BadgeValidator');
const validate = require('../app/Middlewares/validate');
const { checkAuth, checkAdmin } = require('../app/Middlewares/Auth');
const upload = require('../app/Services/Storage')

router.get('/', BadgeController.getAllBadges);
router.get('/:id', BadgeController.getBadgeById);

router.post('/', upload.single('image'), checkAuth, checkAdmin, createBadgeValidation, validate, BadgeController.createBadge);
router.put('/:id', checkAuth, checkAdmin, updateBadgeValidation, validate, BadgeController.updateBadge);
router.delete('/:id', checkAuth, checkAdmin, BadgeController.deleteBadge);

module.exports = router;
