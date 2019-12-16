//------------- MEDIA FUNCTIONS -------------//
/**
* getAllFiles(req) -
* Retrieves all records from the file table and pushes them to an array.
* @return {array} The file paths in an array
*/
module.exports.getAllFiles = async (req) => {
    const sql = await sqlPromise;
    let fileArray = [];
  
    try {
      const [results] = await sql.query(sql.format('SELECT * FROM file'));
  
      for (let i = 0; i < results.length; i++) {
        fileArray.push(results[i].file_path);
      }
  
      return fileArray;
    }
    catch (e) {
      fileArray.push('ERROR');
      return fileArray;
    }
  };
  
  /**
  * getMedia(mediaPath) -
  * Queries the database to find a record that contains the mediaPath submitted.
  * @param {string} filePath The medias file path
  * @return {JSON} The medias data in a JSON object
  */
  module.exports.getFile = async (filePath) => {
    const sql = await sqlPromise;
  
    try {
      const [result] = await sql.query(sql.format('SELECT * FROM file WHERE file_path = ?', [filePath]));
  
      return { path: result[0].file_path, modified: result[0].file_modified };
    }
    catch (e) {
      return { path: 'File ERROR', modified: 0 };
    }
  };
  

  /**
* deleteFile(table, filePath) -
* Queries the database to find a record that contains the path submitted for the table submitted.
* If a record is returned it is deleted. If table is pages then displays table is updated accordingly.
* @param {string} table The table to query
* @param {string} filePath The files path
*/
module.exports.deleteFile = async (table, filePath) => {
    const sql = await sqlPromise;
    const path = table + '_path';
    const modifiedTime = Math.floor(Date.now() / 1000);
  
    const [result] = await sql.query(sql.format('Select * FROM ' + table + ' WHERE ' + path + ' = ?', [filePath]));
  
    if (result.length < 1) {
      console.log(filePath + ' could not be delete. ' + filePath + ' was not found in "' + table + '" table. Queried from function "deleteFile".');
      throw EMPTY;
    } else {
      await sql.query(sql.format('DELETE FROM ' + table + ' WHERE ' + path + ' = ?', [filePath]));
      console.log(filePath + ' deleted from "' + table + '" table.');
    }
  };