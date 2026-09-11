const express = require('express');
const router = express.Router();
const { createStudent, getAllStudents, deleteStudent } = require('../controllers/studentsController');

router.post('/', createStudent);
router.get('/', getAllStudents);
router.delete('/:id', deleteStudent);

module.exports = router;