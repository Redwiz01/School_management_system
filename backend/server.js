const express = require('express');
const app = express();
const cors = require('cors');
const studentRoutes = require('./routes/studentRoutes');
const path = require('path');
require('dotenv').config();
const port = process.env.PORT;


app.use(cors());
app.use(express.json());
app.use('/students', studentRoutes);
app.use(express.static(path.join(__dirname, '../frontend')));


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})