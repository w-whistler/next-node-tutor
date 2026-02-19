const express = require('express');
const router = express.Router();
const CategoryTree = require('../models/CategoryTree');
const Product = require('../models/Product');
const AdSlide = require('../models/AdSlide');
const Notice = require('../models/Notice');
const HomeSection = require('../models/HomeSection');

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
  CategoryTree.findOne({ key: 'default' })
    .lean()
    .then(function (doc) {
      const tree = (doc && doc.tree) ? doc.tree : [];
      res.set(CACHE_HEADERS);
      res.json(tree);
    })
    .catch(next);
});

router.get('/ads', function (req, res, next) {
  AdSlide.find({}).sort({ id: 1 }).lean()
    .then(function (docs) {
      const list = docs.map(function (d) {
        return { id: d.id, title: d.title || '', subtitle: d.subtitle || '', image: d.image || '' };
      });
      res.set(CACHE_HEADERS);
      res.json(list);
    })
    .catch(next);
});

router.get('/notices', function (req, res, next) {
  Notice.find({}).sort({ id: 1 }).lean()
    .then(function (docs) {
      const list = docs.map(function (d) { return { id: d.id, text: d.text || '' }; });
      res.set(CACHE_HEADERS);
      res.json(list);
    })
    .catch(next);
});

router.get('/home', function (req, res, next) {
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
          res.set(CACHE_HEADERS);
          res.json({ recommended, mostVisited, trending });
        });
    })
    .catch(next);
});

router.get('/category', function (req, res, next) {
  const level1Id = req.query.id;
  if (!level1Id || typeof level1Id !== 'string') {
    return res.status(400).json({ error: 'Missing category id' });
  }
  Product.find({ categoryId: level1Id }).lean()
    .then(function (products) {
      res.set(CACHE_HEADERS);
      res.json(products);
    })
    .catch(next);
});

router.get('/products', function (req, res, next) {
  const id = req.query.id;
  const ids = req.query.ids;
  const categoryParam = req.query.category;
  const q = req.query.q;
  const sort = req.query.sort;
  const onsale = req.query.onsale;

  if (id && typeof id === 'string') {
    return Product.findOne({ id: id }).lean()
      .then(function (product) {
        if (!product) return res.status(404).json({ error: 'Product not found' });
        res.set(CACHE_HEADERS);
        res.json(product);
      })
      .catch(next);
  }

  if (ids) {
    const idList = typeof ids === 'string' ? ids.split(',').map(function (s) { return s.trim(); }).filter(Boolean) : [];
    return Product.find({ id: { $in: idList } }).lean()
      .then(function (products) {
        const byId = {};
        products.forEach(function (p) { byId[p.id] = p; });
        const ordered = idList.map(function (id) { return byId[id]; }).filter(Boolean);
        res.set(CACHE_HEADERS);
        res.json(ordered);
      })
      .catch(next);
  }

  Product.find({}).lean()
    .then(function (products) {
      return HomeSection.findOne({ key: 'default' }).lean()
        .then(function (doc) {
          const recommendedOrder = (doc && doc.recommendedProductIds) ? doc.recommendedProductIds : [];
          const filtered = filterAndSortProducts(products, { q, sort, category: categoryParam, onsale }, recommendedOrder);
          res.set('Cache-Control', 'public, s-maxage=30, stale-while-revalidate=60');
          res.json(filtered);
        });
    })
    .catch(next);
});

module.exports = router;
