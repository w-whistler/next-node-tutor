const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  password: { type: String, required: true },
  name: { type: String, default: '' },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
}, { collection: 'users', timestamps: true });

userSchema.index({ email: 1 });

userSchema.pre('save', function (next) {
  const user = this;
  if (!user.isModified('password')) return next();
  bcrypt.hash(user.password, 10, function (err, hash) {
    if (err) return next(err);
    user.password = hash;
    next();
  });
});

userSchema.methods.comparePassword = function (candidate, cb) {
  bcrypt.compare(candidate, this.password, cb);
};

module.exports = mongoose.model('User', userSchema);
