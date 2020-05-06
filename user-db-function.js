const mysql = require('mysql2/promise')
const config = require('./db-config')
const passwordHash = require('password-hash');
const connection = mysql.createConnection(config.mysqlPi)

// checks login details
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

//gets drive list for user file manager
module.exports.getUserDriveList = async (userID) => {
    let con = await connection
    console.log("drive list test")
     let [list] = await con.query("SELECT permissions.addedDrive_name, addedDrive.addedDrive_path, permission_write from permissions INNER JOIN addedDrive ON permissions.addedDrive_name = addedDrive.addedDrive_name where user_id = ? AND permission_read = 1",[userID])
    return list
}