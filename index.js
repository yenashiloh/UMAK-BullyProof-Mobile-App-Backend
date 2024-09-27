const app = require('./app');
const db = require('./config/db');
const UserModel = require('./model/user.model')

const port = 3000;

app.get('/', (req, res) => {
    res.send("/");
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Server Listening on Port http://192.168.1.12:${port}`);
});