const express = require('express');
const path = require('path');
const session = require('express-session');
const app = express();

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60000 }
}))

app.use('/api', require('./api'));
app.use('/user', require('./user'));


app.use(express.static('static', { extensions: ['html'] }));
app.use(express.static(path.join(__dirname, 'static')));

//App runs on port 80
const port = process.env.PORT || 80;

// redirects user to admin dashboard
app.get('/dashboard', async (req, res) => {
  try {
      const result = "login"
      console.log(result)
      res.redirect("/main-dashboard.html")
  }catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

//redirects user to drive selection window
app.get('/drive-select', async (req, res) => {
  try {
      res.redirect("/drive-selection.html")
  }catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

// redirects user to login page
app.get('/index', async (req, res) => {
  try {
      res.redirect("/index.html")
  }catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

// app runs on port 80
app.listen(port, (err) => {
  if (err) console.log('error', err);
  else console.log(`app listening on port ${port}`);
});