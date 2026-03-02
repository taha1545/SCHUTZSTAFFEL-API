"use strict";

module.exports = (badge) => {
  return {
    id: badge.id,
    name: badge.name,
    description: badge.description,
    iconPath: badge.iconPath || null,
    goalId: badge.goalId || null,
  };
};
