"use strict";

const express = require('express');
const router = express.Router();
const GradeController = require('../Controllers/GradeController');

router.get('/', GradeController.getAllGrades);

module.exports = router;
