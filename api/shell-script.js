const shell = require('shelljs');
const db = require('../db-function')

// sorts the read list
function sortReadList(driveName, permissions){
    let readList = driveName + "read"
    for(let i = 0; i < permissions.length; i++){
        if(permissions[i].permission_read == 1){
            readList += " " + permissions[i].user_name
        }
    }
    return readList
}

// sorts the write list
function sortWriteList(driveName, permissions){
    let writeList = driveName + "write"
    for(let i = 0; i < permissions.length; i++){
        if(permissions[i].permission_write  == 1){
            writeList += " " + permissions[i].user_name
        }
    }
    return writeList
}

// adds drive to samba and fstab
async function addDrive(driveName, drivePath) {
    let permissions = await db.getPermissionList(driveName)
    let readList = "'" + sortReadList(driveName, permissions) + "'" 
    let writeList = "'" + sortWriteList(driveName, permissions) + "'"
    shell.exec('sh /home/pi/shell/add-drive.sh' +" "+ drivePath +" "+ driveName +" "+ readList +" "+ writeList)
};

// adds new folder
async function addNewFolder(folderName) {
    shell.exec('sh /home/pi/shell/new-folder.sh' +" "+ folderName)
};

// adds new user
async function addUser(userName, password) {
    shell.exec('sh /home/pi/shell/new-user.sh' +" "+userName +" "+ password)
    updatePermissions(userName)
};

// delets drive
async function deleteDrive(path, name) {
    shell.exec('sh ../shell-scripts/delete-drive.sh' + path +" "+ name)
};

// delets user
async function deleteUser(userName) {
    shell.exec('sh ../shell-scripts/delete-user.sh' + userName)
};

// updates permissions
async function updatePermissions(){
    const driveList = await db.getDriveList()
    console.log(driveList)
    for(let i = 0; i < driveList.length; i++){
        let permissions = await db.getPermissionList(driveList[i].addedDrive_name)
        let readList = "'" + "read list=" + sortReadList(driveList[i].addedDrive_name, permissions) + "'"
        let writeList = "'" + "write list=" + sortWriteList(driveList[i].addedDrive_name, permissions) + "'"
        let readName = driveList[i].addedDrive_name + "read"
        let writeName = driveList[i].addedDrive_name + "write"
        shell.exec('sh /home/pi/shell/update-permissions.sh' +" "+ readName +" "+ readList)
        shell.exec('sh /home/pi/shell/update-permissions.sh' +" "+ writeName +" "+ writeList)
    }
}


module.exports = {
    updatePermissions,
    addDrive,
    addNewFolder,
    deleteDrive,
    deleteUser,
    addUser
}