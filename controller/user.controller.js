const UserService = require("../services/user.services")

exports.register = async (req, res, next) => {
    try {
        const { fullname, email, contact, password, type } = req.body;

        const successRes = await UserService.registerUser(fullname, email, contact, password, type);

        res.json({ status: true, success: "User Registered Successfully" });
    } catch (error) {
        throw error
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

        let tokenData = { _id: user._id, email: user.email };

        const token = await UserService.generateAccessToken(tokenData, process.env.JWT_SECRET, process.env.JWT_EXPIRE);

        res.status(200).json({ status: true, token: token });
    } catch (error) {
        next(error);
    }
};
