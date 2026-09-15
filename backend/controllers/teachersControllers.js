const { addTeacherToDb, getTeachersFromDb, removeTeacherFromDb, updateTeacherRecords } = require('../models/teachersModel');

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

async function deleteTeacher(req, res) {
    try {
        let id = req.params.id;

        let result = await removeTeacherFromDb(id);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Record not found" })
        }

        res.status(200).json({ message: "record deletion success" })
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal server error" })
    }

}

async function updateTeacher(req, res) {
    try {
        const { employee_number,
            subject,
            phone,
            status
        } = req.body


        let id = req.params.id;
        const result = await updateTeacherRecords(id, employee_number, subject, phone, status);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Teacher not found" })
        }
        res.status(200).json({ message: "Teacher updated successfully" })
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: " internal server error" })
    }
}

module.exports = { createTeacher, getTeachers, deleteTeacher, updateTeacher };