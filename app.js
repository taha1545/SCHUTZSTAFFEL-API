"use strict";

require('dotenv').config();
require('express-async-errors');

// ==================== IMPORTS ====================
const express = require('express');
const path = require('path');
const cors = require('cors');
const db = require('./db/models');
const ErrorHandler = require('./app/Middlewares/Handle');
const apiRoutes = require('./Routes');
const app = express();

// ==================== MIDDLEWARE ====================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static(path.join(__dirname, 'public')));

// ==================== ROUTES ====================
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

// ==================== ERROR HANDLER ====================
app.use(ErrorHandler);

// ==================== DATABASE & SERVER ====================
const PORT = process.env.APP_PORT || 5000;

db.sequelize
  .sync({ alter: false })
  .then(() => {
    console.log('✓ Database connected successfully');
    app.listen(PORT, () => {
      console.log(`✓ Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('✗ Database connection error:', err.message);
    process.exit(1);
  });

module.exports = app;