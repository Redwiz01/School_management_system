const express = require('express');
const router = express.Router();
const { createResult, getResults } = require('../controllers/resultsController');
const { authenticateToken } = require('../middleWare/authMiddleware');
const { authorizeRole } = require('../middleWare/authorizeRoles');

router.post('/', authenticateToken, authorizeRole('admin', 'teacher'), createResult);
router.get('/', authenticateToken, authorizeRole('admin', 'teacher'), getResults);

module.exports = router;