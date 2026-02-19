const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  sku: { type: String, default: '' },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  discountRate: { type: Number, default: 0 },
  images: { type: [String], default: [] },
  categoryId: { type: String, required: true },
}, { collection: 'products' });

productSchema.index({ categoryId: 1 });
productSchema.index({ title: 'text', sku: 'text' });

module.exports = mongoose.model('Product', productSchema);
