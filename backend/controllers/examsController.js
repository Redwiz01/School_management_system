const { addExamToDb, getExamsFromDb } = require('../models/examsModel');

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

module.exports = { createExam, getExams }