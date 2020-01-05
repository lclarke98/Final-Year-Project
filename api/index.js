const express = require('express');
const multer = require('multer');
//const fs = require('fs');
const api = express.Router();
const db = require('../db-function');
const bodyParser = require('body-parser')
const shell = require('shelljs');
module.exports = api;
api.use(bodyParser.json());
api.use(bodyParser.urlencoded({ extended: true }));

api.get('/unaddedDriveList', async (req, res) => {
  try {
      res.send(await db.getUnaddedDriveList()) 
  }catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

api.get('/userList', async (req, res) => {
  try {
      res.send(await db.getUserList()) 
  }catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

api.get('/driveList', async (req, res) => {
  try {
      res.send(await db.getDriveList()) 
  }catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

api.get('/permissionList', async (req, res) => {
  try{
    const name = req.query.driveName
    res.send(await db.getPermissionList(name))
  }catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

api.get('/permissionListByUsername', async (req, res) => {
  try{
    const name = req.query.userName
    res.send(await db.getPermissionListByUsername(name))
  }catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

api.post('/newDrive', async (req, res) => {
  try{
    const name = req.body.info.driveName
    const path = req.body.info.drivePath
    const raid = req.body.info.raid
    const raidTarget = req.body.info.raidTarget
    const permissionList = req.body.info.permissionList
    const ID = await db.addNewDrive(name,path,raid,raidTarget)
    if(ID.length ==1){
      db.addDrivePermissions(ID[0].addedDrive_name,permissionList)
      return res.status(200).redirect('/api/fileManager') 
    }else{
      console.log("error2")
    }
  }catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

api.delete('/drive', async (req, res) => {
  try{
    const name = req.body.info.driveName
    res.status(200).send(await db.deleteDrive(name))
  }catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

api.delete('/user', async (req, res) => {
  try{
    const name = req.body.info.userName
    shell.exec('sh ../shell-scripts/delete-user.sh' + name)
    res.status(200).send(await db.deleteUser(name))
  }catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

api.post('/user', async (req, res) => {
  try{
    const name = req.body.info.userName
    const password = req.body.info.password
    const permissions = req.body.info.permissions
    shell.exec('sh ../shell-scripts/add-user.sh' + name)
    const approval = await db.addUser(name, password)
    if(approval == 200){
      db.addUserPermissions(permissions)
    }
  }catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

///////////////////////////////////////////////////////////////////////////////////////////////////////
// File Manager Functions
const fileManager = require('./file-manager-api');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '/Users/leoclarke/Documents/GitHub/Final-Year-Project/api/drive')
  },
  filename: function (req, file, cb) {
     cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

api.get('/allFiles', fileManager.getAllFiles);
api.get('/subDir', fileManager.openSubDir);

api.post('/file', upload.array('media'), async (req, res, next) => {
  const files = req.files

  if (!files) {
    const error = ('No file selected');
  } else {
    try {
      for (let i = 0; i < files.length; i++) {
        await db.addFile(files[i].originalname);
      }
      res.status(200).redirect('/fileManager');
    } catch (e) {
      if (e.status === 'exists') {
        res.status(200).redirect('/fileManager'); // already done
      } else {
        res.status(200).redirect('/fileManager'); 
      }
    };
  }
});

api.get('/fileManager', function(req, res) {
  res.sendFile('static/file-manager.html')
});

api.get('/download', function(req, res) {
  //const path = req.query.path
  const path = '/Users/leoclarke/Documents/GitHub/Final-Year-Project/api/drive/openDashboard.php'
  console.log(path);
  res.download(path, (err) => {
    if (err) {
      console.log(err);
    }
  })
});