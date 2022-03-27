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
// Add headers before the routes are defined
app.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  // res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});
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
