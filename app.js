"use strict";

require('dotenv').config();
require('express-async-errors');
// 
const http = require('http');
const express = require('express');
const path = require('path');
const cors = require('cors');
const { Server } = require('socket.io');
const db = require('./db/models');
const ErrorHandler = require('./app/Middlewares/Handle');
const apiRoutes = require('./Routes');
const SocketService = require('./app/Services/SocketService');
const socketAuthMiddleware = require('./app/Middlewares/SocketAuth');
//
const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

//
io.use(socketAuthMiddleware);
io.on('connection', (socket) => {
  const userId = socket.userId;
  socket.join(`user_${userId}`);
  console.log(`[Socket] User ${userId} connected → room user_${userId}`);
  //
  socket.on('disconnect', () => {
    console.log(`[Socket] User ${userId} disconnected`);
  });
});
SocketService.setIo(io);
// 
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static(path.join(__dirname, 'public')));
// 
app.use('/api', apiRoutes);

app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to schutzstaffel Backend',
    version: '1.0.0',
    status: 'running',
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'No endpoint found for this request',
    path: req.originalUrl,
  });
});
// 
app.use(ErrorHandler);
// 
const PORT = process.env.APP_PORT;
db.sequelize
  .sync({ alter: false })
  .then(() => {
    console.log('✓ Database connected successfully');
    server.listen(PORT, () => {
      console.log(`✓ Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('✗ Database connection error:', err.message);
    process.exit(1);
  });

module.exports = app;