const express = require('express');
const router = express.Router();

router.get('/', function (req, res) {
  res.json({ message: 'Store API', version: '1.0' });
});

router.use('/shop', require('./shop'));

module.exports = router;
