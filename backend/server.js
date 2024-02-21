const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const gradeRoutes = require('./routes/gradeRoutes');
const authRoutes = require('./routes/authRoutes');
require('dotenv').config();

app.use(express.json()); // Middleware to parse JSON bodies

app.get('/', (req, res) => res.send('IB Grade Management System Backend Running'));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Use gradeRoutes for any requests to /api/grades
app.use('/api', gradeRoutes);

app.use('/api', authRoutes);

