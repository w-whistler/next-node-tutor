/**
 * Simple logger with timestamp and optional prefix. No dependencies.
 */
const PREFIX = '[Store-Backend]';

function timestamp() {
  return new Date().toISOString();
}

function log(level, ...args) {
  const msg = [timestamp(), PREFIX, level].concat(args);
  if (level === 'ERROR') {
    console.error.apply(console, msg);
  } else {
    console.log.apply(console, msg);
  }
}

module.exports = {
  info: function () { log('INFO', ...arguments); },
  warn: function () { log('WARN', ...arguments); },
  error: function () { log('ERROR', ...arguments); },
};
