"use strict";

module.exports = (teacher) => {
  const out = {
    id: teacher.id,
    name: teacher.name,
    email: teacher.email,
    isVerified: !!teacher.isVerified,
  };

  if (teacher.Goals) {
    out.goals = teacher.Goals.map(g => ({
      id: g.id,
      name: g.name,
      description: g.description,
      duration: g.duration,
      domain: g.domain,
    }));
  }

  return out;
};
