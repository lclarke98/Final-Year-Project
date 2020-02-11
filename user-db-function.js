const mysql = require('mysql2/promise')
const config = require('./db-config')
//const connection = mysql.createConnection(config.mysql)
const connection = mysql.createConnection(config.mysqlPi)
//const path = '/Users/leoclarke/Documents/GitHub/Final-Year-Project/api/drive/media/'
//const path = 'E:/Documents/GitHub/Final-Year-Project/api/drive/media/'
const path = '/media/pi/'

module.exports.loginRequest = async (username, password) => {
    let con = await connection
    let [user] = await con.query("SELECT * FROM user WHERE user_name = ? AND user_password = ?", [username, password])
    return user
};
