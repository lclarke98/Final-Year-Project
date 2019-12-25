//------------- GLOBAL VARIABLES -------------//

const db = require('../db-function');
const config = require('../db-config');
const multer = require('multer');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '/Users/leoclarke/Documents/GitHub/Final-Year-Project/api/drive')
  },
  filename: function (req, file, cb) {
     cb(null, file.originalname);
  }
});

//localhost path
const path = '/Users/leoclarke/Documents/GitHub/Final-Year-Project/api/drive/';

//RaspberryPi path
//const path = '/media/pi/'

const upload = multer({ storage: storage });

module.exports.getAllFiles = async (req, res) => {
  try {
    fs.readdir(path, (err, files) => {
      res.send(JSON.stringify(files))
    });
  }
  catch (e) {
    console.log(e)
  }
};

module.exports.openSubDir = async (req, res) => {
  console.log("here")
  const dirPath = '/pic'
  const subDir = path + dirPath
  console.log(subDir)
  try {
    fs.readdir(subDir, (err, files) => {
      res.send(JSON.stringify(files))
  });
  }
  catch (e) {
    console.log("err")
  }
};
