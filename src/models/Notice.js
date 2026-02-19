const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  text: { type: String, required: true },
}, { collection: 'notices' });

module.exports = mongoose.model('Notice', noticeSchema);
