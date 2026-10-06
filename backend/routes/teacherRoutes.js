const express = require('express');
const router = express.Router();
const { createTeacher, getTeachers, deleteTeacher, updateTeacher } = require('../controllers/teachersControllers');
const { authenticateToken } = require('../middleWare/authMiddleware');
const { authorizeRole } = require('../middleWare/authorizeRoles');

router.post('/', authenticateToken, authorizeRole('admin'), createTeacher);
router.get('/', authenticateToken, authorizeRole('admin', 'teacher'), getTeachers);
router.delete('/:id', authenticateToken, authorizeRole('admin'), deleteTeacher)
router.put('/:id', authenticateToken, authorizeRole('admin'), updateTeacher);

module.exports = router;