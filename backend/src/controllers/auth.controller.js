const authService = require("../services/auth.service");

async function register(req, res, next) {

    try {

        const { fullName, email, password } = req.body;

        const user = await authService.registerUser(
            fullName,
            email,
            password
        );

        res.status(201).json({
            success: true,
            message: "User registered successfully.",
            data: user
        });

    } catch (error) {

        next(error);

    }

}

async function login(req, res, next) {

    try {

        const { email, password } = req.body;

        const result = await authService.loginUser(
            email,
            password
        );

        res.json({
            success: true,
            message: "Login successful.",
            data: result
        });

    } catch (error) {

        next(error);

    }

}

async function me(req, res) {

    res.json({
        success: true,
        data: req.user
    });

}

module.exports = {

    register,
    login,
    me

};