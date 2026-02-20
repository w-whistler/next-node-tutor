/**
 * Set a user as admin by email.
 * Usage: node scripts/make-admin.js <email>
 * The user must already exist (e.g. registered via the store frontend).
 */
require('dotenv').config();
const mongoose = require('mongoose');
const config = require('../src/config');
const User = require('../src/models/User');

const email = process.argv[2];
if (!email) {
  console.error('Usage: node scripts/make-admin.js <email>');
  process.exit(1);
}

mongoose.connect(config.mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(function () {
    return User.findOneAndUpdate(
      { email: email.trim().toLowerCase() },
      { $set: { role: 'admin' } },
      { new: true }
    );
  })
  .then(function (user) {
    if (!user) {
      console.error('User not found:', email);
      process.exit(1);
    }
    console.log('Admin set:', user.email);
  })
  .catch(function (err) {
    console.error(err.message);
    process.exit(1);
  })
  .finally(function () {
    return mongoose.disconnect();
  });
