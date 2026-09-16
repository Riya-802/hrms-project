require('dotenv').config();
const app = require('./src/app');

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`🚀 HRMS Backend Server running in ${process.env.NODE_ENV || 'development'} mode on http://localhost:${PORT}`);
});

// Unhandled Promise Rejection Handler
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection Error:', err);
  server.close(() => process.exit(1));
});
