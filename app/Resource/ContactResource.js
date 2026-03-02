const dayjs = require('dayjs');

module.exports = (contact) => {
    return {
        id: contact.id,
        name: contact.name || "",
        phone: contact.email || "",
        email: contact.email || "",
        message: contact.message,
        teacherId: contact.teacherId,
        createdAt: dayjs(contact.createdAt).format('YYYY-MM-DD HH:mm:ss')
    }
};