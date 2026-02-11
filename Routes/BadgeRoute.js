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

router.post('/', upload.single('image'), createBadgeValidation, validate, BadgeController.createBadge);
router.put('/:id', updateBadgeValidation, validate, BadgeController.updateBadge);
router.delete('/:id', BadgeController.deleteBadge);

module.exports = router;
