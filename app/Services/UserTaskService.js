"use strict";

const db = require('../../db/models');
const NotFoundError = require('../Error/NotFoundError');
const GoalService = require('./GoalService');
const BadgeService = require('./BadgeService');
const SocketService = require('./SocketService');
const dayjs = require("dayjs");


const XP_THRESHOLDS = [0, 100, 250, 500, 1000, 2000, 4000, 8000, 16000, 32000];

const calculateLevel = (xpPoints) => {
  let level = 1;
  for (let i = XP_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xpPoints >= XP_THRESHOLDS[i]) {
      level = i + 1;
      break;
    }
  }
  return level;
};


const createUserTask = async (data) => {
  return await db.UserTask.create({
    userId: data.userId,
    taskId: data.taskId,
    status: data.status || 'Pending',
    keySubmitted: data.keySubmitted,
    note: data.note,
  });
};

const getUserTaskById = async (id, includeRelations = false) => {
  const options = { where: { id } };
  if (includeRelations) {
    options.include = [
      { model: db.User },
      { model: db.Task },
    ];
  }
  const userTask = await db.UserTask.findOne(options);
  if (!userTask) throw new NotFoundError('UserTask not found');
  return userTask;
};

const getAllUserTasks = async (page = 1, limit = 15, includeRelations = false) => {
  const offset = (page - 1) * limit;
  const options = {
    limit,
    offset,
    order: [['createdAt', 'DESC']],
  };
  if (includeRelations) {
    options.include = [
      { model: db.User },
      { model: db.Task },
    ];
  }
  return await db.UserTask.findAndCountAll(options);
};

const getUserTasksByUser = async (userId, page = 1, limit = 15) => {
  const offset = (page - 1) * limit;
  return await db.UserTask.findAndCountAll({
    where: { userId },
    limit,
    offset,
    order: [['createdAt', 'DESC']],
    include: [{ model: db.Task }],
  });
};

const getUserTasksByTask = async (taskId, page = 1, limit = 15) => {
  const offset = (page - 1) * limit;
  return await db.UserTask.findAndCountAll({
    where: { taskId },
    limit,
    offset,
    order: [['createdAt', 'DESC']],
    include: [{ model: db.User }],
  });
};


const getActiveTasksByUser = async (userId, page = 1, limit = 15) => {
  const offset = (page - 1) * limit;
  return await db.UserTask.findAndCountAll({
    where: {
      userId,
      status: { [db.Sequelize.Op.ne]: 'Completed' },
    },
    limit,
    offset,
    order: [['createdAt', 'DESC']],
    include: [
      {
        model: db.Task,
        include: [{ model: db.Goal }],
      },
    ],
  });
};

async function updateUserStreak(user, transaction) {
  //
  const today = dayjs().format("YYYY-MM-DD");
  const yesterday = dayjs().subtract(1, "day").format("YYYY-MM-DD");
  //
  if (!user.lastActivityDate) {
    user.currentStreak = 1;
  }
  else if (user.lastActivityDate === today) {
    return;
  }
  else if (user.lastActivityDate === yesterday) {
    user.currentStreak += 1;
  }
  else {
    user.currentStreak = 1;
  }
  user.lastActivityDate = today;
  //
  await user.save({ transaction });
}


const updateUserTask = async (id, data) => {
  //
  const userTask = await getUserTaskById(id);
  const wasCompleted = userTask.status === "Completed";

  if (data.status === "Completed" && !wasCompleted) {
    const transaction = await db.sequelize.transaction();

    let goalCompleted = false;
    let badge = null;

    try {
      data.completedAt = new Date();
      await userTask.update(data, { transaction });

      const task = await db.Task.findByPk(userTask.taskId, { transaction });

      // LOCK user row (important for streak + xp safety)
      const user = await db.User.findByPk(userTask.userId, {
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      const newXp = (user.xpPoints || 0) + (task.xpPoints || 10);
      const newLevel = calculateLevel(newXp);

      await user.update(
        { xpPoints: newXp, level: newLevel },
        { transaction }
      );

      // 🔥 UPDATE STREAK HERE
      await updateUserStreak(user, transaction);

      // Check goal completion
      if (task.goalId) {
        goalCompleted = await GoalService.checkCompleteGoal(
          task.goalId,
          userTask.userId,
          transaction
        );

        if (goalCompleted) {
          badge = await BadgeService.getBadgeByGoalId(task.goalId);

          if (badge) {
            const alreadyHas = await db.UserBadge.findOne({
              where: { userId: userTask.userId, badgeId: badge.id },
              transaction,
            });

            if (!alreadyHas) {
              await db.UserBadge.create(
                {
                  userId: userTask.userId,
                  badgeId: badge.id,
                  earnedAt: new Date(),
                },
                { transaction }
              );
            }
          }
        }
      }

      await transaction.commit();

      // SOCKET EVENTS (after commit only)
      SocketService.emitToUser(userTask.userId, "task:completed", {
        taskId: userTask.taskId,
      });

      SocketService.emitToUser(userTask.userId, "xp:updated", {
        xp: newXp,
        level: newLevel,
      });

      SocketService.emitToUser(userTask.userId, "streak:updated", {
        streak: user.currentStreak,
      });

      if (goalCompleted) {
        SocketService.emitToUser(userTask.userId, "goal:completed", {
          goalId: task.goalId,
        });
      }

      if (badge) {
        SocketService.emitToUser(userTask.userId, "badge:earned", {
          badgeId: badge.id,
        });
      }

    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  } else {
    if (data.status === "Completed" && !userTask.completedAt) {
      data.completedAt = new Date();
    }
    await userTask.update(data);
  }

  return userTask.reload();
};


const deleteUserTask = async (id) => {
  const userTask = await getUserTaskById(id);
  await userTask.destroy();
  return userTask;
};

module.exports = {
  createUserTask,
  getUserTaskById,
  getAllUserTasks,
  getUserTasksByUser,
  getUserTasksByTask,
  getActiveTasksByUser,
  updateUserTask,
  deleteUserTask,
};
