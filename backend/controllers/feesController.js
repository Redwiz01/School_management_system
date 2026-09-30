const { addFeesToDb, getPaymentsFromDb, deletePaymentFromDb, getPaymentSummaryFromDb } = require('../models/feesModel');

async function createFeePayment(req, res) {
    try {
        const { student_id, amount, payment_method, reference, payment_date } = req.body;

        if (!student_id || !amount || !payment_method || !reference || !payment_date) {
            return res.status(400).json({ error: "fill in required fields" })
        }
        const result = await addFeesToDb(student_id, amount, payment_method, reference, payment_date);
        res.status(201).json({
            message: "Record created successfully",
            id: result.insertId
        })
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: "internal server error" });
    }
}

async function getFeePayments(req, res) {
    try {
        const payments = await getPaymentsFromDb();

        res.status(200).json({ payments });

    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
}

async function deletePayment(req, res) {
    try {
        let id = req.params.id;
        const result = await deletePaymentFromDb(id);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "record not found" })
        }

        res.status(200).json({ message: "record deleted successfully" });
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
}

async function getPaymentSummary(req, res) {
    try {
        const summary = await getPaymentSummaryFromDb();
        res.status(200).json({ summary });

    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal server error" });
    }
}

module.exports = { createFeePayment, getFeePayments, deletePayment, getPaymentSummary };