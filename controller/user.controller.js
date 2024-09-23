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
            throw new Error('User dont exist');
        }

        const isMatch = await user.comparePassword(password);

        if (isMatch == false) {
            throw new Error('Password Invalid');
        }

        let tokenData = { _id: user._id, email: user.email };

        const token = await UserService.generateAccessToken(tokenData, "secret", "1h")

        res.status(200).json({ status: true, token: token })

    } catch (error) {
        throw error
        next(error);
    }
}