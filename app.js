require('dotenv').config();
const express = require('express');
const body_parser = require('body-parser');
const cors = require('cors');
const userRouter = require('./routers/user.router');
const reportRouter = require('./routers/report.router');
const notificationRouter = require('./routers/notification.router');
const path = require('path');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(cors());

const MAX_REQUEST_SIZE = '50mb';
app.use(body_parser.json({ limit: MAX_REQUEST_SIZE }));
app.use(body_parser.urlencoded({ limit: MAX_REQUEST_SIZE, extended: true }));

app.use('/', userRouter);

app.use('/reports', reportRouter);

app.use('/notifications', notificationRouter);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ status: false, message: err.message });
});

module.exports = app;
