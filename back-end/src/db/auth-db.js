const pg = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const MINUTES_IN_MS = 60 * 1000;

// Pool configuration and creation
const dbConfig = {
  user: process.env.AUTH_DB_USER,
  password: process.env.AUTH_DB_KEY,
  host: process.env.AUTH_DB_HOST,
  database: process.env.AUTH_DB_DATABASE,
  port: 5432,
  statement_timeout: 30 * MINUTES_IN_MS,
  max: 5,
};
const authPool = new pg.Pool(dbConfig);

authPool.on('error', (err, client) => {
  console.error('[Auth DB] Idle client error on pool', err.message, err.stack);
});

authPool.on('connect', (client) => {
   console.log(`[Auth DB] New client connected to the pool.`);
});

authPool.on('acquire', () => {
  // console.log(`[Auth DB] Client checked out of the pool.`);
});

authPool.on('remove', () => {
  // console.log(`[Auth DB] Client has been removed from the pool.`);
});

authPool.endAuthPool = async function () {
  try {
    await authPool.end();
    console.log('Ended authDB pool of connections');
  } catch (poolError) {
    console.log('Error while ending authDB pool of connections');
    console.error(poolError);
  }
};

module.exports = authPool;
