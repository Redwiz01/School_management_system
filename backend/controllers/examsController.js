const { addExamToDb, getExamsFromDb, deleteExamFromDb, updateExamInDb } = require('../models/examsModel');

async function createExam(req, res) {
    try {
        const { exam_name, term, academic_year, start_date, end_date, status } = req.body;
        if (!exam_name || !term || !academic_year || !start_date || !end_date || !status) {
            return res.status(400).json({ error: "input required fields" });
        }

        const result = await addExamToDb(exam_name, term, academic_year, start_date, end_date, status);
        res.status(201).json({ message: "exam added successfully" })
    }
    catch (err) {
        console.error(err)
        return res.status(500).json({ error: "Internal server error" })
    }
}

async function getExams(req, res) {
    try {
        const rows = await getExamsFromDb();
        res.status(200).json({ exams: rows });

    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: "internal server error" })
    }
}

async function deleteExam(req, res) {
    try {
        let id = req.params.id;
        const result = await deleteExamFromDb(id);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Exam not found" })
        }
        res.status(200).json({ message: "deleted successfully" })
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: "internal server error" })
    }
}

async function updateExam(req, res) {
    try {
        const { exam_name, start_date, end_date, status } = req.body;
        let id = req.params.id;

        if (!exam_name || !start_date || !end_date || !status) {
            return res.status(400).json({ error: "input required fields" })
        }

        const result = await updateExamInDb(exam_name, start_date, end_date, status, id);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "exam not found" })
        }
        res.status(200).json({ message: "updated successfully" })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

module.exports = { createExam, getExams, deleteExam, updateExam }