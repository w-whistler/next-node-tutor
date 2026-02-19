const mongoose = require('mongoose');

const homeSectionSchema = new mongoose.Schema({
  key: { type: String, required: true, default: 'default', unique: true },
  recommendedProductIds: { type: [String], default: [] },
  mostVisitedProductIds: { type: [String], default: [] },
  trendingProductIds: { type: [String], default: [] },
}, { collection: 'homesections' });

module.exports = mongoose.model('HomeSection', homeSectionSchema);
