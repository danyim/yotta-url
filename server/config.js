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
  // Should have been loaded in server.js via the .env file
  throw new Error('MongoDB variables invalid');
}

module.exports = config;
