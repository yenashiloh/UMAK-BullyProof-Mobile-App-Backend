// services/user.services.js
const UserModel = require('../model/user.model');
const AuditTrailModel = require('../model/auditTrail.model'); // Import AuditTrail model
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const moment = require('moment-timezone');
const bcrypt = require("bcrypt");

class UserService {
    static async registerUser(fullname, email, contact, password, idnumber, type, position) {
        const emailVerificationToken = crypto.randomBytes(32).toString('hex');
        const emailVerificationTokenExpires = moment().tz('Asia/Manila').add(1, 'hour').toDate();

        const createUser = new UserModel({
            fullname,
            email,
            contact,
            password,
            idnumber,
            type,
            position,
            status: 'Active Account',
            emailVerificationToken,
            emailVerificationTokenExpires
        });

        const user = await createUser.save();

        // Log audit trail for account creation
        await AuditTrailModel.create({
            userId: user._id,
            action: 'ACCOUNT_CREATED',
            details: { email, fullname, type, position, idnumber }
        });

        await this.sendVerificationEmail(email, emailVerificationToken);
        return user;
    }

    static async updateVerificationToken(userId, tokenData) {
        try {
            return await UserModel.findByIdAndUpdate(
                userId,
                {
                    emailVerificationToken: tokenData.emailVerificationToken,
                    emailVerificationTokenExpires: tokenData.emailVerificationTokenExpires
                },
                { new: true }
            );
        } catch (error) {
            throw new Error('Failed to update verification token');
        }
    }

    static async sendVerificationEmail(email, token) {
        try {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                }
            });

            const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

            const mailOptions = {
                from: `"DO NOT REPLY - SYSTEM GENERATED EMAIL" <${process.env.EMAIL_USER}>`,
                to: email,
                subject: 'Email Verification for University of Makati - BullyProof application',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                        <h2 style="color: #1E3A8A;">Verify Your Email Address</h2>
                        <p>Thank you for registering with University of Makati - BullyProof application. Please click the button below to verify your email address:</p>
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${verificationLink}" 
                               style="background-color: #1E3A8A; color: white; padding: 12px 24px; 
                                      text-decoration: none; border-radius: 5px; display: inline-block;">
                                Verify Email
                            </a>
                        </div>
                        <p>This verification link will expire in 1 hour.</p>
                        <p>If you didn't request this verification email, please ignore it.</p>
                        <hr style="border: 1px solid #eee; margin: 20px 0;">
                        <p style="color: #666; font-size: 12px;">
                            This is an automated message, please do not reply to this email.
                        </p>
                    </div>
                `
            };

            const result = await transporter.sendMail(mailOptions);
            return result;
        } catch (error) {
            console.error('Email sending error:', error);
            throw new Error('Failed to send verification email');
        }
    }

    static async verifyEmail(token) {
        const user = await UserModel.findOne({
            emailVerificationToken: token,
            emailVerificationTokenExpires: { $gt: Date.now() }
        });

        if (!user) {
            throw new Error('Invalid or expired token');
        }

        user.isEmailVerified = true;
        user.emailVerificationToken = undefined;
        user.emailVerificationTokenExpires = undefined;

        await user.save();
        return user;
    }

    static async checkuser(email) {
        try {
            return await UserModel.findOne({ email });
        } catch (error) {
            throw error;
        }
    }

    static async generateAccessToken(tokenData, JWTSecret_Key, JWT_EXPIRE) {
        return jwt.sign(tokenData, JWTSecret_Key, { expiresIn: JWT_EXPIRE });
    }

    static async updateUser(userId, updates) {
        try {
            const updatedUser = await UserModel.findByIdAndUpdate(
                userId,
                { $set: updates },
                { new: true, runValidators: true }
            );
            if (!updatedUser) {
                throw new Error('User not found');
            }

            // Log audit trail for profile update
            await AuditTrailModel.create({
                userId: userId,
                action: 'PROFILE_UPDATED',
                details: updates
            });

            return updatedUser;
        } catch (error) {
            throw error;
        }
    }

    static async getUserById(userId) {
        try {
            return await UserModel.findById(userId);
        } catch (error) {
            throw error;
        }
    }

    static async updateResetToken(userId, tokenData) {
        try {
            return await UserModel.findByIdAndUpdate(
                userId,
                {
                    resetToken: tokenData.resetToken,
                    resetTokenExpires: tokenData.resetTokenExpires
                },
                { new: true }
            );
        } catch (error) {
            throw new Error('Failed to update reset token');
        }
    }

    static async sendResetEmail(email, token, userId) {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}&userId=${userId}`;

        const mailOptions = {
            from: `"DO NOT REPLY - SYSTEM GENERATED EMAIL" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Password Reset for University of Makati - BullyProof application',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h2 style="color: #1E3A8A;">Reset Your Password</h2>
                    <p>You requested a password reset. Click the button below to reset your password:</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${resetLink}" 
                           style="background-color: #1E3A8A; color: white; padding: 12px 24px; 
                                  text-decoration: none; border-radius: 5px; display: inline-block;">
                            Reset Password
                        </a>
                    </div>
                    <p>This reset link will expire in 1 hour.</p>
                    <p>If you didn't request this, please ignore this email.</p>
                    <hr style="border: 1px solid #eee; margin: 20px 0;">
                    <p style="color: #666; font-size: 12px;">
                        This is an automated message, please do not reply to this email.
                    </p>
                </div>
            `
        };

        return await transporter.sendMail(mailOptions);
    }

    static async generateResetToken(userId) {
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpires = new Date(Date.now() + 3600000);

        console.log('Current Time (UTC):', new Date().toUTCString());
        console.log('Expiration Time (UTC):', resetTokenExpires.toUTCString());
        console.log('Expiration Time (ISO):', resetTokenExpires.toISOString());

        const user = await UserModel.findByIdAndUpdate(
            userId,
            {
                resetPasswordToken: resetToken,
                resetPasswordExpires: resetTokenExpires
            },
            { new: true, runValidators: true }
        );

        if (!user) {
            throw new Error('User not found');
        }

        console.log('Generated reset token:', resetToken);
        console.log('Updated User in DB:', user);

        return { resetToken, resetTokenExpires };
    }

    static async resetPassword(userId, resetToken, newPassword) {
        console.log('Attempting to reset password for userId:', userId);
        console.log('Provided reset token:', resetToken);

        const user = await UserModel.findOne({
            _id: userId,
            resetPasswordToken: resetToken,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            console.log('User not found or token expired.');
            throw new Error('Invalid or expired reset token');
        }

        console.log('User found, resetting password...');

        user.password = newPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        // Log audit trail for password reset
        await AuditTrailModel.create({
            userId: userId,
            action: 'PASSWORD_RESET',
            details: { email: user.email }
        });

        console.log('Password updated in DB for userId:', userId);
        return user;
    }
}

module.exports = UserService;