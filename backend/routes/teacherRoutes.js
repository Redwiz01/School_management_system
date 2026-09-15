const express = require('express');
const router = express.Router();
const { createTeacher, getTeachers, deleteTeacher, updateTeacher } = require('../controllers/teachersControllers');

router.post('/', createTeacher);
router.get('/', getTeachers);
router.delete('/:id', deleteTeacher)
router.put('/:id', updateTeacher);

module.exports = router;