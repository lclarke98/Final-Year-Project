const express = require('express');
const path = require('path');
const session = require('express-session');
const app = express();

app.use('/api', require('./api'));
app.use('/user', require('./user'));


app.use(express.static('static', { extensions: ['html'] }));
app.use(express.static(path.join(__dirname, 'static')));
//App runs on port 80
const port = process.env.PORT || 80;


app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60000 }
}))

app.listen(port, (err) => {
  if (err) console.log('error', err);
  else console.log(`app listening on port ${port}`);
});