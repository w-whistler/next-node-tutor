const mongoose = require('mongoose');
const config = require('../config');
const logger = require('../lib/logger');

function connect() {
  logger.info('MongoDB connect() called, uri length=', (config.mongoUri || '').length);
  return mongoose.connect(config.mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  });
}

mongoose.connection.on('connected', function () {
  logger.info('MongoDB connected to', config.mongoUri);
});

mongoose.connection.on('error', function (err) {
  logger.error('MongoDB connection error:', err.message, err.stack);
});

mongoose.connection.on('disconnected', function () {
  logger.info('MongoDB disconnected');
});

module.exports = { connect };
module.exports.connection = mongoose.connection;
