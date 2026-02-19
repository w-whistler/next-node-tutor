const app = require('./app');
const config = require('./config');
const { connect } = require('./db');

connect()
  .then(function () {
    app.listen(config.port, function () {
      console.log('Server listening on port', config.port);
    });
  })
  .catch(function (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  });
