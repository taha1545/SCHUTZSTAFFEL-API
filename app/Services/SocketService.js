"use strict";



let _io = null;

const setIo = (io) => {
    _io = io;
};


const emitToUser = (userId, event, data) => {
    if (!_io) return;
    _io.to(`user_${userId}`).emit(event, data);
};


const broadcast = (event, data) => {
    if (!_io) return;
    _io.emit(event, data);
};

module.exports = { setIo, emitToUser, broadcast };
