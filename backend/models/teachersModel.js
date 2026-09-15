const db = require('../config/db');

async function addTeacherToDb(first_name, last_name, employee_number, date_of_birth, gender, phone, email, subject, department, status) {

    const [result] = await db.query('INSERT INTO teachers( first_name, last_name, employee_number, date_of_birth, gender, phone, email, subject,department, status) VALUES(?,?,?,?,?,?,?,?,?,?)',
        [first_name, last_name, employee_number, date_of_birth, gender, phone, email, subject, department, status]
    );
    return result;
}

async function getTeachersFromDb() {
    const [rows] = await db.query('SELECT * FROM teachers');

    return rows;
}

async function removeTeacherFromDb(id) {
    const [result] = await db.query('DELETE FROM teachers WHERE id=?', [id]);

    return result;
}

async function updateTeacherRecords(id, employee_number, subject, phone, status) {
    const [result] = await db.query('UPDATE teachers SET employee_number=?, subject=?, phone=?, status=? WHERE id=?',
        [employee_number, subject, phone, status, id]
    )

    return result;
}


module.exports = { addTeacherToDb, getTeachersFromDb, removeTeacherFromDb, updateTeacherRecords };