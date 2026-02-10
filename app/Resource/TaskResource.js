"use strict";

const GoalResource = require('./GoalResource');

module.exports = (task) => {
  const out = {
    id: task.id,
    title: task.title,
    description: task.description,
    deadline: task.deadline,
    taskKey: task.taskKey || null,
    isUsedKey: !!task.isUsedKey,
  };

  if (task.Goal) {
    out.goal = GoalResource(task.Goal);
  }

  return out;
};
