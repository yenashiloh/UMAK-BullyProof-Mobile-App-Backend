const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
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
    type: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'Active Account'
    }
});

userSchema.pre('save', async function () {
    try {
        var user = this;
        const salt = await (bcrypt.genSalt(10));
        const hashpass = await bcrypt.hash(user.password, salt);

        user.password = hashpass;
    } catch (error) {
        throw error;
    }
});

userSchema.methods.comparePassword = async function (userPassword) {
    try {
        const isMatch = await bcrypt.compare(userPassword, this.password);
        return isMatch;
    } catch (error) {
        throw error;
    }
}

const UserModel = db.model('user', userSchema);
module.exports = UserModel;