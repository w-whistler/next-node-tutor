const app = require('./app');
const config = require('./config');
const { connect } = require('./db');
const logger = require('./lib/logger');

logger.info('Starting server, port=', config.port, 'mongoUri=', config.mongoUri ? '(set)' : '(not set)');

connect()
  .then(function () {
    logger.info('MongoDB connect() resolved, binding HTTP server to 0.0.0.0:' + config.port);
    app.listen(config.port, '0.0.0.0', function () {
      logger.info('Server listening on http://0.0.0.0:' + config.port + ' (use http://localhost:' + config.port + ' from Store)');
    });
  })
  .catch(function (err) {
    logger.error('Failed to start server:', err.message, err.stack);
    process.exit(1);
  });
