const express = require('express');
const router = express.Router();
const { createStudent, getAllStudents, deleteStudent, updateStudent, totalStudentsInClass } = require('../controllers/studentsController');
const { authenticateToken } = require('../middleWare/authMiddleware');
const { authorizeRole } = require('../middleWare/authorizeRoles');

router.post('/', authenticateToken, authorizeRole('admin', 'teacher'), createStudent);
router.get('/', authenticateToken, authorizeRole('admin', 'teacher', 'finance'), getAllStudents);
router.delete('/:id', authenticateToken, authorizeRole('admin'), deleteStudent);
router.put('/:id', authenticateToken, authorizeRole('admin', 'teacher'), updateStudent);
router.get('/class/:id', authenticateToken, authorizeRole('admin', 'teacher', 'finance'), totalStudentsInClass);
module.exports = router;