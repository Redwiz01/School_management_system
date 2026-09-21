const { findStudentByAdmission, addStudentToDb, getAllStudentsFromDb, removeStudentFromDb, updateStudentRecord, totalStudentsPerClass } = require('../models/studentsModel');
async function createStudent(req, res) {

    try {
        const { first_name,
            last_name,
            admission_number,
            date_of_birth,
            gender,
            class_Id,
            parent_name,
            parent_phone,
            status } = req.body;



        if (!first_name || !last_name || !admission_number || !date_of_birth || !gender || !class_Id || !parent_name || !parent_phone || !status) {
            return res.status(400).json({ error: "input required fields" })
        }

        let exists = await findStudentByAdmission(admission_number);
        if (exists) {
            return res.status(409).json({ error: "student already exists" });
        }

        let result = await addStudentToDb(first_name, last_name, admission_number, date_of_birth, gender, class_Id, parent_name, parent_phone, status)

        res.status(201).json({
            message: "student created successfully",
            id: result.insertId
        })
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: "internal server error" });
    }
}

async function getAllStudents(req, res) {
    try {
        const students = await getAllStudentsFromDb();

        res.status(200).json(students);
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: "internal server error" })
    }

}

async function deleteStudent(req, res) {
    try {
        let id = req.params.id;
        let result = await removeStudentFromDb(id);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "student does not exist" })
        }

        res.status(200).json({ message: "Deleted successfully" })
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal server error" })

    }
}

async function updateStudent(req, res) {
    try {
        const { admission_number, class_Id, status } = req.body;
        let id = req.params.id;

        const result = await updateStudentRecord(admission_number, class_Id, status, id);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Cannot find student" });
        }

        res.status(200).json({ message: "Student update successful" })
    }
    catch (err) {
        console.error(err)
        return res.status(500).json({ error: "Internal server error" })
    }

}

async function totalStudentsInClass(req, res) {
    try {
        const id = req.params.id;
        let total = await totalStudentsPerClass(id);
        return res.status(200).json({ total: total });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ error: "internal server error" });
    }

}
module.exports = { createStudent, getAllStudents, deleteStudent, updateStudent, totalStudentsInClass }
