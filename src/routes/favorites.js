const express = require('express');
const router = express.Router();
const Favorites = require('../models/Favorites');
const { requireAuth } = require('../middleware/auth');
const logger = require('../lib/logger');

router.use(requireAuth);

router.get('/', function (req, res, next) {
  const userId = req.userId;
  Favorites.findOne({ userId })
    .lean()
    .then(function (doc) {
      const productIds = (doc && doc.productIds) ? doc.productIds : [];
      logger.info('GET /api/favorites -> 200 userId=', userId, 'count=', productIds.length);
      res.json({ productIds });
    })
    .catch(function (err) {
      logger.error('GET /api/favorites error', err.message);
      next(err);
    });
});

router.put('/', function (req, res, next) {
  const userId = req.userId;
  const productIds = Array.isArray(req.body.productIds)
    ? req.body.productIds.map(function (id) { return String(id); }).filter(Boolean)
    : [];

  Favorites.findOneAndUpdate(
    { userId },
    { $set: { productIds } },
    { new: true, upsert: true }
  )
    .lean()
    .then(function (doc) {
      const result = (doc && doc.productIds) ? doc.productIds : [];
      logger.info('PUT /api/favorites -> 200 userId=', userId, 'count=', result.length);
      res.json({ productIds: result });
    })
    .catch(function (err) {
      logger.error('PUT /api/favorites error', err.message);
      next(err);
    });
});

module.exports = router;
