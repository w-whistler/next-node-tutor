/**
 * Migration script: ensures MongoDB indexes exist for shop collections.
 * Run after schema changes. Safe to run multiple times.
 * Usage: node scripts/migrate.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const config = require('../src/config');
const Product = require('../src/models/Product');
const CategoryTree = require('../src/models/CategoryTree');
const AdSlide = require('../src/models/AdSlide');
const Notice = require('../src/models/Notice');
const HomeSection = require('../src/models/HomeSection');

function run() {
  return mongoose.connect(config.mongoUri, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
    .then(function () {
      console.log('Connected to', config.mongoUri);
      return Product.ensureIndexes();
    })
    .then(function () {
      console.log('Product indexes ensured.');
      return CategoryTree.ensureIndexes();
    })
    .then(function () {
      console.log('CategoryTree indexes ensured.');
      return AdSlide.ensureIndexes();
    })
    .then(function () {
      console.log('AdSlide indexes ensured.');
      return Notice.ensureIndexes();
    })
    .then(function () {
      console.log('Notice indexes ensured.');
      return HomeSection.ensureIndexes();
    })
    .then(function () {
      console.log('HomeSection indexes ensured.');
      console.log('Migration completed.');
    })
    .catch(function (err) {
      console.error('Migration failed:', err);
      process.exit(1);
    })
    .finally(function () {
      return mongoose.disconnect();
    });
}

run();
