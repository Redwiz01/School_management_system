const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');
const { authenticateToken } = require('../middleWare/authMiddleware');
const { authorizeRole } = require('../middleWare/authorizeRoles');

router.post('/register', authenticateToken, authorizeRole('admin'), registerUser);
router.post('/login', loginUser);

module.exports = router;