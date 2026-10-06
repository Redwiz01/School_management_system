const db = require('../config/db');

async function addUserToDb(username, email, password, role) {
    const [result] = await db.query('INSERT INTO users(username, email, password, role) VALUES(?,?,?,?)',
        [username, email, password, role]
    )

    return result;
}

async function findUserByEmail(email) {
    const [rows] = await db.query('SELECT * FROM users WHERE email=?', [email]);

    return rows[0];
}

module.exports = { addUserToDb, findUserByEmail };