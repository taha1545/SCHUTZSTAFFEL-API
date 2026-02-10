"use strict";

const db = require("../../db/models");
const NotFoundError = require("../Error/NotFoundError");

const getDashboard = async (userId) => {
  const user = await db.User.findByPk(userId, {
    include: [
      {
        model: db.Badge,
        as: "Badges",
        through: { attributes: ["earnedAt"] },
        attributes: ["id", "name", "description", "iconPath", "minXpRequired"],
      },
    ],
  });
  if (!user) throw new NotFoundError("User not found");

  const userTasks = await db.UserTask.findAll({
    where: { userId },
    include: [
      {
        model: db.Task,
        required: true,
        include: [{ model: db.Goal, required: true }],
      },
    ],
  });

  const goalMap = new Map();
  for (const ut of userTasks) {
    const goal = ut.Task?.Goal;
    if (!goal) continue;
    const gid = goal.id;
    if (!goalMap.has(gid)) {
      goalMap.set(gid, {
        id: goal.id,
        name: goal.name,
        description: goal.description,
        duration: goal.duration,
        domain: goal.domain,
        tasks: [],
        completedCount: 0,
      });
    }
    const entry = goalMap.get(gid);
    const taskInfo = {
      id: ut.Task.id,
      title: ut.Task.title,
      description: ut.Task.description,
      deadline: ut.Task.deadline,
      status: ut.status,
      completedAt: ut.completedAt,
      keySubmitted: ut.keySubmitted,
    };
    entry.tasks.push(taskInfo);
    if (ut.status === "Completed") entry.completedCount += 1;
  }

  const goals = Array.from(goalMap.values()).map((g) => ({
    ...g,
    progressPercentage:
      g.tasks.length > 0 ? Math.round((g.completedCount / g.tasks.length) * 100) : 0,
  }));

  const totalTasks = userTasks.length;
  const completedTasks = userTasks.filter((ut) => ut.status === "Completed").length;
  const overallPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const badges = (user.Badges || []).map((b) => ({
    id: b.id,
    name: b.name,
    description: b.description,
    iconPath: b.iconPath,
    minXpRequired: b.minXpRequired,
    earnedAt: b.UserBadge?.earnedAt || null,
  }));

  return {
    goals,
    badges,
    level: user.level ?? 1,
    xpPoints: user.xpPoints ?? 0,
    currentStreak: user.currentStreak ?? 0,
    progressMetrics: {
      overallPercentage,
      totalAssignedTasks: totalTasks,
      completedTasks,
      pendingTasks: totalTasks - completedTasks,
      perGoal: goals.map((g) => ({
        goalId: g.id,
        goalName: g.name,
        percentage: g.progressPercentage,
        completed: g.completedCount,
        total: g.tasks.length,
      })),
    },
  };
};

module.exports = { getDashboard };
