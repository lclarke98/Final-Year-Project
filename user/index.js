const express = require('express')
const user = express.Router()
const session = require('express-session')
const db = require('../user-db-function')
const bodyParser = require('body-parser')
module.exports = user
user.use(bodyParser.json())
user.use(bodyParser.urlencoded({ extended: true }))

user.get('/login', async (req, res) => {
    try {
        const username = "admin"
        const password = "admin"
        const result = await db.loginRequest(username,password)
        console.log(result[0].user_name)
        //req.session = {}
        req.session.user_id = result[0].user_id
        req.session.user_name = result[0].user_name
        res.redirect("/dashboard")
    }catch (e) {
      console.error(e);
      res.sendStatus(500);
    }
});

user.get('/session', async (req, res) => {
    console.log(req.session)
    res.json(req.session)
});