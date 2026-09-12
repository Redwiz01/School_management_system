const db = require('../config/db');

async function addTeacherToDb(first_name, last_name, employee_number, date_of_birth, gender, phone, email, subject, department, status) {

    const [result] = await db.query('INSERT INTO teachers( first_name, last_name, employee_number, date_of_birth, gender, phone, email, subject,department, status) VALUES(?,?,?,?,?,?,?,?,?,?)',
        [first_name, last_name, employee_number, date_of_birth, gender, phone, email, subject, department, status]
    );
    return result;
}



module.exports = { addTeacherToDb };