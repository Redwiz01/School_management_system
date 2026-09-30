const db = require('../config/db');

async function addResultToDb(student, exam, marks, grade) {
    const [result] = await db.query('INSERT INTO results(student_id, exam_id, marks, grade) VALUES(?,?,?,?)',
        [student, exam, marks, grade]
    )
    return result;
}

async function getResultsFromDb() {
    const [rows] = await db.query('SELECT * FROM results');
    return rows;
}

module.exports = { addResultToDb, getResultsFromDb };