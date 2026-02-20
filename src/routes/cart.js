const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const { requireAuth } = require('../middleware/auth');
const logger = require('../lib/logger');

router.use(requireAuth);

router.get('/', function (req, res, next) {
  const userId = req.userId;
  Cart.findOne({ userId })
    .lean()
    .then(function (doc) {
      const items = (doc && doc.items) ? doc.items : [];
      logger.info('GET /api/cart -> 200 userId=', userId, 'items=', items.length);
      res.json({ items });
    })
    .catch(function (err) {
      logger.error('GET /api/cart error', err.message);
      next(err);
    });
});

router.put('/', function (req, res, next) {
  const userId = req.userId;
  const items = Array.isArray(req.body.items) ? req.body.items : [];
  const normalized = items.map(function (item) {
    return {
      productId: String(item.productId || item.id || ''),
      title: String(item.title || ''),
      price: Number(item.price) || 0,
      sku: String(item.sku || ''),
      quantity: Math.max(1, parseInt(item.quantity, 10) || 1),
    };
  }).filter(function (item) { return item.productId; });

  Cart.findOneAndUpdate(
    { userId },
    { $set: { items: normalized } },
    { new: true, upsert: true }
  )
    .lean()
    .then(function (doc) {
      const result = (doc && doc.items) ? doc.items : [];
      logger.info('PUT /api/cart -> 200 userId=', userId, 'items=', result.length);
      res.json({ items: result });
    })
    .catch(function (err) {
      logger.error('PUT /api/cart error', err.message);
      next(err);
    });
});

module.exports = router;
