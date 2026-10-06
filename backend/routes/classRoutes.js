const express = require('express');
const router = express.Router();
const { createClass, getClasses, deleteClass, editClass } = require('../controllers/classesController');
const { authenticateToken } = require('../middleWare/authMiddleware');
const { authorizeRole } = require('../middleWare/authorizeRoles');
console.log("getClasses route reached");

router.post('/', authenticateToken, authorizeRole('admin'), createClass);
router.get('/', authenticateToken, authorizeRole('admin', 'teacher'), getClasses);
router.delete('/:id', authenticateToken, authorizeRole('admin'), deleteClass);
router.put('/:id', authenticateToken, authorizeRole('admin'), editClass);

module.exports = router;