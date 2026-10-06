const { addAttendanceToDb, getAttendanceFromDb } = require('../models/attendanceModel');

async function createAttendance(req, res) {
    try {
        const { attendanceArray } = req.body;
        for (const attendance of attendanceArray) {
            const result = await addAttendanceToDb(attendance.student_id, attendance.attendance_date, attendance.status);
        }
        res.status(201).json({
            message: "attendance added successfully"
        })

    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal server error" })
    }

}

async function getAttendance(req, res) {
    try {
        const attendance = await getAttendanceFromDb();

        res.status(200).json({ attendance });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" })
    }
}

module.exports = { createAttendance, getAttendance };