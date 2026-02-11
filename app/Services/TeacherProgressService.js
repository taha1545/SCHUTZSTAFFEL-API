"use strict";

const db = require("../../db/models");
const NotFoundError = require("../Error/NotFoundError");
const AuthError = require("../Error/AuthError");

const getStudentProgress = async (teacherId, userId) => {
  //
  const user = await db.User.findByPk(userId);
  if (!user) throw new NotFoundError("Student not found");

  const teacher = await db.Teacher.findByPk(teacherId, {
    include: [{ model: db.User, as: "Users", through: { attributes: [] }, attributes: ["id"] }],
  });
  if (!teacher) throw new NotFoundError("Teacher not found");

  const userTasks = await db.UserTask.findAll({
    where: { userId },
    include: [
      {
        model: db.Task,
        required: true,
        include: [{ model: db.Goal, attributes: ["id", "name", "description", "domain"] }],
      },
    ],
    order: [[db.Task, "createdAt", "DESC"]],
  });

  const completed = userTasks.filter((ut) => ut.status === "Completed");
  const pending = userTasks.filter((ut) => ut.status !== "Completed");
  const total = userTasks.length;
  const completedCount = completed.length;
  const percentage = total > 0 ? Math.round((completedCount / total) * 100) : 0;

  const formatTask = (ut) => ({
    id: ut.id,
    status: ut.status,
    keySubmitted: ut.keySubmitted,
    completedAt: ut.completedAt,
    note: ut.note,
    task: {
      id: ut.Task.id,
      title: ut.Task.title,
      description: ut.Task.description,
      deadline: ut.Task.deadline,
      goal: ut.Task.Goal
        ? {
            id: ut.Task.Goal.id,
            name: ut.Task.Goal.name,
            description: ut.Task.Goal.description,
            domain: ut.Task.Goal.domain,
          }
        : null,
    },
  });

  return {
    user: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      grade: user.grade,
      level: user.level,
      xpPoints: user.xpPoints,
      currentStreak: user.currentStreak,
    },
    completedTasks: completed.map(formatTask),
    pendingTasks: pending.map(formatTask),
    summary: {
      total,
      completed: completedCount,
      pending: total - completedCount,
      percentage,
    },
  };
};

const addStudent = async (teacherId, userId) => {
  const teacher = await db.Teacher.findByPk(teacherId);
  if (!teacher) throw new NotFoundError("Teacher not found");
  const user = await db.User.findByPk(userId);
  if (!user) throw new NotFoundError("User not found");
  await teacher.addUser(userId);
  return { teacherId, userId };
};

module.exports = { getStudentProgress, addStudent };
