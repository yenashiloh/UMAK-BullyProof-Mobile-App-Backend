require('dotenv').config();
const express = require('express');
const cors = require('cors');
const body_parser = require('body-parser');
const path = require('path');

const userRouter = require('./routers/user.router');
const reportRouter = require('./routers/report.router');
const notificationRouter = require('./routers/notification.router');
const cardsRouter = require('./routers/cards.router');
const formRouter = require('./routers/form.router');

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
app.use('/cards', cardsRouter);
app.use('/forms', formRouter);
app.use('/form-elements', require('./routers/form_elements.router'));

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ status: false, message: err.message });
});

module.exports = app;
