const { addClassToDb, getClassesFromDb, removeClassFromDb, editClassInDb } = require('../models/classesModel');

async function createClass(req, res) {
    try {
        const { class_name, class_teacher_id, status } = req.body;

        if (!class_name || !class_teacher_id || !status) {
            return res.status(400).json({ error: "fill in required fields" })
        }

        const result = await addClassToDb(class_name, class_teacher_id, status);

        res.status(201).json({
            message: "class added successfully",
            id: result.insertId
        })
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal server error" })
    }

}

async function getClasses(req, res) {
    console.log("getClasses controller reached");
    try {
        const classes = await getClassesFromDb();

        res.status(200).json({ classes });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal Server Error" })
    }

}

async function deleteClass(req, res) {
    try {
        const id = req.params.id;

        const result = await removeClassFromDb(id);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Class not found" })
        }

        res.status(200).json({ message: "class Deletion successful" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }

}

async function editClass(req, res) {
    try {
        const { class_name, class_teacher_id, status } = req.body;
        let id = req.params.id;

        const result = await editClassInDb(class_name, class_teacher_id, status, id);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "class not found" });
        }

        res.status(200).json({ message: "class edit successful" })

    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal server error" });

    }

}

module.exports = { createClass, getClasses, deleteClass, editClass };