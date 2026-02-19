const mongoose = require('mongoose');
const config = require('../config');

function connect() {
  return mongoose.connect(config.mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

mongoose.connection.on('connected', function () {
  console.log('MongoDB connected to', config.mongoUri);
});

mongoose.connection.on('error', function (err) {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', function () {
  console.log('MongoDB disconnected');
});

module.exports = { connect };
module.exports.connection = mongoose.connection;
