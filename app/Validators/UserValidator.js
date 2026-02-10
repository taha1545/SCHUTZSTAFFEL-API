const { body } = require('express-validator');
const db = require('../../db/models');

const loginValidation = [
    body('uniqueCode')
        .notEmpty().withMessage('uniqueCode is required')
        .isString()
        .custom(async (uniqueCode) => {
            if (!uniqueCode) return true;
            const existing = await db.User.findOne({ where: { uniqueCode } });
            if (!existing) throw new Error('uniqueCode does not exist');
        }),
];

const signupValidation = [
    body('fullName').notEmpty().withMessage('Full name is required'),
    //
    body('email')
        .isEmail().withMessage('Valid email is required')
        .custom(async (email) => {
            const existingUser = await db.User.findOne({ where: { email } });
            if (existingUser) {
                throw new Error('Email is already in use');
            }
        }),
    //
    body('grade').optional().isString().withMessage('grade must be a string'),
];


const updateUserValidation = [
    body('fullName')
        .optional()
        .notEmpty()
        .withMessage('Full name cannot be empty'),
    body('email')
        .optional()
        .isEmail()
        .withMessage('Must be a valid email address')
        .custom(async (email, { req }) => {
            const userId = req.user?.id;
            const existingUser = await db.User.findOne({ where: { email } });
            if (existingUser && existingUser.id !== userId) {
                throw new Error('Email is already in use');
            }
        }),
    body('grade').optional().isString().withMessage('grade must be a string'),
];

const updateGamificationValidation = [
    body('xpPoints').optional().isInt({ min: 0 }).withMessage('xpPoints must be a non-negative integer'),
    body('level').optional().isInt({ min: 1 }).withMessage('level must be an integer >= 1'),
    body('currentStreak').optional().isInt({ min: 0 }).withMessage('currentStreak must be a non-negative integer'),
    body('badges').optional().isArray().withMessage('badges must be an array of badge ids')
        .custom(async (arr) => {
            const db = require('../../db/models');
            for (const id of arr) {
                const b = await db.Badge.findByPk(id);
                if (!b) throw new Error(`Badge id ${id} does not exist`);
            }
            return true;
        }),
];

module.exports = {
    loginValidation,
    signupValidation,
    updateUserValidation,
    updateGamificationValidation,
};
