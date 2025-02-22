const express = require('express');
const multer = require('multer');
const fs = require('fs');
const api = express.Router();
const db = require('../db-function');
const shell = require('./shell-script')
const bodyParser = require('body-parser')
const passwordHash = require('password-hash');
const path = require("path")
module.exports = api;
api.use(bodyParser.json());
api.use(bodyParser.urlencoded({ extended: true }));

// get undadded drive list route
api.get('/unaddedDriveList', async (req, res) => {
  try {
      res.send(await db.getUnaddedDriveList()) 
  }catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

// get user list route
api.get('/userList', async (req, res) => {
  try {
      res.send(await db.getUserList()) 
  }catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

// get drive list route
api.get('/driveList', async (req, res) => {
  try {
      res.send(await db.getDriveList()) 
  }catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

// get permission list by drive name route
api.get('/permissionList', async (req, res) => {
  try{
    const name = req.query.driveName
    res.send(await db.getPermissionList(name))
  }catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

// get permission list by username route
api.get('/permissionListByUsername', async (req, res) => {
  try{
    const name = req.query.userID
    res.send(await db.getPermissionListByUsername(name))
  }catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

// add new drive route
api.post('/newDrive', async (req, res) => {
  try{
    const name = req.body.info.driveName
    const path = req.body.info.drivePath
    const permissionList = req.body.info.permissionList
    const ID = await db.addNewDrive(name,path)
    if(ID.length ==1){
      await db.addDrivePermissions(ID[0].addedDrive_name,permissionList)
      await shell.addDrive(name,path)
      return res.sendStatus(200)
    }else{
      console.log("error2")
    }
  }catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

// add new user route
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

// update username route
api.put('/username', async (req, res) => {
  try{
    const currentUsername = req.body.info.currentUsername
    const newUsername = req.body.info.newUsername
    const confirm = await db.updateUsername(currentUsername, newUsername)
    if(confirm  == 200){
      shell.updatePermissions()
      return res.sendStatus(200)
    }else{
      console.log("error2")
    }
  }catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

// update password route
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

// delete drive route
api.delete('/drive', async (req, res) => {
  try{
    const name = req.body.info.driveName
    const name = req.body.info.path
    await shell.deleteDrive(name, path)
    res.status(200).send(await db.deleteDrive(name))
  }catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

// delete user route
api.delete('/user', async (req, res) => {
  try{
    const userID = req.body.info.userID
    await db.deleteUser(userID)
    shell.updatePermissions()
    res.sendStatus(200)
  }catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

// add user route
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

// update permissions route
api.put('/userPermissions', async (req, res) => {
  try{
    const permissionsTable = req.body.info.newPermissions
    await db.updateUserPermissions(permissionsTable)
    shell.updatePermissions()
    res.sendStatus(200)
  }catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

// File Manager Functions

// add new folder
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

// download file
api.get('/download', function(req, res){
  const file = req.query.path
  console.log(file)
  res.download(file.replace(/['"]+/g, ''))
})

// delete file
api.delete('/delete', function(req, res){
  const file = req.query.path
  console.log(file)
  fs.unlink(file, (err) => {
    if (err) {
      console.error(err)
      return
    }
  
    //file removed
  })
  res.sendStatus(200)
})

let uploadPath

// gets the upload path for multer
api.get('/uploadPath', function(req, res){
  uploadPath = req.query.location
  return uploadPath
})


// gets all files from selected nas drive
api.get('/allFiles', function(req, res) {
  var currentDir = req.query.location
  console.log(currentDir)
  var query = req.query.path || '';
  if (query) currentDir = path.join(dir, query)
  console.log("browsing ", currentDir)
  fs.readdir(currentDir, function (err, files) {
      if (err) {
         throw err
       }
       var data = []
       files.forEach(function (file) {
         try {
                 var isDirectory = fs.statSync(path.join(currentDir,file)).isDirectory()
                 if (isDirectory) {
                   data.push({ Name : file, IsDirectory: true, Path : path.join(query, file)  })
                 } else {
                   var ext = path.extname(file);       
                   data.push({ Name : file, Ext : ext, IsDirectory: false, Path : path.join(query, file) })
                 }
         } catch(e) {
           console.log(e); 
         }        
         
       });
       res.json(data);
   });
 });



// multer config
 const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath)
  },
  filename: function (req, file, cb) {
     cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });


// uploads file
api.post('/file', upload.array('media'), async (req, res, next) => {
  const files = req.files

  if (!files) {
    const error = ('No file selected');
  } else {
    try {
      for (let i = 0; i < files.length; i++) {
        await db.addFile(files[i].originalname);
      }
      res.send(200)
    } catch (e) {
      if (e.status === 'exists') {
        res.sendStatus(200)
      } else {
        res.sendStatus(200)
      }
    };
  }
});

