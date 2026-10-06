const { addUserToDb, findUserByEmail } = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

async function registerUser(req, res) {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ error: "fill in required fields" })
        }
        const role = "teacher";
        let hashedPass = await bcrypt.hash(password, 10)
        const result = await addUserToDb(username, email, hashedPass, role);
        res.status(201).json({
            message: "user created successfully",
            id: result.insertId
        })
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: "internal server error" })
    }
}

async function loginUser(req, res) {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: "fill in the required fields" });
        }
        let user = await findUserByEmail(email);
        if (!user) {
            return res.status(401).json({ error: "Invalid credentials" });
        }
        const verified = await bcrypt.compare(password, user.password);
        if (!verified) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const token = jwt.sign({
            id: user.id,
            role: user.role
        },
            process.env.JWT_SECRET,
            { expiresIn: '1h' })
        res.status(200).json({
            message: "logged in successfully!",
            token: token
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" })
    }
}

module.exports = { registerUser, loginUser };