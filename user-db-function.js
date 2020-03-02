const mysql = require('mysql2/promise')
const config = require('./db-config')
const passwordHash = require('password-hash');
//const connection = mysql.createConnection(config.mysql)
const connection = mysql.createConnection(config.mysqlPi)
//const path = '/Users/leoclarke/Documents/GitHub/Final-Year-Project/api/drive/media/'
//const path = 'E:/Documents/GitHub/Final-Year-Project/api/drive/media/'
const path = '/media/pi/'

module.exports.loginRequest = async (username, password) => {
    const empty = []
    let con = await connection
    let [user] = await con.query("SELECT * FROM user WHERE user_name = ?", [username])
    console.log(typeof user[0].user_password)
    if(passwordHash.verify(password.toString(), user[0].user_password) === true){
        return user
    }else{
        return empty
    }
};
