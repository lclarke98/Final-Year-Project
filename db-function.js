const mysql = require('mysql2/promise');
const config = require('./db-config');
const sqlPromise = mysql.createConnection(config.mysql);
