const mongoose = require('mongoose');

const adSlideSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  image: { type: String, default: '' },
}, { collection: 'adslides' });

module.exports = mongoose.model('AdSlide', adSlideSchema);
