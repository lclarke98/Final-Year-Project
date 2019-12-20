const mysql = require('mysql2/promise');
const config = require('./db-config');
const sqlPromise = mysql.createConnection(config.mysql);

module.exports.getDrive= async (req, res) => {
    try {
      fs.readdir(path, (err, files) => {
        res.send(files)
      });
    }
    catch (e) {
      console.log("err")
    }
  };