/**
 * Seed script: populates MongoDB with default shop data (categories, ads, notices, products, home sections).
 * Usage: node scripts/seed.js [--drop]
 * --drop  Drop existing shop collections before inserting (default: upsert by key/id so re-run is safe).
 */
require('dotenv').config();
const mongoose = require('mongoose');
const config = require('../src/config');
const CategoryTree = require('../src/models/CategoryTree');
const Product = require('../src/models/Product');
const AdSlide = require('../src/models/AdSlide');
const Notice = require('../src/models/Notice');
const HomeSection = require('../src/models/HomeSection');
const seedData = require('../src/seed/data');

const drop = process.argv.includes('--drop');

function run() {
  return mongoose.connect(config.mongoUri, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
    .then(function () {
      console.log('Connected to', config.mongoUri);
      if (drop) {
        return Promise.all([
          CategoryTree.deleteMany({}),
          Product.deleteMany({}),
          AdSlide.deleteMany({}),
          Notice.deleteMany({}),
          HomeSection.deleteMany({}),
        ]).then(function () {
          console.log('Dropped existing shop collections.');
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
      console.log('Upserted category tree.');
      return Product.deleteMany({}).then(function () {
        return Product.insertMany(seedData.products);
      });
    })
    .then(function () {
      console.log('Inserted', seedData.products.length, 'products.');
      return AdSlide.deleteMany({}).then(function () {
        return AdSlide.insertMany(seedData.adsSlides);
      });
    })
    .then(function () {
      console.log('Inserted', seedData.adsSlides.length, 'ad slides.');
      return Notice.deleteMany({}).then(function () {
        return Notice.insertMany(seedData.importantNotices);
      });
    })
    .then(function () {
      console.log('Inserted', seedData.importantNotices.length, 'notices.');
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
      console.log('Upserted home sections.');
      console.log('Seed completed.');
    })
    .catch(function (err) {
      console.error('Seed failed:', err);
      process.exit(1);
    })
    .finally(function () {
      return mongoose.disconnect();
    });
}

run();
