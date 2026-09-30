const { addResultToDb, getResultsFromDb } = require('../models/resultsModel');

async function createResult(req, res) {
    try {
        const { student, exam, marks, grade } = req.body;
        if (!student || !exam || !marks) {
            return res.status(400).json({ error: "fill the required fields" })
        }

        const result = await addResultToDb(student, exam, marks, grade);
        res.status(201).json({
            message: "Record created successfully",
            id: result.insertId
        })
    }
    catch (err) {
        console.error(err)
        return res.status(500).json({ error: "internal server error" })
    }
}

async function getResults(req, res) {
    try {
        const results = await getResultsFromDb();
        if (results.length === 0) {
            return res.status(404).json({ error: "results are empty" })
        }
        res.status(200).json({ results: results });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal server error" });
    }
}

module.exports = { createResult, getResults }