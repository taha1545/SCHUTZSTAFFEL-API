"use strict";

const express = require('express');
const router = express.Router();

const upload = require('../app/s3/multerS3');
const getImageService = require('../app/s3/getImageService');

router.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    res.json({
        message: 'File uploaded successfully',
        url: req.file.location,
        key: req.file.key
    });
});

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
const gradeRoute = require('./GradeRoute');

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
router.use('/grades', gradeRoute);

//
router.get('/image/:key(*)', async (req, res) => {
    try {
        const imageKey = req.params.key;
        if (!imageKey) {
            return res.status(400).json({ error: "Key is required" });
        }
        const signedUrl = await getImageService.getImage(imageKey);
        res.redirect(signedUrl);
    } catch (err) {
        console.error("Error fetching image:", err);
        res.status(500).json({
            error: "Could not fetch image",
            details: err.message
        });
    }
});

module.exports = router;