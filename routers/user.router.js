const router = require('express').Router();
const UserController = require("../controller/user.controller");

router.post('/registration',UserController.register);
router.post('/login',UserController.login);
router.get('/verify-email', UserController.verifyEmail);
router.post('/resend-verification', UserController.resendVerificationEmail);

// Add this route to handle user retrieval by ID
router.get('/users/:userId', UserController.getUserById);


module.exports = router;