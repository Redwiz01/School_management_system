const db = require('../config/db');

async function addExamToDb(exam_name, term, academic_year, start_date, end_date, status) {
    const [result] = await db.query("INSERT INTO exams(exam_name, term, academic_year, start_date, end_date, status) VALUES(?,?,?,?,?,?)",
        [exam_name, term, academic_year, start_date, end_date, status]
    )

    return result;
}

async function getExamsFromDb() {
    const [rows] = await db.query('SELECT * FROM exams');
    return rows;
}

module.exports = { addExamToDb, getExamsFromDb };