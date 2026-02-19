const mongoose = require('mongoose');

const categoryNodeSchema = new mongoose.Schema({
  id: { type: String, required: true },
  label: { type: String, required: true },
  children: { type: [mongoose.Schema.Types.Mixed], default: [] },
}, { _id: false });

const categoryTreeSchema = new mongoose.Schema({
  key: { type: String, required: true, default: 'default', unique: true },
  tree: { type: [categoryNodeSchema], default: [] },
}, { collection: 'categorytrees' });

module.exports = mongoose.model('CategoryTree', categoryTreeSchema);
