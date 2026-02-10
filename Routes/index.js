"use strict";

const express = require('express');
const router = express.Router();

const authRoute = require('./AuthRoute');
const contactRoute = require('./ContactRoute');
const googleRoute = require('./GoogleRoute');
const userRoute = require('./UserRoute');
const studentRoute = require('./StudentRoute');
const teacherRoute = require('./TeacherRoute');
const TeacherDashboardRoute = require('./TeacherDashboardRoute');
const goalRoute = require('./GoalRoute');
const taskRoute = require('./TaskRoute');
const userTaskRoute = require('./UserTaskRoute');
const badgeRoute = require('./BadgeRoute');
const userBadgeRoute = require('./UserBadgeRoute');

router.use('/auth', authRoute);
router.use('/contact', contactRoute);
router.use('/google', googleRoute);
router.use('/users', userRoute);
router.use('/student', studentRoute);
router.use('/teachers', teacherRoute);
router.use('/teacher', TeacherDashboardRoute);
router.use('/goals', goalRoute);
router.use('/tasks', taskRoute);
router.use('/user-tasks', userTaskRoute);
router.use('/badges', badgeRoute);
router.use('/user-badges', userBadgeRoute);

module.exports = router;