//------------- GLOBAL VARIABLES -------------//
const fs = require('fs');
const db = require('../db-function');
const config = require('../db-config');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '/Users/leoclarke/Documents/GitHub/Final-Year-Project/api/drive')
  },
  filename: function (req, file, cb) {
     cb(null, file.originalname);
  }
});

const path = '/Users/leoclarke/Documents/GitHub/Final-Year-Project/api/drive';

const upload = multer({ storage: storage });

module.exports.getAllFiles = async (req, res) => {
  try {
    fs.readdir(path, (err, files) => {
      res.send(files)
    });
  }
  catch (e) {
    console.log("err")
  }
};

module.exports.openSubDir = async (req, res) => {
  console.log("here")
  const dirPath = '/pic'
  const subDir = path + dirPath
  console.log(subDir)
  try {
    fs.readdir(subDir, (err, files) => {
      res.send(files)
  });
  }
  catch (e) {
    console.log("err")
  }
};
