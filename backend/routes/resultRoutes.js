const express = require('express');
const router = express.Router();
const { createResult, getResults } = require('../controllers/resultsController');

router.post('/', createResult);
router.get('/', getResults);

module.exports = router;