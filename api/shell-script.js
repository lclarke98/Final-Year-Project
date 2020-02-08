const shell = require('shelljs');
const db = require('../db-function')

function sortReadList(permissions){
    let readList
    for(let i = 0; i > permissions.length; i++){
        readlist + " " + permissions[i].read
    }
    return readList
}

function sortWriteList(permissions){
    let writeList
    for(let i = 0; i > permissions.length; i++){
        writelist + " " + permissions[i].write
    }
    return writeList
}

module.exports.addDrive = async (driveName, drivePath, permissions) => {
    const readList = sortReadList(permissions)
    const writeList = sortWriteList(permissions)
    shell.exec('sh ../shell-scripts/add-drive.sh' + drivePath, driveName, readList, writeList)
};

module.exports.addUser = async (userName, password, permissions) => {
    shell.exec('sh ../shell-scripts/add-user.sh' + userName, password)
};

module.exports.deleteUser = async (userName) => {
    shell.exec('sh ../shell-scripts/delete-user.sh' + userName)
};