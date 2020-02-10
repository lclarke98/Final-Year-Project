const express = require('express');
const user = express.Router();
const session = require('express-session');
const db = require('../db-function');
const bodyParser = require('body-parser')
module.exports = user;

