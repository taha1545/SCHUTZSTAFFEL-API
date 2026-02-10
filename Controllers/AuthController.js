const Auth = require('../app/Services/Auth');
const welcomeMail = require('../app/Services/WelcomeMail');
const UserResource = require('../app/Resource/UserResource');
const TeacherResource = require('../app/Resource/TeacherResource');
const TeacherService = require('../app/Services/TeacherService');
const AuthError = require('../app/Error/AuthError');
const db = require('../db/models');
const notfoundError = require('../app/Error/NotFoundError');
const crypto = require('crypto');

const signUp = async (req, res) => {
    const { fullName, email, grade } = req.body;
    const uniqueCode = crypto.randomBytes(16).toString('hex');
    //
    const user = await db.User.create({
        fullName,
        email,
        grade,
        uniqueCode,
    });
    const token = Auth.CreateToken({
        id: user.id,
        role: "student"
    });
    welcomeMail.sendMail(user.email)
        .catch(err => {
            console.error("Email send failed:", err.message);
        });
    res.status(201).json({
        success: true,
        message: "User created successfully",
        data: UserResource(user),
        token
    });
};

const login = async (req, res) => {
    const { uniqueCode } = req.body;
    const user = await db.User.findOne({ where: { uniqueCode } });
    if (!user) {
        throw new AuthError('Invalid unique code');
    }
    const token = Auth.CreateToken({
        id: user.id,
        role: "student"
    });
    res.status(200).json({
        success: true,
        message: "User logged in successfully",
        data: UserResource(user),
        token
    });
};


const teacherSignup = async (req, res) => {
  const teacher = await TeacherService.createTeacher(req.body);
  const token = Auth.CreateToken({
    id: teacher.id,
    role: 'teacher',
  });
  res.status(201).json({
    success: true,
    message: 'Teacher registered successfully. Access dashboard after verification.',
    teacher: TeacherResource(teacher),
    token,
  });
};

const teacherLogin = async (req, res) => {
  const { email, password } = req.body;
  const teacher = await TeacherService.loginTeacher(email, password);
  if (!teacher.isVerified) {
    throw new AuthError('Account is not verified. Please wait for admin verification.');
  }
  const token = Auth.CreateToken({
    id: teacher.id,
    role: 'teacher',
  });
  res.status(200).json({
    success: true,
    message: 'Teacher logged in successfully',
    teacher: TeacherResource(teacher),
    token,
  });
};

module.exports = {
  signUp,
  login,
  teacherSignup,
  teacherLogin,
};