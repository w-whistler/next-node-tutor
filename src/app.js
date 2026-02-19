const express = require('express');
const config = require('./config');
const logger = require('./lib/logger');

const app = express();

// CORS: allow frontend origin so browser can call this API
const corsOrigin = config.corsOrigin || 'http://localhost:3000,http://127.0.0.1:3000';
const allowedOrigins = corsOrigin.split(',').map(function (s) { return s.trim(); }).filter(Boolean);
logger.info('CORS allowedOrigins=', allowedOrigins);

app.use(function (req, res, next) {
  const start = Date.now();
  res.on('finish', function () {
    logger.info('Response', res.statusCode, req.method, req.url, 'in', Date.now() - start, 'ms');
  });
  logger.info('Request', req.method, req.url, 'origin=', req.headers.origin || '(none)');
  const origin = req.headers.origin;
  if (origin && allowedOrigins.indexOf(origin) !== -1) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else if (allowedOrigins.length > 0) {
    res.setHeader('Access-Control-Allow-Origin', allowedOrigins[0]);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Max-Age', '86400');
  if (req.method === 'OPTIONS') {
    logger.info('OPTIONS preflight -> 204');
    return res.sendStatus(204);
  }
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', function (req, res) {
  logger.info('GET /health -> 200');
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api', require('./routes'));

app.use(function (err, req, res, next) {
  logger.error('Unhandled error', err.message, err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

module.exports = app;
