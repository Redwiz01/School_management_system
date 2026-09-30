const express = require('express');
const router = express.Router();
const { createFeePayment, getFeePayments, deletePayment, getPaymentSummary } = require('../controllers/feesController');

router.post('/', createFeePayment);
router.get('/', getFeePayments);
router.delete('/:id', deletePayment);
router.get('/summary', getPaymentSummary);

module.exports = router;