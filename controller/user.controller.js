const UserService = require("../services/user.services")

exports.register = async (req, res, next) => {
    try {
        const { fullname, email, contact, password, type } = req.body;

        const existingUser = await UserService.checkuser(email);
        if (existingUser) {
            return res.status(400).json({ status: false, message: "Email already in use, Please use another email." });
        }

        const successRes = await UserService.registerUser(fullname, email, contact, password, type);

        res.json({ status: true, success: "User Registered Successfully" });
    } catch (error) {
        next(error);
    }
}


exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await UserService.checkuser(email);

        if (!user) {
            return res.status(404).json({ status: false, message: "User doesn't exist" });
        }

        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({ status: false, message: "Invalid password" });
        }

        let tokenData = { _id: user._id, email: user.email};

        const token = await UserService.generateAccessToken(tokenData, process.env.JWT_SECRET, process.env.JWT_EXPIRE);

        res.status(200).json({ status: true, token: token });
    } catch (error) {
        next(error);
    }
};

exports.getUserById = async (req, res, next) => {
    try {
        const { userId } = req.params; // Extract userId from URL params

        // Call service method to check if user exists
        const user = await UserService.getUserById(userId);

        if (!user) {
            return res.status(404).json({ status: false, message: "User not found" });
        }

        // Return a success response if user found
        res.status(200).json({ status: true, message: "User found", user });
    } catch (error) {
        next(error);
    }
};

