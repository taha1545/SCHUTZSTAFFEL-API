const { ValidateToken } = require('../Services/Auth');
const AuthError = require('../Error/AuthError');


const checkAuth = (req, res, next) => {
    //
    const authHeader = req.headers.authorization;
    //
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next(new AuthError('No token provided'));
    }
    const token = authHeader.split(' ')[1];
    //
    try {
        const decoded = ValidateToken(token);
        if (!decoded?.id || !decoded?.role) {
            throw new AuthError('Token missing required fields');
        }
        //
        req.user = {
            id: decoded.id,
            role: decoded.role
        };
        next();
    } catch (err) {
        next(new AuthError('Authentication failed: ' + err.message));
    }
};

const checkAdmin = (req, res, next) => {
    if (!req.user) {
        return next(new AuthError('User not authenticated'));
    }
    //
    if (req.user.role !== 'teacher') {
        return next(new AuthError('Admin access required'));
    }
    next();
};

const db = require('../../db/models');

const checkTeacherVerified = async (req, res, next) => {
    if (!req.user || req.user.role !== 'teacher') {
        return next(new AuthError('Teacher access required'));
    }
    try {
        const teacher = await db.Teacher.findByPk(req.user.id);
        if (!teacher) return next(new AuthError('Teacher not found'));
        if (!teacher.isVerified) {
            return next(new AuthError('Account is not verified. Please wait for admin verification.'));
        }
        req.teacher = teacher;
        next();
    } catch (err) {
        next(err);
    }
};

const checkStudent = (req, res, next) => {
    if (!req.user) return next(new AuthError('User not authenticated'));
    if (req.user.role !== 'student') return next(new AuthError('Student access required'));
    next();
};

module.exports = {
    checkAuth,
    checkAdmin,
    checkTeacherVerified,
    checkStudent,
};
