const express = require('express');
const router = express.Router();
const { createExam, getExams, deleteExam, updateExam } = require('../controllers/examsController');

router.post('/', createExam);
router.get('/', getExams);
router.delete('/:id', deleteExam);
router.put('/:id', updateExam);

module.exports = router;