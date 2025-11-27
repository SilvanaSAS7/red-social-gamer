const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const streamRoutes = require('./routes/streams');

const app = express();

// Origen exacto de tu frontend (ajusta si usas otro puerto)
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:3000';
app.use(cors({ origin: FRONTEND_ORIGIN }));

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/streams', streamRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server listening http://localhost:${PORT}`));