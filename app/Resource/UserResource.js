"use strict";

module.exports = (user) => {
    const out = {
        id: user.id,
        fullName: user.fullName || null,
        email: user.email,
        grade: user.grade || null,
        googleId: user.googleId || null,
        uniqueCode: user.uniqueCode || null,
        xpPoints: user.xpPoints || 0,
        level: user.level || 1,
        currentStreak: user.currentStreak || 0,
        lastActivityDate: user.lastActivityDate || null,
        imagePath: user.imagePath || null,
    };

    if (user.Badges) {
        out.badges = user.Badges.map(b => ({
            id: b.id,
            name: b.name,
            description: b.description,
            iconPath: b.iconPath,
            goalId: b.goalId || null,
        }));
    }

    return out;
};