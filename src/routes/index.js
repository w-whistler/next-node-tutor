const express = require('express');
const router = express.Router();
const logger = require('../lib/logger');

router.get('/', function (req, res) {
  logger.info('GET /api -> 200');
  res.json({ message: 'Store API', version: '1.0' });
});

router.use('/auth', require('./auth'));
router.use('/shop', require('./shop'));
router.use('/cart', require('./cart'));
router.use('/favorites', require('./favorites'));

module.exports = router;
