const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  title: { type: String, default: '' },
  price: { type: Number, required: true },
  sku: { type: String, default: '' },
  quantity: { type: Number, default: 1 },
}, { _id: false });

const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  items: { type: [cartItemSchema], default: [] },
}, { collection: 'carts', timestamps: true });

cartSchema.index({ userId: 1 });

module.exports = mongoose.model('Cart', cartSchema);
