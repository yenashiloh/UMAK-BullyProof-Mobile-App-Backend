const UserModel = require('../model/user.model');
const jwt = require('jsonwebtoken');

class UserService {
    static async registerUser(fullname, email, contact, password, type) {
        try {
            const createUser = new UserModel({ fullname, email, contact, password, type });
            return await createUser.save();
        } catch (err) {
            throw err;
        }
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