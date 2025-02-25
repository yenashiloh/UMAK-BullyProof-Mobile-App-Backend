const router = require('express').Router();
const UserController = require("../controller/user.controller");

router.post('/registration', UserController.register);
router.post('/login', UserController.login);
router.post('/resend-verification', UserController.resendVerificationEmail);
router.post('/users/forgot-password', UserController.forgotPassword);

router.get('/verify-email', UserController.verifyEmail);
router.get('/users/:userId', UserController.getUserById);

router.put('/users/:userId', UserController.updateUser);
router.put('/users/:userId/change-password', UserController.changePassword);

router.get('/reset-password', UserController.getResetPassword);
router.post('/reset-password/:userId', UserController.resetPassword);

module.exports = router;