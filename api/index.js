const express = require('express');
const multer = require('multer');
const api = express.Router();
const db = require('../db-function');

const fileManager = require('./file-manager-api');
module.exports = api;

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, '/drive')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    }
  });
  const upload = multer({ storage: storage });
//   MEDIAS
//   GET     /api/medias          - retrieves a list of all medias, returns status code and [mediaPath, mediaPath, ...]
//   GET     /api/medias/x        - retrieves a media of file name x, returns status code and { path: mediaPath, modified: mediaModified }
//   POST    /api/medias          - creates media(s) uploaded by the user, returns redirect link
//   DELETE  /api/medias/x        - deletes a media of file name x, returns http status code only
api.get('/allFiles', fileManager.getAllFiles);

api.get('/api/file/:file', fileManager.getFile);

api.post('/file', upload.array('file'), async (req, res, next) => {
  const files = req.files

  if (!files) {
    const error = ('No file selected');
    config.error(res, error);
  } else {
    try {
      for (let i = 0; i < files.length; i++) {
        await db.addFile('medias', '/medias/' + files[i].originalname);
      }
      res.status(200).redirect('/fileManager');
    } catch (e) {
      if (e.status === 'exists') {
        res.status(200).redirect('/fileManager'); // already done
      } else {
        config.error(res, e);
      }
    };
  }
});

api.get('/fileManager', function(req, res) {
    res.sendFile(__dirname + '../static/html/file-manager.html');
  });
  