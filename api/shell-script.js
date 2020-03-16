const shell = require('shelljs');
const db = require('../db-function')

function sortReadList(driveName, permissions){
    let readList = driveName + "read"
    for(let i = 0; i < permissions.length; i++){
        if(permissions[i].permission_read == 1){
            console.log(permissions[i].user_name)
            readList += " " + permissions[i].user_name
        }
    }
    console.log(readList)
    return readList
}

function sortWriteList(driveName, permissions){
    let writeList = driveName + "write"
    for(let i = 0; i < permissions.length; i++){
        if(permissions[i].permission_write  == 1){
            writeList += " " + permissions[i].user_name
        }
    }
    return writeList
}

module.exports.addDrive = async (driveName, drivePath) => {
    let permissions = await db.getPermissionList(driveName)
    let readList = "'" + sortReadList(driveName, permissions) + "'" 
    //console.log(readList)
    let writeList = "'" + sortWriteList(driveName, permissions) + "'"

    shell.exec('sh /home/pi/shell/add-drive.sh' +" "+ drivePath +" "+ driveName +" "+ readList +" "+ writeList)
    //shell.exec('sh /home/pi/Final-Year-Project/shell-scripts/add.sh' +" "+ "helloWorld")
};

module.exports.addNewFolder = async (folderName) => {
    shell.exec('sh /home/pi/shell/new-folder.sh' +" "+ folderName)
};



module.exports.addUser = async (userName, password, permissions) => {
    shell.exec('sh ../shell-scripts/add-user.sh' + userName, password)
    updatePermissions(userName)
};

module.exports.deleteUser = async (userName) => {
    shell.exec('sh ../shell-scripts/delete-user.sh' + userName)
};

async function updatePermissions(userName){
    
}