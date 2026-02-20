const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const router = express.Router();
const { requireAdmin } = require('../middleware/auth');
const CategoryTree = require('../models/CategoryTree');
const Product = require('../models/Product');
const AdSlide = require('../models/AdSlide');
const Notice = require('../models/Notice');
const User = require('../models/User');
const logger = require('../lib/logger');

const uploadsDir = path.join(__dirname, '..', '..', 'uploads');
try {
  fs.mkdirSync(uploadsDir, { recursive: true });
} catch (e) {
  logger.warn('uploads dir', e.message);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const ext = (file.mimetype === 'image/png') ? '.png' : (file.mimetype === 'image/gif') ? '.gif' : '.jpg';
    cb(null, Date.now() + '-' + (file.originalname || 'image').replace(/[^a-zA-Z0-9.-]/g, '_').replace(/\.[^.]+$/, '') + ext);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: function (req, file, cb) {
    const allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowed.indexOf(file.mimetype) !== -1) {
      cb(null, true);
    } else {
      cb(new Error('Only images (jpeg, png, gif, webp) are allowed'));
    }
  },
});

router.use(requireAdmin);

// --- Categories (single tree key=default) ---
router.get('/categories', function (req, res, next) {
  CategoryTree.findOne({ key: 'default' })
    .lean()
    .then(function (doc) {
      const tree = (doc && doc.tree) ? doc.tree : [];
      res.json(tree);
    })
    .catch(next);
});

router.put('/categories', function (req, res, next) {
  const tree = Array.isArray(req.body.tree) ? req.body.tree : req.body;
  if (!Array.isArray(tree)) {
    return res.status(400).json({ error: 'tree must be an array' });
  }
  CategoryTree.findOneAndUpdate(
    { key: 'default' },
    { $set: { tree } },
    { upsert: true, new: true }
  )
    .lean()
    .then(function (doc) {
      res.json(doc.tree || []);
    })
    .catch(next);
});

// --- Ads ---
router.get('/ads', function (req, res, next) {
  AdSlide.find({}).sort({ id: 1 }).lean()
    .then(function (list) {
      res.json(list);
    })
    .catch(next);
});

router.post('/ads', function (req, res, next) {
  const { id, title, subtitle, image } = req.body;
  if (id === undefined || id === null) {
    return res.status(400).json({ error: 'id is required' });
  }
  AdSlide.create({ id: Number(id), title: title || '', subtitle: subtitle || '', image: image || '' })
    .then(function (doc) {
      res.status(201).json(doc.toObject());
    })
    .catch(next);
});

router.put('/ads/:id', function (req, res, next) {
  const id = Number(req.params.id);
  const { title, subtitle, image } = req.body;
  AdSlide.findOneAndUpdate(
    { id },
    { $set: { title: title || '', subtitle: subtitle || '', image: image || '' } },
    { new: true }
  )
    .lean()
    .then(function (doc) {
      if (!doc) return res.status(404).json({ error: 'Ad not found' });
      res.json(doc);
    })
    .catch(next);
});

router.delete('/ads/:id', function (req, res, next) {
  const id = Number(req.params.id);
  AdSlide.findOneAndDelete({ id })
    .then(function (doc) {
      if (!doc) return res.status(404).json({ error: 'Ad not found' });
      res.status(204).send();
    })
    .catch(next);
});

// --- Upload image (returns URL path for use in products/ads) ---
router.post('/upload', function (req, res, next) {
  upload.single('file')(req, res, function (err) {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') return res.status(400).json({ error: 'File too large (max 5MB)' });
      return res.status(400).json({ error: err.message || 'Upload failed' });
    }
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    const url = '/uploads/' + req.file.filename;
    res.status(201).json({ url });
  });
});

// --- Products ---
router.get('/products', function (req, res, next) {
  Product.find({}).lean()
    .then(function (list) {
      res.json(list);
    })
    .catch(next);
});

