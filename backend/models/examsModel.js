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

async function deleteExamFromDb(id) {
    const [result] = await db.query('DELETE FROM exams WHERE id=?', [id]);
    return result;
}

async function updateExamInDb(exam_name, start_date, end_date, status, id) {
    const [result] = await db.query('UPDATE exams SET exam_name=?, start_date=?, end_date=?, status=? WHERE id=? ',
        [exam_name, start_date, end_date, status, id]
    )
    return result;
}
module.exports = { addExamToDb, getExamsFromDb, deleteExamFromDb, updateExamInDb };