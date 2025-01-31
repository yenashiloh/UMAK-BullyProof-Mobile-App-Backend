const UserModel = require('../model/user.model');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

class UserService {
    static async registerUser(fullname, email, contact, password, type) {
        const emailVerificationToken = crypto.randomBytes(32).toString('hex');
        const emailVerificationTokenExpires = new Date(Date.now() + 300000);
    
        const createUser = new UserModel({ 
            fullname, 
            email, 
            contact, 
            password, 
            type, 
            status: 'Active Account',
            emailVerificationToken,
            emailVerificationTokenExpires
        });
    
        const user = await createUser.save();
        await this.sendVerificationEmail(email, emailVerificationToken);
        return user;
    }

    static async sendVerificationEmail(email, token) {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
    
        const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
    
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Verify Your Email',
            html: `Click <a href="${verificationLink}">here</a> to verify your email`
        });
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

    static async generateAccessToken(tokenData,JWTSecret_Key,JWT_EXPIRE){
        return jwt.sign(tokenData, JWTSecret_Key, { expiresIn: JWT_EXPIRE });
    }

    static async getUserById(userId) {
        try {
            // Find the user by userId
            return await UserModel.findById(userId);
        } catch (error) {
            throw error;
        }
    }
}

module.exports = UserService;