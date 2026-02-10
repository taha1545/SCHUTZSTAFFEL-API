"use strict";

const UserResource = require('./UserResource');
const TaskResource = require('./TaskResource');

module.exports = (userTask) => {
  const out = {
    id: userTask.id,
    status: userTask.status,
    keySubmitted: userTask.keySubmitted || null,
    completedAt: userTask.completedAt || null,
    note: userTask.note || null,
  };

  if (userTask.User) {
    out.user = UserResource(userTask.User);
  }

  if (userTask.Task) {
    out.task = TaskResource(userTask.Task);
  }

  return out;
};
