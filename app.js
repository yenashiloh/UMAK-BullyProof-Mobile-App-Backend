require('dotenv').config();
const express = require('express');
const body_parser = require('body-parser');
const cors = require('cors');  // Importing CORS middleware
const userRouter = require('./routers/user.router');
const reportRouter = require('./routers/report.router');

const app = express();

app.use(cors());

const MAX_REQUEST_SIZE = '25mb';
app.use(body_parser.json({ limit: MAX_REQUEST_SIZE }));
app.use(body_parser.urlencoded({ limit: MAX_REQUEST_SIZE, extended: true }));

app.use('/', userRouter);

app.use('/reports', reportRouter);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ status: false, message: err.message });
});

module.exports = app;
