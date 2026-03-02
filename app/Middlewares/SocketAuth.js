"use strict";

const jwt = require("jsonwebtoken");


const socketAuthMiddleware = (socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) {
        return next(new Error("Authentication error: no token provided"));
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        socket.userId = decoded.id;
        next();
    } catch (err) {
        next(new Error("Authentication error: invalid token"));
    }
};

module.exports = socketAuthMiddleware;
