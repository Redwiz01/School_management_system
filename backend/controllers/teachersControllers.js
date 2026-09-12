async function createTeacher(req, res) {
    const { addTeacherToDb } = require('../models/teachersModel');
    try {
        const {
            first_name,
            last_name,
            employee_number,
            date_of_birth,
            gender,
            phone,
            email,
            subject,
            department,
            status
        } = req.body;

        if (
            !first_name ||
            !last_name ||
            !employee_number ||
            !date_of_birth ||
            !gender ||
            !phone ||
            !email ||
            !subject ||
            !department ||
            !status
        ) {
            return res.status(400).json({
                error: "Fill in required fields"
            });
        }
        let result = await addTeacherToDb;
        res.status(200).json({
            message: "new teacher added",
            id: result.insertId
        })
    }
    catch (err) {
        return res.status(500).json({ error: "Internal server error" });
    }
}

module.exports = { createTeacher };