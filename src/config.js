require('dotenv').config();

module.exports = {
  // Default 3001 so Store frontend (often on 3000) can run alongside without port conflict.
  port: process.env.PORT || 3001,
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/store',
  // Allowed origin(s) for CORS. Comma-separated. Include both localhost and 127.0.0.1 for dev.
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000,http://127.0.0.1:3000',
};
