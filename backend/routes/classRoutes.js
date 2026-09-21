const express = require('express');
const router = express.Router();
const { createClass, getClasses, deleteClass, editClass } = require('../controllers/classesController');
console.log("getClasses route reached");

router.post('/', createClass);
router.get('/', getClasses);
router.delete('/:id', deleteClass);
router.put('/:id', editClass);

module.exports = router;