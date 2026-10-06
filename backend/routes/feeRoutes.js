const express = require('express');
const router = express.Router();
const { createFeePayment, getFeePayments, deletePayment, getPaymentSummary } = require('../controllers/feesController');
const { authenticateToken } = require('../middleWare/authMiddleware');
const { authorizeRole } = require('../middleWare/authorizeRoles');

router.post('/', authenticateToken, authorizeRole('admin', 'finance'), createFeePayment);
router.get('/', authenticateToken, authorizeRole('admin', 'finance'), getFeePayments);
router.delete('/:id', authenticateToken, authorizeRole('admin'), deletePayment);
router.get('/summary', authenticateToken, authorizeRole('admin', 'finance'), getPaymentSummary);

module.exports = router;