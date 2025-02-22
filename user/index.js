const express = require('express')
const user = express.Router()
const db = require('../user-db-function')
const bodyParser = require('body-parser')
module.exports = user
user.use(bodyParser.json())
user.use(bodyParser.urlencoded({ extended: true }))

// login route
user.get('/login', async (req, res) => {
    try {
        const username = req.query.username
        const password = req.query.password
        console.log(username)
        const result = await db.loginRequest(username,password)
        if(result.length == 0){
            res.sendStatus(401)
        }else{
            req.session.user_id = result[0].user_id
            req.session.user_name = result[0].user_name
            if(result[0].user_name === "admin"){
                res.redirect("/dashboard")
            }else{
                res.redirect("/drive-select")
            }
        }
    }catch (e) {
      console.error(e);
      res.sendStatus(500);
    }
});

// get user drive list route
user.get('/userDriveList', async (req, res) => {
    try {
        res.send(await db.getUserDriveList(req.session.user_id)) 
    }catch (e) {
      console.error(e);
      res.sendStatus(500);
    }
});

// login route
user.get('/logout', async (req, res) => {
    try {
        req.session.destroy();
        res.redirect("/index")
    }catch (e) {
      console.error(e);
      res.sendStatus(500);
    }
});


user.get('/session', async (req, res) => {
    console.log(req.session)
    res.json(req.session)
});