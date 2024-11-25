require('dotenv').config();
const express = require('express');
const body_parser = require('body-parser');
const cors = require('cors');  // Importing CORS middleware
const userRouter = require('./routers/user.router');
const reportRouter = require('./routers/report.router');
const notificationRouter = require('./routers/notification.router');

const app = express();

// Enable CORS for all routes
app.use(cors());

// Body parser middleware with a size limit
const MAX_REQUEST_SIZE = '25mb'; // Set your desired limit
app.use(body_parser.json({ limit: MAX_REQUEST_SIZE }));
app.use(body_parser.urlencoded({ limit: MAX_REQUEST_SIZE, extended: true }));

// Use your userRouter
app.use('/', userRouter);

app.use('/reports', reportRouter);

app.use('/notifications', notificationRouter);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ status: false, message: err.message });
});

module.exports = app;
