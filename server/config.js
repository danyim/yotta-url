const mongo = require('./mongo-config');

const config = {};

// Check if we should configure via environment variables
if (process.env.MONGO_HOSTNAME &&
    process.env.MONGO_USER &&
    process.env.MONGO_PASSWORD) {
  config.mongo = {
    hostname: process.env.MONGO_HOSTNAME,
    user: process.env.MONGO_USER,
    password: process.env.MONGO_PASSWORD
  };
}
else {
  config.mongo = {
    hostname: mongo.hostname,
    user: mongo.user,
    password: mongo.password
  };
}

module.exports = config;
