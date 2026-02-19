const express = require('express');
const router = express.Router();
const logger = require('../lib/logger');

router.get('/', function (req, res) {
  logger.info('GET /api -> 200');
  res.json({ message: 'Store API', version: '1.0' });
});

router.use('/shop', require('./shop'));

module.exports = router;
