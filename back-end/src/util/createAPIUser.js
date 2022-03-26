// Require modules
const bcrypt = require('bcrypt');
const format = require('pg-format');
const readline = require('readline');

// Require scripts
const authPool = require('../db/auth-db');

// Variable declarations
const QUERY_INSERT_USER = `INSERT INTO api_auth_users (username,hashed_password) VALUES(%L,%L)`;

const SALT_ROUNDS = 10;

/**
 * Inserts the credentials declared above after hashing the password
 * @param {string} user
 * @param {string} password
 */
async function insertCredentialsInAuthDB(user, password) {
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  console.log(`\nCredentials Generated:
    user:${user}
    password:${password}
    hashed password:${hashedPassword}\n`);
  try {
    let formattedQuery = format(QUERY_INSERT_USER, user, hashedPassword);
    await authPool.query(formattedQuery);
    console.log(`Successfully inserted credentials in auth DB.`);
  } catch (insertError) {
    console.log(`Failed to insert new credentials in auth DB.`);
    console.error(insertError.message);
  } finally {
    await authPool.endAuthPool();
  }
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question('Type username and then hit enter: ', (user) => {
  rl.question('Type password and then hit enter: ', (password) => {
    insertCredentialsInAuthDB(user, password);
    rl.close();
  });
});
