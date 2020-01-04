const fs = require('fs');
const mysql = require('mysql2/promise')
const config = require('./db-config')
const connection = mysql.createConnection(config.mysql)
//const connection = mysql.createConnection(config.mysqlPi)
const path = '/Users/leoclarke/Documents/GitHub/Final-Year-Project/api/drive/media/'
//const path = '/media/pi/'

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
        await con.query("INSERT INTO addedDrive(addedDrive_name, addedDrive_path,addedDrive_raid, addedDrive_raidTarget ) VALUES (?,?,?,?)", [name, path, raid, raidTarget]);
        await con.query("UPDATE unaddedDrive SET unaddedDrive_added = ? WHERE unaddedDrive_path = ? ",[true, path])
        let [id] = await con.query("SELECT addedDrive_name FROM addedDrive WHERE addedDrive_name = ? ",[name])
        return id
    }catch(e){
        console.log(e)
    }
};

module.exports.addDrivePermissions = async (driveName, permissionList) => {
    try{
        for(let i = 0; i < permissionList.length; i++){
            const user = permissionList[i].user
            const read = permissionList[i].readValue
            const write = permissionList[i].writeValue
            let con = await connection
            con.query("INSERT INTO permissions(addedDrive_name, user_name, permission_read, permission_write ) VALUES (?,?,?,?)", [driveName, user, read, write]);
        }
    }catch(e){
        console.log(e)
    }
};
module.exports.addNewUser = async (userName, password) => {
    try{
        let con = await connection
        await con.query("INSERT INTO user(user_name, user_password) VALUES (?,?)", [userName, password]);
        return 200
    }catch(e){
        console.log(e)
    }
};


module.exports.getUserList = async () => {
    getMediaVolumes()
    let con = await connection
    let [list] = await con.query("SELECT * FROM user")
    return JSON.stringify(list)
};

module.exports.getDriveList = async () => {
    let con = await connection
    let [list] = await con.query("SELECT * FROM addedDrive WHERE addedDrive_raid = ? ",[false])
    return JSON.stringify(list)
};

module.exports.deleteDrive = async (name) => {
    let con = await connection
    await con.query("DELETE FROM addedDrive WHERE addedDrive_name = ? ",[name])
    return 200
};

module.exports.deleteUser = async (name) => {
    console.log(name)
    let con = await connection
    await con.query("DELETE FROM user WHERE user_name = ? ",[name])
    return 200
};

module.exports.getPermissionList = async (name) => {
    let con = await connection
    let [list] = await con.query("SELECT * FROM permissions WHERE addedDrive_name = ? ",[name])
    return JSON.stringify(list)
};