const fs = require('fs');
const mysql = require('mysql2/promise')
const config = require('./db-config')
//const connection = mysql.createConnection(config.mysql)
const connection = mysql.createConnection(config.mysqlPi)
//const path = '/Users/leoclarke/Documents/GitHub/Final-Year-Project/api/drive/media/'
//const path = 'E:/Documents/GitHub/Final-Year-Project/api/drive/media/'
const path = '/media/pi/'




/**
 * Drive Functions
 */

function getMediaVolumes(){
    try {
        fs.readdir(path, (err, unaddedDriveList) => {
           refreshList(unaddedDriveList)
        });
    } catch (e) {
        console.error(e);
    }
}

async function refreshList(list){
    for(let i = 0; i < list.length; i++){
        let con = await connection
        let [dbList] = await con.query("SELECT unaddedDrive_name FROM unaddedDrive WHERE unaddedDrive_name = ?",[list[i].toString()])
        if (!dbList.length) {
            let drivePath = path + list[i]
            let con = await connection;
            await con.query("INSERT INTO unaddedDrive(unaddedDrive_name, unaddedDrive_path, unaddedDrive_added) VALUES (?,?,?)", [list[i], drivePath, false]);
        }
    }
}

module.exports.getUnaddedDriveList = async () => {
    getMediaVolumes()
    let con = await connection
    let [list] = await con.query("SELECT * FROM unaddedDrive WHERE unaddedDrive_added = ? ",[false])
    return JSON.stringify(list)
};

module.exports.addNewDrive = async (name, path, raid, raidTarget) => {
    try{
        let con = await connection
        let newPath = '/home/pi/Final-Year-Project/static/nas-mount/' + name
        console.log(newPath)
        await con.query("INSERT INTO addedDrive(addedDrive_name, addedDrive_path,addedDrive_raid, addedDrive_raidTarget ) VALUES (?,?,?,?)", [name, newPath, raid, raidTarget]);
        await con.query("UPDATE unaddedDrive SET unaddedDrive_added = ? WHERE unaddedDrive_path = ? ",[true, path])
        let [id] = await con.query("SELECT addedDrive_name FROM addedDrive WHERE addedDrive_name = ? ",[name])
        return id
    }catch(e){
        console.log(e)
    }
}

module.exports.getDriveList = async () => {
    let con = await connection
    let [list] = await con.query("SELECT * FROM addedDrive WHERE addedDrive_raid = ? ",[false])
    return list
}

module.exports.deleteDrive = async (name) => {
    let con = await connection
    await con.query("DELETE FROM addedDrive WHERE addedDrive_name = ? ",[name])
    return 200
}



 /**
 * User functions
 */



module.exports.addNewUser = async (userName, password) => {
    try{
        console.log("adding user")
        let con = await connection
        await con.query("INSERT INTO user(user_name, user_password) VALUES (?,?)", [userName, password]);
        let [id] = await con.query("SELECT user_id FROM user WHERE user_name = ? ",[userName])
        return id
    }catch(e){
        console.log(e)
    }
};

module.exports.updateUsername = async (currentUsername, newUsername) => {
    try{
        console.log("Did i get here")
        console.log(currentUsername)
        console.log(newUsername)
        let con = await connection
        await con.query("UPDATE user SET user_name = ? WHERE user_name = ? ",[newUsername, currentUsername])
        return 200
    }catch(e){
        console.log(e)
    }
};

module.exports.updatePassword = async (username, newPassword) => {
    try{
        console.log("adding user")
        let con = await connection
        await con.query("UPDATE user SET user_password = ? WHERE user_name = ? ",[newPassword, username])
        return 200
    }catch(e){
        console.log(e)
    }
};

module.exports.getUserList = async () => {
    //getMediaVolumes()
    let con = await connection
    let [list] = await con.query("SELECT * FROM user")
    return JSON.stringify(list)
};


module.exports.deleteUser = async (id) => {
    console.log(id)
    let con = await connection
    await con.query("DELETE FROM user WHERE user_id = ? ",[id])
    return 200
};




/** 
 * Permission functions
 * adding
 * getting
 * updating
 */


 //add user r/w permissions when adding a new user
module.exports.addUserPermissions = async (userID, permissionList) => {
    try{
        for(let i = 0; i < permissionList.length; i++){
            const driveName = permissionList[i].driveName
            const read = permissionList[i].readValue
            const write = permissionList[i].writeValue
            let con = await connection
            con.query("INSERT INTO permissions(addedDrive_name, user_id, permission_read, permission_write ) VALUES (?,?,?,?)", [driveName, userID, read, write]);
        }
    }catch(e){
        console.log(e)
    }
};

//add user r/w permissions when adding a new drive
module.exports.addDrivePermissions = async (driveName, permissionList) => {
    try{
        for(let i = 0; i < permissionList.length; i++){
            const userID = permissionList[i].user
            const read = permissionList[i].readValue
            const write = permissionList[i].writeValue
            let con = await connection
            con.query("INSERT INTO permissions(addedDrive_name, user_id, permission_read, permission_write ) VALUES (?,?,?,?)", [driveName, userID, read, write]);
        }
    }catch(e){
        console.log(e)
    }
};



module.exports.getPermissionList = async (name) => {
    let con = await connection
    let [list] = await con.query("SELECT permissions.user_id, permissions.addedDrive_name, permissions.permission_read, permissions.permission_write, user.user_name FROM permissions INNER JOIN user ON permissions.user_id = user.user_id  where addedDrive_name = ? ",[name])
    return list
};

module.exports.getPermissionListByUsername = async (name) => {
    let con = await connection
    let [list] = await con.query("SELECT permissions.user_id, permissions.addedDrive_name, permissions.permission_read, permissions.permission_write, user.user_name FROM permissions INNER JOIN user ON permissions.user_id = user.user_id  where permissions.user_id = ?",[name])
    return JSON.stringify(list)
};

module.exports.updateUserPermissions = async (permissionList) => {
    try{
        console.log("att permissions")
        for(let i = 0; i < permissionList.length; i++){
            const userID = permissionList[i].user
            const driveName = permissionList[i].driveName
            const read = permissionList[i].readValue
            const write = permissionList[i].writeValue
            let con = await connection
            con.query("UPDATE permissions SET permission_read = ?, permission_write = ? WHERE user_id = ? AND addedDrive_name = ?", [read, write, userID, driveName]);
        }
    }catch(e){
        console.log(e)
    }
};