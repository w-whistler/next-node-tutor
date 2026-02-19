const express = require('express');
const router = express.Router();
const CategoryTree = require('../models/CategoryTree');
const Product = require('../models/Product');
const AdSlide = require('../models/AdSlide');
const Notice = require('../models/Notice');
const HomeSection = require('../models/HomeSection');
const logger = require('../lib/logger');

const CACHE_HEADERS = { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120' };

function filterAndSortProducts(list, params, recommendedOrder) {
  let result = list.slice();
  const term = (params.q && typeof params.q === 'string' ? params.q : '').toLowerCase().trim();
  if (term) {
    result = result.filter(function (p) {
      return (p.title && p.title.toLowerCase().includes(term)) ||
        (p.sku && p.sku.toLowerCase().includes(term));
    });
  }
  if (params.category && typeof params.category === 'string') {
    result = result.filter(function (p) { return p.categoryId === params.category; });
  }
  if (params.onsale === '1') {
    result = result.filter(function (p) { return (p.discountRate || 0) > 0; });
  }
  if (params.sort === 'price_asc') {
    result.sort(function (a, b) { return a.price - b.price; });
  } else if (params.sort === 'price_desc') {
    result.sort(function (a, b) { return b.price - a.price; });
  } else if (params.sort === 'recommendation' && recommendedOrder && recommendedOrder.length) {
    result.sort(function (a, b) {
      const i = recommendedOrder.indexOf(a.id);
      const j = recommendedOrder.indexOf(b.id);
      if (i === -1 && j === -1) return 0;
      if (i === -1) return 1;
      if (j === -1) return -1;
      return i - j;
    });
  }
  return result;
}

router.get('/categories', function (req, res, next) {
  logger.info('GET /api/shop/categories');
  CategoryTree.findOne({ key: 'default' })
    .lean()
    .then(function (doc) {
      const tree = (doc && doc.tree) ? doc.tree : [];
      logger.info('GET /api/shop/categories -> 200, tree nodes=', tree.length);
      res.set(CACHE_HEADERS);
      res.json(tree);
    })
    .catch(function (err) {
      logger.error('GET /api/shop/categories error', err.message);
      next(err);
    });
});

router.get('/ads', function (req, res, next) {
  logger.info('GET /api/shop/ads');
  AdSlide.find({}).sort({ id: 1 }).lean()
    .then(function (docs) {
      const list = docs.map(function (d) {
        return { id: d.id, title: d.title || '', subtitle: d.subtitle || '', image: d.image || '' };
      });
      logger.info('GET /api/shop/ads -> 200, count=', list.length);
      res.set(CACHE_HEADERS);
      res.json(list);
    })
    .catch(function (err) {
      logger.error('GET /api/shop/ads error', err.message);
      next(err);
    });
});

router.get('/notices', function (req, res, next) {
  logger.info('GET /api/shop/notices');
  Notice.find({}).sort({ id: 1 }).lean()
    .then(function (docs) {
      const list = docs.map(function (d) { return { id: d.id, text: d.text || '' }; });
      logger.info('GET /api/shop/notices -> 200, count=', list.length);
      res.set(CACHE_HEADERS);
      res.json(list);
    })
    .catch(function (err) {
      logger.error('GET /api/shop/notices error', err.message);
      next(err);
    });
});

router.get('/home', function (req, res, next) {
  logger.info('GET /api/shop/home');
  HomeSection.findOne({ key: 'default' })
    .lean()
    .then(function (doc) {
      const recommendedIds = (doc && doc.recommendedProductIds) ? doc.recommendedProductIds : [];
      const mostVisitedIds = (doc && doc.mostVisitedProductIds) ? doc.mostVisitedProductIds : [];
      const trendingIds = (doc && doc.trendingProductIds) ? doc.trendingProductIds : [];
      return Product.find({ id: { $in: recommendedIds.concat(mostVisitedIds).concat(trendingIds) } })
        .lean()
        .then(function (products) {
          const byId = {};
          products.forEach(function (p) { byId[p.id] = p; });
          const recommended = recommendedIds.map(function (id) { return byId[id]; }).filter(Boolean);
          const mostVisited = mostVisitedIds.map(function (id) { return byId[id]; }).filter(Boolean);
          const trending = trendingIds.map(function (id) { return byId[id]; }).filter(Boolean);
          logger.info('GET /api/shop/home -> 200, recommended=', recommended.length, 'mostVisited=', mostVisited.length, 'trending=', trending.length);
          res.set(CACHE_HEADERS);
          res.json({ recommended, mostVisited, trending });
        });
    })
    .catch(function (err) {
      logger.error('GET /api/shop/home error', err.message);
      next(err);
    });
});

router.get('/category', function (req, res, next) {
  const level1Id = req.query.id;
  logger.info('GET /api/shop/category query.id=', level1Id);
  if (!level1Id || typeof level1Id !== 'string') {
    logger.warn('GET /api/shop/category -> 400 Missing category id');
    return res.status(400).json({ error: 'Missing category id' });
  }
  Product.find({ categoryId: level1Id }).lean()
    .then(function (products) {
      logger.info('GET /api/shop/category -> 200, categoryId=', level1Id, 'count=', products.length);
      res.set(CACHE_HEADERS);
      res.json(products);
    })
    .catch(function (err) {
      logger.error('GET /api/shop/category error', err.message);
      next(err);
    });
});

router.get('/products', function (req, res, next) {
  const id = req.query.id;
  const ids = req.query.ids;
  const categoryParam = req.query.category;
  const q = req.query.q;
  const sort = req.query.sort;
  const onsale = req.query.onsale;
  logger.info('GET /api/shop/products query=', { id: id || '-', ids: ids ? ids.substring(0, 50) + (ids.length > 50 ? '...' : '') : '-', category: categoryParam || '-', q: q || '-', sort: sort || '-', onsale: onsale || '-' });

  if (id && typeof id === 'string') {
    return Product.findOne({ id: id }).lean()
      .then(function (product) {
        if (!product) {
          logger.warn('GET /api/shop/products?id -> 404 product not found id=', id);
          return res.status(404).json({ error: 'Product not found' });
        }
        logger.info('GET /api/shop/products?id -> 200 id=', id);
        res.set(CACHE_HEADERS);
        res.json(product);
      })
      .catch(function (err) {
        logger.error('GET /api/shop/products?id error', err.message);
        next(err);
      });
  }

  if (ids) {
    const idList = typeof ids === 'string' ? ids.split(',').map(function (s) { return s.trim(); }).filter(Boolean) : [];
    return Product.find({ id: { $in: idList } }).lean()
      .then(function (products) {
        const byId = {};
        products.forEach(function (p) { byId[p.id] = p; });
        const ordered = idList.map(function (id) { return byId[id]; }).filter(Boolean);
        logger.info('GET /api/shop/products?ids -> 200 requested=', idList.length, 'found=', ordered.length);
        res.set(CACHE_HEADERS);
        res.json(ordered);
      })
      .catch(function (err) {
        logger.error('GET /api/shop/products?ids error', err.message);
        next(err);
      });
  }

  Product.find({}).lean()
    .then(function (products) {
      return HomeSection.findOne({ key: 'default' }).lean()
        .then(function (doc) {
          const recommendedOrder = (doc && doc.recommendedProductIds) ? doc.recommendedProductIds : [];
          const filtered = filterAndSortProducts(products, { q, sort, category: categoryParam, onsale }, recommendedOrder);
          logger.info('GET /api/shop/products (list) -> 200 total=', products.length, 'filtered=', filtered.length, 'params=', { q: q || '-', sort: sort || '-', category: categoryParam || '-', onsale: onsale || '-' });
          res.set('Cache-Control', 'public, s-maxage=30, stale-while-revalidate=60');
          res.json(filtered);
        });
    })
    .catch(function (err) {
      logger.error('GET /api/shop/products (list) error', err.message);
      next(err);
    });
});

module.exports = router;
