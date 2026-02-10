const db = require('../db/models');
const ContactResource = require('../app/Resource/ContactResource');
const notfoundError = require('../app/Error/NotFoundError');

const All = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const { count, rows } = await db.Contact.findAndCountAll({
        offset,
        limit,
        order: [['createdAt', 'DESC']]
    });
    res.status(200).json({
        success: true,
        message: "Contacts retrieved successfully",
        data: rows.map(contact => ContactResource(contact)),
        pagination: {
            total: count,
            page,
            limit,
            totalPages: Math.ceil(count / limit)
        }
    });
};

const Show = async (req, res) => {
    const id = req.params.id;
    const contact = await db.Contact.findByPk(id);
    if (!contact) {
        throw new notfoundError('Contact not found');
    }
    res.status(200).json({
        success: true,
        message: "Contact retrieved successfully",
        data: ContactResource(contact)
    });
};

const Create = async (req, res) => {
    const { name = null, email = null, phone = null, message = null } = req.body;
    if (!message) {
        throw new Error("message should'nt be null");
    }
    const contact = await db.Contact.create({
        name,
        email,
        phone,
        message
    });
    res.status(201).json({
        success: true,
        message: "Contact created successfully",
        data: ContactResource(contact)
    });
};

const Delete = async (req, res) => {
    const id = req.params.id;
    const contact = await db.Contact.findByPk(id);
    if (!contact) {
        throw new notfoundError('Contact not found');
    }
    await contact.destroy();
    res.status(200).json({
        success: true,
        message: "Contact deleted successfully"
    });
};

module.exports = {
    All,
    Show,
    Create,
    Delete
};
