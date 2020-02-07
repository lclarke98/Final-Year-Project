const shell = require('shelljs');

module.exports.addDrive = async (driveName, drivePath, permissions) => {
    shell.exec('sh ../shell-scripts/add-drive.sh' + drivePath, driveName, permissions)
};

module.exports.addUser = async (userName, password, permissions) => {
    shell.exec('sh ../shell-scripts/add-user.sh' + userName, password)
};

module.exports.deleteUser = async (userName) => {
    shell.exec('sh ../shell-scripts/delete-user.sh' + userName)
};