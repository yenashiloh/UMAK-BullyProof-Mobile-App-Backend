const app = require('./app');
const db = require('./config/db');
const UserModel = require('./model/user.model')

const port = 80;

app.get('/', (req, res) => {
    res.send("/");
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Server Listening on Port http://52.195.171.20`);
});
