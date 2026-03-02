const UserResource = require('../app/Resource/UserResource');
const db = require('../db/models');
const NotFoundError = require('../app/Error/NotFoundError');
const handleJsonImage = require("../app/Services/handleJsonImage");


const buildGradeWhere = (base = {}, grade) => {
    if (grade) return { ...base, grade };
    return base;
};

//Controllers

const getUserByToken = async (req, res) => {
    const user = await db.User.findByPk(req.user.id);
    if (!user) throw new NotFoundError('User not found');
    res.status(200).json({ success: true, user: UserResource(user) });
};

const getUserById = async (req, res) => {
    const user = await db.User.findByPk(req.params.id);
    if (!user) throw new NotFoundError('User not found');
    res.status(200).json({ success: true, user: UserResource(user) });
};


const getAllUsers = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 15;
    const offset = (page - 1) * limit;
    const where = buildGradeWhere({}, req.query.grade);

    const { count, rows } = await db.User.findAndCountAll({ where, limit, offset });
    res.status(200).json({
        success: true,
        users: rows.map(u => UserResource(u)),
        pagination: { total: count, page, limit, pages: Math.ceil(count / limit) },
    });
};

const updateUserByToken = async (req, res) => {
    const user = await db.User.findByPk(req.user.id);
    if (!user) throw new NotFoundError('User not found');
    const allowedUpdates = ['fullName', 'email', 'grade'];
    allowedUpdates.forEach((field) => {
        if (req.body[field] !== undefined) user[field] = req.body[field];
    });
    if (req.body.image) await handleJsonImage(user, req.body.image);
    await user.save();
    res.status(200).json({ success: true, message: 'User updated', user: UserResource(user) });
};

const deleteUserById = async (req, res) => {
    const user = await db.User.findByPk(req.params.id);
    if (!user) throw new NotFoundError('User not found');
    await user.destroy();
    res.status(200).json({ success: true, message: 'User deleted successfully' });
};


const searchUserByNameOrEmail = async (req, res) => {
    const { query, grade } = req.query;
    if (!query) {
        return res.status(400).json({ success: false, message: 'Search query is required' });
    }
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 15;
    const offset = (page - 1) * limit;

    const nameEmailCondition = {
        [db.Sequelize.Op.or]: [
            { fullName: { [db.Sequelize.Op.iLike]: `%${query}%` } },
            { email: { [db.Sequelize.Op.iLike]: `%${query}%` } },
        ],
    };
    const where = grade
        ? { [db.Sequelize.Op.and]: [nameEmailCondition, { grade }] }
        : nameEmailCondition;

    const { count, rows } = await db.User.findAndCountAll({ where, limit, offset });
    res.status(200).json({
        success: true,
        users: rows.map(u => UserResource(u)),
        pagination: { total: count, page, limit, pages: Math.ceil(count / limit) },
    });
};

const getUsersByGoal = async (req, res) => {
    const { goalId } = req.params;
    const goal = await db.Goal.findByPk(goalId);
    if (!goal) throw new NotFoundError('Goal not found');

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 15;
    const offset = (page - 1) * limit;

    const { count, rows } = await db.User.findAndCountAll({
        include: [{
            model: db.Task,
            where: { goalId },
            through: { attributes: [] },
            required: true,
        }],
        limit,
        offset,
        distinct: true,
        subQuery: false,
    });
    res.status(200).json({
        success: true,
        goalId,
        users: rows.map(u => UserResource(u)),
        pagination: { total: count, page, limit, pages: Math.ceil(count / limit) },
    });
};


const getRanking = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 15;
    const offset = (page - 1) * limit;
    const where = buildGradeWhere({}, req.query.grade);

    const { count, rows } = await db.User.findAndCountAll({
        where,
        order: [['xpPoints', 'DESC'], ['createdAt', 'ASC']],
        limit,
        offset,
    });
    res.status(200).json({
        success: true,
        users: rows.map(u => UserResource(u)),
        pagination: { total: count, page, limit, pages: Math.ceil(count / limit) },
    });
};

const getMostActiveThisWeek = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const now = new Date();
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1);
    const startOfWeek = new Date(now);
    startOfWeek.setDate(diff);
    startOfWeek.setHours(0, 0, 0, 0);

    const rows = await db.UserTask.findAll({
        attributes: [
            'userId',
            [db.Sequelize.fn('COUNT', db.Sequelize.col('id')), 'completedCount'],
        ],
        where: {
            status: 'Completed',
            completedAt: { [db.Sequelize.Op.between]: [startOfWeek, now] },
        },
        group: ['userId'],
        order: [[db.Sequelize.literal('COUNT(id)'), 'DESC']],
        limit,
        offset,
        raw: true,
    });

    const userIds = rows.map(r => r.userId);
    if (!userIds.length) {
        return res.status(200).json({ success: true, users: [], pagination: { page, limit } });
    }

    const users = await db.User.findAll({ where: { id: userIds } });
    const usersMap = new Map(users.map(u => [u.id, u.get({ plain: true })]));

    const out = rows.map(r => {
        const u = usersMap.get(r.userId) || {};
        return {
            id: u.id || r.userId,
            fullName: u.fullName || null,
            email: u.email || null,
            grade: u.grade || null,
            xpPoints: u.xpPoints || 0,
            completedCount: parseInt(r.completedCount, 10) || 0,
        };
    });

    res.status(200).json({ success: true, users: out, pagination: { page, limit } });
};

module.exports = {
    getUserById,
    getUserByToken,
    getAllUsers,
    updateUserByToken,
    deleteUserById,
    searchUserByNameOrEmail,
    getUsersByGoal,
    getRanking,
    getMostActiveThisWeek,
};