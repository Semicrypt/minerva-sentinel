const pool = require("../config/database");

/**
 * Find user by email
 */
async function findByEmail(email) {

    const result = await pool.query(
        `
        SELECT *
        FROM users
        WHERE email = $1
        `,
        [email]
    );

    return result.rows[0];

}

/**
 * Find user by ID
 */
async function findById(id) {

    const result = await pool.query(
        `
        SELECT
            id,
            full_name,
            email,
            role,
            created_at
        FROM users
        WHERE id = $1
        `,
        [id]
    );

    return result.rows[0];

}

/**
 * Create new user
 */
async function createUser(fullName, email, passwordHash) {

    const result = await pool.query(
        `
        INSERT INTO users
        (
            full_name,
            email,
            password_hash
        )
        VALUES
        (
            $1,
            $2,
            $3
        )
        RETURNING
            id,
            full_name,
            email,
            role,
            created_at
        `,
        [
            fullName,
            email,
            passwordHash
        ]
    );

    return result.rows[0];

}

module.exports = {

    findByEmail,
    findById,
    createUser

};