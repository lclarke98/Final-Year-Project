const fs = require('fs');
const mysql = require('mysql2/promise')
const config = require('./db-config')
//const connection = mysql.createConnection(config.mysql)
const connection = mysql.createConnection(config.mysqlPi)
//const path = '/Users/leoclarke/Documents/GitHub/Final-Year-Project/api/drive/media/'
const path = '/media/pi/'
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
    let con = await connection
    let [dbList] = await con.query("SELECT * FROM unaddedDrive WHERE unaddedDrive_added = ? ",[false])
    for(let i = 0; i < list.length; i++){
        //if(list[i] == dbList[i])
        let drivePath = path + list[i]
        let con = await connection;
        await con.query("INSERT INTO unaddedDrive(unaddedDrive_name, unaddedDrive_path, unaddedDrive_added) VALUES (?,?,?)", [list[i], drivePath, false]);

    }
}

module.exports.getUnaddedDriveList = async () => {
    getMediaVolumes()
    let con = await connection
    let [list] = await con.query("SELECT * FROM unaddedDrive WHERE unaddedDrive_added = ? ",[false])
    console.log(list)
    return JSON.stringify(list)
};

module.exports.addDrive = async (name, path, raid) => {
    try{
        let con = await connection
        let [list] = await con.query("SELECT * FROM unaddedDrive WHERE unaddedDrive_added = ? ",["FALSE"])
        return list
    }catch(e){
        console.log(e)
    }
};