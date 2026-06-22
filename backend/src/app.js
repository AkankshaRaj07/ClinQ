const express = require('express');
const cors = require('cors');
const queueRoutes = require('./routes/queueRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const historyRoutes = require('./routes/historyRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/queue', queueRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/analytics', analyticsRoutes);

// Base route
app.get('/', (req, res) => {
  res.send('ClinQ API is running...');
});

module.exports = app;
