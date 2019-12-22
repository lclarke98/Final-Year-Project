const mysql = require('mysql2/promise')
const config = require('./db-config')
const sqlPromise = mysql.createConnection(config.mysql)

module.exports.getDriveList = async (req, res) => {
    try {
        //some sql here
    }
    catch (e) {
      console.log("err")
    }
};

module.exports.addNewDrive = async (req, res) => {
    try {
       console.log("Add new Drive")
    }
    catch (e) {
      console.log("err")
    }
};