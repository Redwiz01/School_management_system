const express = require('express');
const router = express.Router();
const { createTeacher } = require('../controllers/teachersControllers');

router.post('/', createTeacher);

module.exports = router;