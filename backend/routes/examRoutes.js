const express = require('express');
const router = express.Router();
const { createExam, getExams, deleteExam, updateExam } = require('../controllers/examsController');
const { authenticateToken } = require('../middleWare/authMiddleware');
const { authorizeRole } = require('../middleWare/authorizeRoles');

router.post('/', authenticateToken, authorizeRole('admin', 'teacher'), createExam);
router.get('/', authenticateToken, authorizeRole('admin', 'teacher'), getExams);
router.delete('/:id', authenticateToken, authorizeRole('admin'), deleteExam);
router.put('/:id', authenticateToken, authorizeRole('admin', 'teacher'), updateExam);

module.exports = router;