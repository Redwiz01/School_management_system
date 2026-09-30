const db = require('../config/db');

async function addFeesToDb(student_id, amount, payment_method, reference, payment_date) {
    const [result] = await db.query('INSERT INTO fee_payments(student_id, amount, payment_method, reference, payment_date) VALUES(?,?,?,?,?)',
        [student_id, amount, payment_method, reference, payment_date]
    )

    return result;
}

async function getPaymentsFromDb() {
    const [rows] = await db.query('SELECT * FROM fee_payments');
    return rows;
}

async function deletePaymentFromDb(id) {
    const [result] = await db.query('DELETE FROM fee_payments WHERE id=?', [id]);
    return result;
}

async function getPaymentSummaryFromDb() {
    const [rows] = await db.query('SELECT COALESCE (SUM(amount),0) AS total_collected, COUNT(*) AS total_payments FROM fee_payments');
    return rows[0];
}

module.exports = { addFeesToDb, getPaymentsFromDb, deletePaymentFromDb, getPaymentSummaryFromDb };