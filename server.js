const fs = require('fs');

// Check for .env
try {
  fs.statSync('.env')
  require('dotenv').config();
}
catch(err) {
  console.warn('No .env file found; assuming Heroku deployment');
}

const express = require('express');
const path = require('path');
const yotta = require('./server/controllers/yotta');
const favicon = require('serve-favicon');

const app = express();

app.use(favicon(path.join(__dirname, '/public/images/favicon.ico')));
app.use('/', express.static(path.join(__dirname, 'public')));

app.param('yottacode', yotta.yottacode);
app.get('/expand', yotta.expand);
app.get('/:yottacode', yotta.fetch);
// app.get('/api/', yotta.default);
// app.get('/', (req, res) => {
//   res.render('../public/index.html');
// });

app.listen(process.env.PORT || 8080, () => {
  console.log('yotta-url running on:', process.env.PORT || 8080);
  // Testing
  // yottacize('http://google.com');
  // yottacize('http://google.com/', { debug: true });
});

