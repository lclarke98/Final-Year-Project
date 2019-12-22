const express = require('express');
const multer = require('multer');
const api = express.Router();
const db = require('../db-function');
module.exports = api;



// Drive Setup Functions
api.get('/driveList', db.getDriveList);

















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
  res.sendFile(__dirname + '../static/html/file-manager.html');
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