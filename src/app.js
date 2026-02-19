const express = require('express');
const config = require('./config');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', function (req, res) {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api', require('./routes'));

app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

module.exports = app;
