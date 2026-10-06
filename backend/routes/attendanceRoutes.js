const express = require('express');
const router = express.Router();
const { createAttendance, getAttendance } = require('../controllers/attendanceController');
const { authenticateToken } = require('../middleWare/authMiddleware');
const { authorizeRole } = require('../middleWare/authorizeRoles');

router.post('/', authenticateToken, authorizeRole('admin', 'teacher'), createAttendance);
router.get('/', authenticateToken, authorizeRole('admin', 'teacher'), getAttendance);

module.exports = router;