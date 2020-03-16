const express = require('express');
const multer = require('multer');
//const fs = require('fs');
const api = express.Router();
const db = require('../db-function');
const shell = require('./shell-script')
const bodyParser = require('body-parser')
const passwordHash = require('password-hash');
const path = require("path")
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
    const name = req.query.userID
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
      await db.addDrivePermissions(ID[0].addedDrive_name,permissionList)
      await shell.addDrive(name,path,permissionList)
      return res.sendStatus(200)
    }else{
      console.log("error2")
    }
  }catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

api.post('/newUser', async (req, res) => {
  try{
    const userName = req.body.info.userName
    console.log(userName)
    const password = req.body.info.password
    const permissionList = req.body.info.permissionList
    let hashedPassword = passwordHash.generate(password);
    const confirm = await db.addNewUser(userName,hashedPassword)
    if(confirm != 0){
      userID = confirm[0].user_id
      console.log(userID)
      await db.addUserPermissions(userID ,permissionList)
      await shell.addUser(userName,password)
      return res.sendStatus(200)
    }else{
      console.log("error2")
    }
  }catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

api.put('/username', async (req, res) => {
  try{
    const currentUsername = req.body.info.currentUsername
    const newUsername = req.body.info.newUsername
    const confirm = await db.updateUsername(currentUsername, newUsername)
    if(confirm  == 200){
      return res.sendStatus(200)
    }else{
      console.log("error2")
    }
  }catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

api.put('/password', async (req, res) => {
  try{
    const username = req.body.info.username
    const password = req.body.info.newPassword
    const confirm = await db.updatePassword(username,password)
    if(confirm  == 200){
      return res.sendStatus(200)
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
    const userID = req.body.info.userID
    res.status(200).send(await db.deleteUser(userID))
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
    const approval = await db.addUser(name, password)
    if(approval == 200){
      await db.addUserPermissions(permissions)
      await shell.addUser(name,password)
      res.sendStatus(200)
    }
  }catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

api.put('/userPermissions', async (req, res) => {
  try{
    const permissionsTable = req.body.info.newPermissions
    res.send(await db.updateUserPermissions(permissionsTable))
  }catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

///////////////////////////////////////////////////////////////////////////////////////////////////////
// File Manager Functions
const fileManager = require('./file-manager-api');

api.post('/newFolder', async (req, res) => {
  try{
    const folderName = req.body.info.folderName
    shell.addNewFolder(folderName)
    res.sendStatus(200)
  }catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

api.get('/download', function(req, res){
  const file = req.query.path
  console.log(file)
  res.download(file, 'report.pdf', function (err) {
    if (err) {
      console.log(err)
    } else {
      console.log("file downloading")
    }
  })
});


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '/Users/leoclarke/Documents/GitHub/Final-Year-Project/api/drive')
  },
  filename: function (req, file, cb) {
     cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

const fs = require('fs');


api.get('/allFiles', function(req, res) {
  var currentDir = req.query.location
  console.log(currentDir)
  var query = req.query.path || '';
  if (query) currentDir = path.join(dir, query);
  console.log("browsing ", currentDir);
  fs.readdir(currentDir, function (err, files) {
      if (err) {
         throw err;
       }
       var data = [];
       files.forEach(function (file) {
         try {
                 //console.log("processing ", file);
                 var isDirectory = fs.statSync(path.join(currentDir,file)).isDirectory();
                 if (isDirectory) {
                   data.push({ Name : file, IsDirectory: true, Path : path.join(query, file)  });
                 } else {
                   var ext = path.extname(file);       
                   data.push({ Name : file, Ext : ext, IsDirectory: false, Path : path.join(query, file) });
                 }
 
         } catch(e) {
           console.log(e); 
         }        
         
       });
       //data = _.sortBy(data, function(f) { return f.Name });
       console.log(data)
       res.json(data);
   });
 });


















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

