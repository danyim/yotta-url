try {
  require('fs').statSync('.env');
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
app.get('/expand', yotta.create);
app.get('/:yottacode', yotta.fetch);

app.listen(process.env.PORT || 8080, () => {
  console.log('yotta-url running on:', process.env.PORT || 8080);
});

