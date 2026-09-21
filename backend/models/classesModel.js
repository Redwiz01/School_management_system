const db = require('../config/db');

async function addClassToDb(class_name, class_teacher_id, status) {
    const [result] = await db.query('INSERT INTO classes(class_name, class_teacher_id, status) VALUES(?,?,?)',
        [class_name, class_teacher_id, status]
    )

    return result;
}

async function getClassesFromDb() {
    console.log("getClasses model reached");
    const [rows] = await db.query('SELECT * FROM classes');

    return rows;
}

async function removeClassFromDb(id) {
    const [result] = await db.query('DELETE FROM classes WHERE id=?', [id]);

    return result;
}

async function editClassInDb(class_name, class_teacher_id, status, id) {
    const [result] = await db.query('UPDATE classes SET class_name=?, class_teacher_id=?, status=? WHERE id=?',
        [class_name, class_teacher_id, status, id]);

    return result;

}



module.exports = { addClassToDb, getClassesFromDb, removeClassFromDb, editClassInDb };