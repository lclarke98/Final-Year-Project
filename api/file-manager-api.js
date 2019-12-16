'use strict';

//------------- GLOBAL VARIABLES -------------//
const fs = require('fs');
const db = require('../db-function');
const config = require('../db-config');


//------------- MEDIAS API FUNCTIONS -------------//
/**
* getMedias(request, response) -
* Queries the database for a list of all medias.
* Responds with a status code and an array of the media file paths.
*/
module.exports.getAllFiles = async (req, res) => {
  try {
    const pages = await db.getAllFiles();
    res.status(200).json(pages);
  }
  catch (e) {
    config.error(res, e);
  }
};

/**
* getMedia(request, response) -
* Queries the database for a specific media with the requested name. Retrieves the data.
* Responds with a JSON object of the data.
*/
module.exports.getFile = async (req, res) => {
  try {
    const file = '/file/' + req.params.file
    const fileData = await db.getMedia(file);
    res.status(200).send(fileData);
  }
  catch (e) {
    console.log("error")
  }
};

/**
* deleteMedia(request, response) -
* Deletes a media using the submitted file name.
* Responds with a status code.
*/
module.exports.deleteFile = async (req, res) => {
  try {
    const filePath = '/file/' + req.params.file;

    await db.deleteFile('file', filePath)
    res.sendStatus(204);
  }
  catch (e) {
    if (e.status === 'empty') {
      res.sendStatus(410);
    } else {
      console.log("error")
    }
  }
};
