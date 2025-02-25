const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const moment = require('moment-timezone');
const db = require('../config/db');

const { Schema } = mongoose;

const userSchema = new Schema({
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        lowercase: true,
        required: true,
        unique: true
    },
    contact: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    idnumber: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    position: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'Active Account'
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    emailVerificationToken: {
        type: String
    },
    emailVerificationTokenExpires: {
        type: Date
    },
    resetPasswordToken: {
        type: String
    },
    resetPasswordExpires: {
        type: Date
    }
});

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

userSchema.pre('save', function (next) {
    if (this.emailVerificationTokenExpires) {
        this.emailVerificationTokenExpires = moment(this.emailVerificationTokenExpires)
            .tz('Asia/Manila')
            .utc()
            .toDate();
    }
    if (this.resetPasswordExpires) {
    }
    next();
});

// Compare hashed password
userSchema.methods.comparePassword = async function (userPassword) {
    console.log('Comparing password (input):', userPassword);
    console.log('Stored hashed password:', this.password);
    try {
        const isMatch = await bcrypt.compare(userPassword, this.password);
        console.log('bcrypt.compare result:', isMatch);
        return isMatch;
    } catch (error) {
        console.error('bcrypt.compare error:', error);
        throw error;
    }
};

const UserModel = db.model('user', userSchema);
module.exports = UserModel;