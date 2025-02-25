const UserService = require("../services/user.services");
const crypto = require('crypto');
const moment = require('moment-timezone');
const jwt = require('jsonwebtoken');

exports.register = async (req, res, next) => {
    try {
        const { fullname, email, contact, password, idnumber, type, position } = req.body;

        const existingUser = await UserService.checkuser(email);
        if (existingUser) {
            return res.status(400).json({ status: false, message: "Email already in use, Please use another email." });
        }

        const successRes = await UserService.registerUser(fullname, email, contact, password, idnumber, type, position);

        res.json({ status: true, success: "User Registered Successfully" });
    } catch (error) {
        next(error);
    }
};

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await UserService.checkuser(email);

        if (!user) {
            return res.status(404).json({ status: false, message: "Invalid email or password" });
        }

        if (!user.isEmailVerified) {
            return res.status(403).json({
                status: false,
                message: "Please verify your email before logging in"
            });
        }

        console.log('Login attempt - Email:', email);
        console.log('Login attempt - Password (before compare):', password);

        const isMatch = await user.comparePassword(password);
        console.log('Password match result:', isMatch);

        if (!isMatch) {
            return res.status(401).json({ status: false, message: "Invalid email or password" });
        }

        if (user.status === "Disabled Account") {
            return res.status(401).json({ status: false, message: "Your account has been disabled due to certain reasons. Please contact CSFD for assistance" });
        }

        let tokenData = { _id: user._id, email: user.email, fullname: user.fullname };

        const token = await UserService.generateAccessToken(tokenData, process.env.JWT_SECRET, process.env.JWT_EXPIRE);

        res.status(200).json({ status: true, token: token });
    } catch (error) {
        next(error);
    }
};

exports.verifyEmail = async (req, res, next) => {
    try {
        const { token } = req.query;

        const user = await UserService.verifyEmail(token);

        res.status(200).json({
            status: true,
            message: "Email verified successfully. You can now log in."
        });
    } catch (error) {
        next(error);
    }
};

exports.resendVerificationEmail = async (req, res, next) => {
    try {
        console.log('Request body:', req.body);
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                status: false,
                message: "Email is required"
            });
        }

        const user = await UserService.checkuser(email);

        if (!user) {
            return res.status(404).json({
                status: false,
                message: "User not found"
            });
        }

        if (user.isEmailVerified) {
            return res.status(400).json({
                status: false,
                message: "Email is already verified"
            });
        }

        const emailVerificationToken = crypto.randomBytes(32).toString('hex');
        const emailVerificationTokenExpires = new Date(Date.now() + 300000);

        await UserService.updateVerificationToken(user._id, {
            emailVerificationToken,
            emailVerificationTokenExpires
        });

        await UserService.sendVerificationEmail(email, emailVerificationToken);

        res.status(200).json({
            status: true,
            message: "Verification email has been resent. Please check your inbox."
        });
    } catch (error) {
        console.error('Resend verification error:', error);
        res.status(500).json({
            status: false,
            message: "Failed to resend verification email. Please try again later."
        });
    }
};

exports.updateUser = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const { fullname, email, contact, idnumber } = req.body;

        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ status: false, message: "No token provided" });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded._id !== userId) {
            return res.status(403).json({ status: false, message: "Unauthorized: Token does not match user" });
        }

        const user = await UserService.getUserById(userId);
        if (!user) {
            return res.status(404).json({ status: false, message: "User not found" });
        }

        if (email && email !== user.email) {
            const existingUser = await UserService.checkuser(email);
            if (existingUser) {
                return res.status(400).json({ status: false, message: "Email already in use" });
            }
        }

        const updatedUser = await UserService.updateUser(userId, {
            fullname,
            email,
            contact,
            idnumber,
        });

        res.status(200).json({
            status: true,
            message: "User updated successfully",
            user: {
                _id: updatedUser._id,
                fullname: updatedUser.fullname,
                email: updatedUser.email,
                contact: updatedUser.contact,
                idnumber: updatedUser.idnumber,
                type: updatedUser.type,
                position: updatedUser.position,
                status: updatedUser.status,
                isEmailVerified: updatedUser.isEmailVerified,
            }
        });
    } catch (error) {
        next(error);
    }
};

