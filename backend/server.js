const express = require('express');
const app = express();
const cors = require('cors');
const studentRoutes = require('./routes/studentRoutes');
const teacherRoutes = require('./routes/teacherRoutes');
const classRoutes = require('./routes/classRoutes');
const path = require('path');
require('dotenv').config();
const port = process.env.PORT;


app.use(cors());
app.use(express.json());
app.use('/students', studentRoutes);
app.use('/teachers', teacherRoutes);
app.use('/classes', classRoutes);
app.use(express.static(path.join(__dirname, '../frontend')));


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})