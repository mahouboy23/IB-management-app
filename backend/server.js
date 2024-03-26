const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const gradeRoutes = require('./routes/gradeRoutes');
const authRoutes = require('./routes/authRoutes');
const classRoutes = require('./routes/classRoutes'); 
const boundariesRoutes = require('./routes/boundariesRoute');
const userRoutes = require('./routes/userRoutes');
require('dotenv').config();

app.use(express.json()); // Middleware to parse JSON bodies

app.get('/', (req, res) => res.send('IB Grade Management System Backend Running'));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


app.use('/api', gradeRoutes);

app.use('/api', authRoutes);

app.use('/api', classRoutes);

app.use('/api', boundariesRoutes);

app.use('/api', userRoutes);
