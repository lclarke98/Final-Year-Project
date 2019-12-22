const express = require('express');

const app = express();
app.use('/api', require('./api'));
app.use(express.static('static', { extensions: ['html'] }));

//App runs on port 80
const port = process.env.PORT || 80;

app.listen(port, (err) => {
  if (err) console.log('error', err);
  else console.log(`app listening on port ${port}`);
});