exports.getUserById = async (req, res, next) => {
    try {
        const { userId } = req.params;

        const user = await UserService.getUserById(userId);

        if (!user) {
            return res.status(404).json({ status: false, message: "User not found" });
        }

        res.status(200).json({ status: true, message: "User found", user });
    } catch (error) {
        next(error);
    }
};

exports.changePassword = async (req, res, next) => {
    try {
        console.log('Request body:', req.body);
        console.log('User ID:', req.params.userId);
        console.log('Authorization Header:', req.headers.authorization);

        const { userId } = req.params;
        const { currentPassword, newPassword } = req.body;

        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            console.log('No token provided');
            return res.status(401).json({ status: false, message: "No token provided" });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded._id !== userId) {
            console.log('Unauthorized: Token does not match user');
            return res.status(403).json({ status: false, message: "Unauthorized: Token does not match user" });
        }

        const user = await UserService.getUserById(userId);
        if (!user) {
            console.log('User not found:', userId);
            return res.status(404).json({ status: false, message: "User not found" });
        }

        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            console.log('Current password incorrect for user:', userId);
            return res.status(401).json({ status: false, message: "Current password is incorrect" });
        }

        user.password = newPassword;
        await user.save();

        console.log('Password updated successfully for user:', userId);
        res.status(200).json({
            status: true,
            message: "Password updated successfully"
        });
    } catch (error) {
        console.error('Password change error:', error);
        res.status(500).json({
            status: false,
            message: error.message || "An error occurred while changing the password"
        });
    }
};

exports.forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ status: false, message: "Email is required" });
        }

        const user = await UserService.checkuser(email);
        if (!user) {
            return res.status(404).json({ status: false, message: "Please enter valid UMak email" });
        }

        const { resetToken } = await UserService.generateResetToken(user._id);
        await UserService.sendResetEmail(email, resetToken, user._id);

        res.status(200).json({
            status: true,
            message: "Password reset link sent to your email. Check your inbox."
        });
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ status: false, message: "Failed to send reset link" });
    }
};

exports.getResetPassword = async (req, res, next) => {
    try {
        const { token, userId } = req.query;

        if (!token || !userId) {
            return res.status(400).render('error', { message: "Token and user ID are required to reset your password." });
        }

        res.render('reset-password', { token: token, userId: userId });
    } catch (error) {
        console.error('Reset password GET error:', error);
        res.status(500).render('error', { message: "An error occurred while processing the reset link." });
    }
};

exports.resetPassword = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const { token, password } = req.body;

        if (!token || !password) {
            return res.status(400).json({ status: false, message: "Token and new password are required" });
        }

        const user = await UserService.resetPassword(userId, token, password);

        res.status(200).send(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Success</title>
                <style>
                    body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }
                    .success { color: #2e7d32; font-size: 18px; text-align: center; }
                    .button { display: inline-block; padding: 10px 20px; background-color: #1E3A8A; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
                </style>
            </head>
            <body>
                <div class="success">Password reset successfully. You can now login with your new password.</div>
            </body>
            </html>
        `);
    } catch (error) {
        console.error('Reset password POST error:', error);
        if (error.message === 'Invalid or expired reset token') {
            return res.status(400).send(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Error</title>
                    <style>
                        body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }
                        .error { color: #d32f2f; font-size: 18px; text-align: center; }
                    </style>
                </head>
                <body>
                    <div class="error">Invalid or expired reset token. Please request a new password reset.</div>
                </body>
                </html>
            `);
        }
        res.status(500).send(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Error</title>
                <style>
                    body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }
                    .error { color: #d32f2f; font-size: 18px; text-align: center; }
                </style>
            </head>
            <body>
                <div class="error">Failed to reset password. Please try again later.</div>
            </body>
            </html>
        `);
    }
};