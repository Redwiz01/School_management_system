const express = require('express');
const router = express.Router();
const { createExam, getExams } = require('../controllers/examsController');

router.post('/', createExam);
router.get('/', getExams);

module.exports = router;