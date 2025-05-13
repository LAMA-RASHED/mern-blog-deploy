'use strict';
/* -------------------------------------------------------
    | FULLSTACK TEAM | NODEJS / EXPRESS |
------------------------------------------------------- */
require('colors');
const express = require('express');
const app = express();

// asyncErrors to errorHandler:
require('express-async-errors');

// cors is required for cross-origin resource sharing
const cors = require('cors');
// path is required to set static folder
// it is a default library in node servers
const path = require('path');

// Configurations
// envVariables to process.env:
const loadEnv = require('./config/loadEnv');
loadEnv(); // Load environment variables before anything else

const PORT = process.env.PORT || 8080;
const HOST = process.env.HOST || '127.0.0.1';
const MODE = process.env.MODE || 'production';

// Connect to DB
const { dbConnection } = require('./config/dbConnection');
dbConnection();

// Middlewares
// Parse JSON
app.use(express.json()); //req.body
// Enable CORS
// we let here all the origins to access our API
app.use(cors());
// logger
app.use(require('./middlewares/logger'));

// set static folder - serve images and other static files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/public', express.static('public'));
// Make /uploads accessible for images
app.use('/uploads', express.static('uploads'));
// Serve default.png for missing images
app.get('/default.png', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'images', 'default.png'));
});

// res.getModelList():
// app.use(require('./middlewares/findSearchSortPage'))

// App Routes
// HomePath:
app.all('/', (req, res) => {
  res.send({
    error: false,
    message: 'Welcome to Blog API',
    documents: {
      swagger: '/api/documents/swagger',
      redoc: '/api/documents/redoc',
      json: '/api/documents/json',
    },
    user: req.user,
  });
});
// API Routes
app.use('/api', require('./routes'));

// Express Error Handler
app.use(require('./middlewares/errorHandler'));

// Run server
app.listen(process.env.PORT, process.env.HOST, () => {
  console.log(`Server running at http://${process.env.HOST}:${process.env.PORT}`);
});
