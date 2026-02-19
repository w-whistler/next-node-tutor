/**
 * Migration script: ensures MongoDB indexes exist for shop collections.
 * Run after schema changes. Safe to run multiple times.
 * Usage: node scripts/migrate.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const config = require('../src/config');
const logger = require('../src/lib/logger');
const Product = require('../src/models/Product');
const CategoryTree = require('../src/models/CategoryTree');
const AdSlide = require('../src/models/AdSlide');
const Notice = require('../src/models/Notice');
const HomeSection = require('../src/models/HomeSection');

logger.info('Migration script started');

function run() {
  return mongoose.connect(config.mongoUri, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
    .then(function () {
      logger.info('Migration: connected to MongoDB');
      return Product.ensureIndexes();
    })
    .then(function () {
      logger.info('Migration: Product indexes ensured');
      return CategoryTree.ensureIndexes();
    })
    .then(function () {
      logger.info('Migration: CategoryTree indexes ensured');
      return AdSlide.ensureIndexes();
    })
    .then(function () {
      logger.info('Migration: AdSlide indexes ensured');
      return Notice.ensureIndexes();
    })
    .then(function () {
      logger.info('Migration: Notice indexes ensured');
      return HomeSection.ensureIndexes();
    })
    .then(function () {
      logger.info('Migration: HomeSection indexes ensured');
      logger.info('Migration completed successfully');
    })
    .catch(function (err) {
      logger.error('Migration failed:', err.message, err.stack);
      process.exit(1);
    })
    .finally(function () {
      return mongoose.disconnect().then(function () {
        logger.info('Migration: MongoDB disconnected');
      });
    });
}

run();
