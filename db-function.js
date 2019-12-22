const fs = require('fs');
const mysql = require('mysql2/promise')
const config = require('./db-config')
const connection = mysql.createConnection(config.mysql)

async function refreshList(){
    //const path = '/media/pi/'
    const path = '/Users/leoclarke/Documents/GitHub/Final-Year-Project/api/media/'
    try {
        fs.readdir(path, (err, unaddedDriveList) => {
            console.log(unaddedDriveList)
            return unaddedDriveList
        });
        const list = unaddedDriveList
        for(let i = 0; i < list.length; i++){
            let drivePath = path + list[i]
            let con = await connection;
            await con.query("INSERT INTO unaddedDrive(unaddedDrive_name, unaddedDrive_path, unaddedDrive_added) VALUES (?,?,?,?)", [list[i], drivePath, 'FALSE']);
         }
      } catch (e) {
        console.error(e);
      }
}

module.exports.getUnaddedDriveList = async () => {
    refreshList()
    let con = await connection
    let [list] = await con.query("SELECT * FROM unaddedDrive WHERE unaddedDrive = ? ",["FALSE"])
    return list
};

module.exports.addDrive = async (name, path, raid) => {
    try{
        let con = await connection
        let [list] = await con.query("SELECT * FROM unaddedDrive WHERE unaddedDrive = ? ",["FALSE"])
        return list
    }catch(e){
        console.log(e)
    }
};