"use strict";

const TeacherResource = require('./TeacherResource');

module.exports = (goal) => {
  const out = {
    id: goal.id,
    name: goal.name,
    description: goal.description,
    duration: goal.duration,
    domain: goal.domain,
    status: goal.status,
  };

  if (goal.Teacher) {
    out.teacher = TeacherResource(goal.Teacher);
  }

  if (goal.Tasks) {
    out.tasks = goal.Tasks.map(t => ({
      id: t.id,
      title: t.title,
      description: t.description,
      deadline: t.deadline,
      xpPoints: t.xpPoints,
    }));
    // Derive completion flag: all tasks done?
    out.allTasksCompleted = goal.status === 'Completed';
  }

  return out;
};
