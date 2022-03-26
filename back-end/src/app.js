// Requiring packages
const express = require('express');
const path = require('path');

// Requiring internal scripts
const authPool = require('./db/auth-db');
const APIUtils = require('./util/API-util');

require('dotenv').config({ path: path.join(__dirname, '../.env') });
require('log-timestamp')(function () {
  return `[${APIUtils.dateToDBString(new Date())}]`;
});

const app = express();

// Initialize before every request
app.use(express.json());

// Importing routes
const routes = require('./routes/api-routes');

// Using routes
app.use(`/v1/`, routes);

// No appending route leads to 404 response
app.use((req, res) => {
  res.sendStatus(404);
});


// If the process is manually interrupted, ends all pool connections
process.on('SIGINT', async () => {
  console.log('App termination.');
  await authPool.endAuthPool();
  process.exit(0);
});

module.exports = app;
