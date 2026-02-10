"use strict";

const BadgeResource = require('./BadgeResource');

module.exports = (userBadge) => {
  const out = {
    id: userBadge.id,
    earnedAt: userBadge.earnedAt,
  };

  if (userBadge.Badge) {
    out.badge = BadgeResource(userBadge.Badge);
  }

  return out;
};
