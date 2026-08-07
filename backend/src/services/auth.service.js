const bcrypt = require("bcrypt");

const userRepository = require("../repositories/user.repository");

const ValidationError = require("../errors/ValidationError");
const ConflictError = require("../errors/ConflictError");
const AuthenticationError = require("../errors/AuthenticationError");

const { generateToken } = require("../utils/jwt");

const SALT_ROUNDS = 10;

/**
 * Register User
 */
async function registerUser(fullName, email, password) {

    fullName = fullName.trim();
    email = email.trim().toLowerCase();

    if (!fullName || !email || !password) {
        throw new ValidationError("All fields are required.");
    }

    if (password.length < 8) {
        throw new ValidationError(
            "Password must be at least 8 characters."
        );
    }

    const existingUser = await userRepository.findByEmail(email);

    if (existingUser) {
        throw new ConflictError("Email is already registered.");
    }

    const passwordHash = await bcrypt.hash(
        password,
        SALT_ROUNDS
    );

    const user = await userRepository.createUser(
        fullName,
        email,
        passwordHash
    );

    return user;
}

/**
 * Login User
 */
async function loginUser(email, password) {

    if (!email || !password) {
        throw new ValidationError(
            "Email and password are required."
        );
    }

    email = email.trim().toLowerCase();

    const user = await userRepository.findByEmail(email);

    if (!user) {
        throw new AuthenticationError(
            "Invalid email or password."
        );
    }

    const validPassword = await bcrypt.compare(
        password,
        user.password_hash
    );

    if (!validPassword) {
        throw new AuthenticationError(
            "Invalid email or password."
        );
    }

    const token = generateToken(user);

    return {
        token,
        user: {
            id: user.id,
            full_name: user.full_name,
            email: user.email,
            role: user.role
        }
    };

}

module.exports = {

    registerUser,
    loginUser

};