router.post('/products', function (req, res, next) {
  const { id, title, sku, price, originalPrice, discountRate, images, categoryId } = req.body;
  if (!id || !title || price === undefined || !categoryId) {
    return res.status(400).json({ error: 'id, title, price, categoryId are required' });
  }
  const payload = {
    id: String(id).trim(),
    title: String(title).trim(),
    sku: (sku != null) ? String(sku).trim() : '',
    price: Number(price),
    originalPrice: originalPrice != null ? Number(originalPrice) : undefined,
    discountRate: discountRate != null ? Number(discountRate) : 0,
    images: Array.isArray(images) ? images : [],
    categoryId: String(categoryId).trim(),
  };
  Product.create(payload)
    .then(function (doc) {
      res.status(201).json(doc.toObject());
    })
    .catch(next);
});

router.put('/products/:id', function (req, res, next) {
  const id = req.params.id;
  const { title, sku, price, originalPrice, discountRate, images, categoryId } = req.body;
  const update = {};
  if (title !== undefined) update.title = String(title).trim();
  if (sku !== undefined) update.sku = String(sku).trim();
  if (price !== undefined) update.price = Number(price);
  if (originalPrice !== undefined) update.originalPrice = Number(originalPrice);
  if (discountRate !== undefined) update.discountRate = Number(discountRate);
  if (images !== undefined) update.images = Array.isArray(images) ? images : [];
  if (categoryId !== undefined) update.categoryId = String(categoryId).trim();

  Product.findOneAndUpdate({ id }, { $set: update }, { new: true })
    .lean()
    .then(function (doc) {
      if (!doc) return res.status(404).json({ error: 'Product not found' });
      res.json(doc);
    })
    .catch(next);
});

router.delete('/products/:id', function (req, res, next) {
  Product.findOneAndDelete({ id: req.params.id })
    .then(function (doc) {
      if (!doc) return res.status(404).json({ error: 'Product not found' });
      res.status(204).send();
    })
    .catch(next);
});

// --- Users ---
router.get('/users', function (req, res, next) {
  User.find({})
    .select('-password')
    .lean()
    .then(function (list) {
      res.json(list.map(function (u) {
        return { id: u._id.toString(), email: u.email, name: u.name || '', role: u.role || 'user', createdAt: u.createdAt };
      }));
    })
    .catch(next);
});

router.patch('/users/:id', function (req, res, next) {
  const { role } = req.body;
  if (role !== undefined && role !== 'user' && role !== 'admin') {
    return res.status(400).json({ error: 'role must be user or admin' });
  }
  const update = {};
  if (role !== undefined) update.role = role;
  if (Object.keys(update).length === 0) {
    return res.status(400).json({ error: 'No valid fields to update' });
  }
  User.findByIdAndUpdate(req.params.id, { $set: update }, { new: true })
    .select('-password')
    .lean()
    .then(function (doc) {
      if (!doc) return res.status(404).json({ error: 'User not found' });
      res.json({ id: doc._id.toString(), email: doc.email, name: doc.name, role: doc.role || 'user' });
    })
    .catch(next);
});

// --- Notices ---
router.get('/notices', function (req, res, next) {
  Notice.find({}).sort({ id: 1 }).lean()
    .then(function (list) {
      res.json(list);
    })
    .catch(next);
});

router.post('/notices', function (req, res, next) {
  const { id, text } = req.body;
  if (id === undefined || id === null || !text) {
    return res.status(400).json({ error: 'id and text are required' });
  }
  Notice.create({ id: Number(id), text: String(text).trim() })
    .then(function (doc) {
      res.status(201).json(doc.toObject());
    })
    .catch(next);
});

router.put('/notices/:id', function (req, res, next) {
  const id = Number(req.params.id);
  const { text } = req.body;
  Notice.findOneAndUpdate({ id }, { $set: { text: String(text || '').trim() } }, { new: true })
    .lean()
    .then(function (doc) {
      if (!doc) return res.status(404).json({ error: 'Notice not found' });
      res.json(doc);
    })
    .catch(next);
});

router.delete('/notices/:id', function (req, res, next) {
  const id = Number(req.params.id);
  Notice.findOneAndDelete({ id })
    .then(function (doc) {
      if (!doc) return res.status(404).json({ error: 'Notice not found' });
      res.status(204).send();
    })
    .catch(next);
});

module.exports = router;
