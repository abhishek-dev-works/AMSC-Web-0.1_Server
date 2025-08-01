require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

// ----- Config -----
const PORT = Number(process.env.PORT || 5000);
const MONGO_URI = process.env.CONNECTION_STRING; 

if (!MONGO_URI) {
  console.error('❌ Missing CONNECTION_STRING in .env');
  process.exit(1);
}

// ----- Middleware -----
app.use(express.json());

// CORS: allow all in dev, lock down via env in prod if you want
const corsOptions = {
  origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : true,
  credentials: true,
};
app.use(cors(corsOptions));

// ----- Health & basic routes -----
app.get('/health', (_req, res) => res.json({ ok: true }));
app.get('/', (_req, res) => res.json({ name: 'AMSC Admin API', version: '1.0.0' }));

// Feature routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/appointments', require('./routes/appointmentRoutes'));
app.use('/api/operations', require('./routes/operationsRoutes'));
app.use('/api/search', require('./routes/searchRoutes'));

// 404 handler
app.use((req, res) => res.status(404).json({ message: 'Not found' }));

// Error handler (keep last)
app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'Internal server error' });
});

// ----- Mongo & Server bootstrap -----
async function start() {
  try {
    // Optional: tweak Mongoose behavior (Mongoose v8)
    // mongoose.set('strictQuery', true);

    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      dbName: 'amsc-digi', // use if your URI doesn’t include a db name
    });
    console.log('✅ MongoDB Connected');

    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

    // Graceful shutdown
    const shutdown = async (signal) => {
      console.log(`\n${signal} received. Shutting down...`);
      server.close(async () => {
        await mongoose.connection.close();
        console.log('🛑 HTTP server closed & Mongo disconnected.');
        process.exit(0);
      });
      // Fallback: force exit after 10s
      setTimeout(() => process.exit(1), 10_000).unref();
    };
    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('unhandledRejection', (e) => console.error('UnhandledRejection:', e));
    process.on('uncaughtException', (e) => console.error('UncaughtException:', e));
  } catch (err) {
    console.error('❌ Startup error:', err);
    process.exit(1);
  }
}

start();
