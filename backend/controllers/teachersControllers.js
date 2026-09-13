const { addTeacherToDb, getTeachersFromDb } = require('../models/teachersModel');

async function createTeacher(req, res) {

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
        let result = await addTeacherToDb
            (
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
            );

        console.log("INSERT RESULT:", result);


        res.status(200).json({
            message: "new teacher added",
            id: result.insertId
        })
    }
    catch (err) {
        console.error("CREATE TEACHER ERROR:", err);
        return res.status(500).json({ error: "Internal server error" });
    }
}

async function getTeachers(req, res) {
    try {
        const teachers = await getTeachersFromDb();

        if (teachers.length === 0) {
            return res.status(200).json({ teachers: [] })
        }

        res.status(200).json({ teachers: teachers });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal server error" })
    }
}

module.exports = { createTeacher, getTeachers };