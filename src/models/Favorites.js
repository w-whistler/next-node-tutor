const mongoose = require('mongoose');

const favoritesSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  productIds: { type: [String], default: [] },
}, { collection: 'favorites', timestamps: true });

favoritesSchema.index({ userId: 1 });

module.exports = mongoose.model('Favorites', favoritesSchema);
