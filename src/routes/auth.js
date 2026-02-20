const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { signToken } = require('../middleware/auth');
const logger = require('../lib/logger');

router.post('/register', function (req, res, next) {
  const email = req.body.email && String(req.body.email).trim().toLowerCase();
  const password = req.body.password;
  const name = (req.body.name && String(req.body.name).trim()) || '';

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  User.findOne({ email: email })
    .then(function (existing) {
      if (existing) {
        return res.status(409).json({ error: 'Email already registered' });
      }
      const user = new User({ email, password, name });
      return user.save();
    })
    .then(function (user) {
      const token = signToken({ userId: user._id.toString() });
      logger.info('POST /api/auth/register -> 201 email=', email);
      res.status(201).json({
        token,
        user: { id: user._id.toString(), email: user.email, name: user.name, role: user.role || 'user' },
      });
    })
    .catch(function (err) {
      if (err.name === 'ValidationError') {
        return res.status(400).json({ error: err.message || 'Validation failed' });
      }
      logger.error('POST /api/auth/register error', err.message);
      next(err);
    });
});

router.post('/login', function (req, res, next) {
  const email = req.body.email && String(req.body.email).trim().toLowerCase();
  const password = req.body.password;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  User.findOne({ email: email })
    .then(function (user) {
      if (!user) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }
      return new Promise(function (resolve, reject) {
        user.comparePassword(password, function (err, ok) {
          if (err) return reject(err);
          if (!ok) return resolve(null);
          resolve(user);
        });
      });
    })
    .then(function (user) {
      if (!user) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }
      const token = signToken({ userId: user._id.toString() });
      logger.info('POST /api/auth/login -> 200 email=', email);
      res.json({
        token,
        user: { id: user._id.toString(), email: user.email, name: user.name, role: user.role || 'user' },
      });
    })
    .catch(function (err) {
      logger.error('POST /api/auth/login error', err.message);
      next(err);
    });
});

module.exports = router;
