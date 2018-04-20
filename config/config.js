// Set environment variable
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// Export config file depending on environment
module.exports = require('./env/' + process.env.NODE_ENV + '.js');