/**
 * Seed script: populates MongoDB with default shop data (categories, ads, notices, products, home sections).
 * Usage: node scripts/seed.js [--drop]
 * --drop  Drop existing shop collections before inserting (default: upsert by key/id so re-run is safe).
 */
require('dotenv').config();
const mongoose = require('mongoose');
const config = require('../src/config');
const logger = require('../src/lib/logger');
const CategoryTree = require('../src/models/CategoryTree');
const Product = require('../src/models/Product');
const AdSlide = require('../src/models/AdSlide');
const Notice = require('../src/models/Notice');
const HomeSection = require('../src/models/HomeSection');
const seedData = require('../src/seed/data');

const drop = process.argv.includes('--drop');
logger.info('Seed script started, drop=', drop, 'mongoUri length=', (config.mongoUri || '').length);

function run() {
  return mongoose.connect(config.mongoUri, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
    .then(function () {
      logger.info('Seed: connected to MongoDB');
      if (drop) {
        return Promise.all([
          CategoryTree.deleteMany({}),
          Product.deleteMany({}),
          AdSlide.deleteMany({}),
          Notice.deleteMany({}),
          HomeSection.deleteMany({}),
        ]).then(function () {
          logger.info('Seed: dropped existing shop collections');
        });
      }
    })
    .then(function () {
      return CategoryTree.findOneAndUpdate(
        { key: 'default' },
        { key: 'default', tree: seedData.categories },
        { upsert: true, new: true }
      );
    })
    .then(function () {
      logger.info('Seed: upserted category tree, nodes=', seedData.categories.length);
      return Product.deleteMany({}).then(function () {
        return Product.insertMany(seedData.products);
      });
    })
    .then(function () {
      logger.info('Seed: inserted products, count=', seedData.products.length);
      return AdSlide.deleteMany({}).then(function () {
        return AdSlide.insertMany(seedData.adsSlides);
      });
    })
    .then(function () {
      logger.info('Seed: inserted ad slides, count=', seedData.adsSlides.length);
      return Notice.deleteMany({}).then(function () {
        return Notice.insertMany(seedData.importantNotices);
      });
    })
    .then(function () {
      logger.info('Seed: inserted notices, count=', seedData.importantNotices.length);
      return HomeSection.findOneAndUpdate(
        { key: 'default' },
        {
          key: 'default',
          recommendedProductIds: seedData.recommendedProductIds,
          mostVisitedProductIds: seedData.mostVisitedProductIds,
          trendingProductIds: seedData.trendingProductIds,
        },
        { upsert: true, new: true }
      );
    })
    .then(function () {
      logger.info('Seed: upserted home sections');
      logger.info('Seed completed successfully');
    })
    .catch(function (err) {
      logger.error('Seed failed:', err.message, err.stack);
      process.exit(1);
    })
    .finally(function () {
      return mongoose.disconnect().then(function () {
        logger.info('Seed: MongoDB disconnected');
      });
    });
}

run();
