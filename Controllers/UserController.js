const UserResource = require('../app/Resource/UserResource');
const db = require('../db/models');
const notfoundError = require('../app/Error/NotFoundError');
const handleJsonImage = require("../app/Services/handleJsonImage");


const getUserByToken = async (req, res) => {
    const user = await db.User.findByPk(req.user.id);
    if (!user) throw new notfoundError('User not found');
    res.status(200).json({
        success: true,
        user: UserResource(user)
    });
};

const getUserById = async (req, res) => {
    const user = await db.User.findByPk(req.params.id);
    if (!user) throw new notfoundError('User not found');
    res.status(200).json({
        success: true,
        user: UserResource(user)
    });
};

const getAllUsers = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 15;
    const offset = (page - 1) * limit;
    const { count, rows } = await db.User.findAndCountAll({
        limit,
        offset,
    });
    res.status(200).json({
        success: true,
        users: rows.map(data => UserResource(data)),
        pagination: {
            total: count,
            page,
            pages: Math.ceil(count / limit)
        }
    });
};


const updateUserByToken = async (req, res) => {
    const user = await db.User.findByPk(req.user.id);
    if (!user) throw new notfoundError('User not found');
    const allowedUpdates = ['fullName', 'email', 'grade'];
    allowedUpdates.forEach((field) => {
        if (req.body[field] !== undefined) user[field] = req.body[field];
    });
    if (req.body.image) await handleJsonImage(user, req.body.image);
    await user.save();
    res.status(200).json({
        success: true,
        message: 'User updated',
        user: UserResource(user)
    });
};

const deleteUserById = async (req, res) => {
    const { id } = req.params;
    const user = await db.User.findByPk(id);
    if (!user) throw new notfoundError('User not found');
    await user.destroy();
    res.status(200).json({
        success: true,
        message: 'User deleted successfully'
    });
};

const searchUserByNameOrEmail = async (req, res) => {
    const { query } = req.query;
    if (!query) {
        return res.status(400).json({
            success: false,
            message: 'Search query is required'
        });
    }
    
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 15;
    const offset = (page - 1) * limit;
    
    const { count, rows } = await db.User.findAndCountAll({
        where: {
            [db.Sequelize.Op.or]: [
                { fullName: { [db.Sequelize.Op.iLike]: `%${query}%` } },
                { email: { [db.Sequelize.Op.iLike]: `%${query}%` } }
            ]
        },
        limit,
        offset,
    });
    
    res.status(200).json({
        success: true,
        users: rows.map(data => UserResource(data)),
        pagination: {
            total: count,
            page,
            pages: Math.ceil(count / limit)
        }
    });
};

const getUsersByGoal = async (req, res) => {
    const { goalId } = req.params;
    
    const goal = await db.Goal.findByPk(goalId);
    if (!goal) throw new notfoundError('Goal not found');
    
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 15;
    const offset = (page - 1) * limit;
    
    const { count, rows } = await db.User.findAndCountAll({
        include: [
            {
                model: db.Task,
                as: 'Tasks',
                where: { goalId },
                through: { attributes: [] },
                required: true
            }
        ],
        limit,
        offset,
        distinct: true,
        subQuery: false
    });
    
    res.status(200).json({
        success: true,
        goalId,
        users: rows.map(data => UserResource(data)),
        pagination: {
            total: count,
            page,
            pages: Math.ceil(count / limit)
        }
    });
};


module.exports = {
    getUserById,
    getUserByToken,
    getAllUsers,
    updateUserByToken,
    deleteUserById,
    searchUserByNameOrEmail,
    getUsersByGoal
};