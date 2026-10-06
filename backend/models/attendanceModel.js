const db = require('../config/db');

async function addAttendanceToDb(student_id, attendance_date, status) {
    const [result] = await db.query('INSERT INTO attendance(student_id, attendance_date, status) VALUES(?,?,?)',
        [student_id, attendance_date, status]
    )
    return result;
}

async function getAttendanceFromDb() {
    const [rows] = await db.query('SELECT * FROM attendance');
    return rows;
}

module.exports = { addAttendanceToDb, getAttendanceFromDb }