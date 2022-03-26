// Requiring packages
const path = require('path');
const app = require('./src/app');
const http = require('http');
require('dotenv').config({ path: path.join(__dirname, './.env') });

// process.env.TZ = 'America/Fortaleza';

const normalizePort = (val) => {
  var port = parseInt(val, 10);
  if (isNaN(port)) {
    return val;
  } // named pipe
  if (port >= 0) {
    return port;
  }
  return false;
};

const onError = (error) => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
};

const port = normalizePort(process.env.PORT || '5000');
app.set('port', port);

let server = http.createServer(app);
console.log('Running Node with HTTP on port ' + port);

server.on('error', onError);
server.listen(port);

// increase the timeout to 30 minutes
server.setTimeout(1000 * 60 * 30);
