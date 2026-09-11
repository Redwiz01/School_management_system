const db = require('../config/db');

async function findStudentByAdmission(admission_number) {
    const [rows] = await db.query('SELECT * FROM students WHERE admission_number=? ', [admission_number]);
    return rows[0];

}

async function addStudentToDb(first_name,
    last_name,
    admission_number,
    date_of_birth,
    gender,
    class_Id,
    parent_name,
    parent_phone,
    status) {
    const [result] = await db.query('INSERT INTO students(first_name,last_name,admission_number,date_of_birth,gender,class_Id,parent_name,parent_phone,status) VALUES(?,?,?,?,?,?,?,?,?)',
        [first_name, last_name, admission_number, date_of_birth, gender, class_Id, parent_name, parent_phone, status]);
    return result;

}

async function getAllStudentsFromDb() {
    const [rows] = await db.query('SELECT * FROM students');
    return rows;
}

async function removeStudentFromDb(id) {
    const [result] = await db.query('DELETE FROM students WHERE id=?', [id]);
    return result;
}

module.exports = { findStudentByAdmission, addStudentToDb, getAllStudentsFromDb, removeStudentFromDb };