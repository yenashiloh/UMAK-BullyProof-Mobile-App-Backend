const router = require('express').Router();
const UserController = require("../controller/user.controller");

router.post('/registration',UserController.register);
router.post('/login',UserController.login);

// Add this route to handle user retrieval by ID
router.get('/users/:userId', UserController.getUserById);


module.exports = router;