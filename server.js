const path = require('path');

if(path.exists('.env')) {
  require('dotenv').config();
}
else {
  console.warn('No .env file found; assuming Heroku deployment');
}

const express = require('express');
const yotta = require('./server/controllers/yotta');

const app = express();
app.use('/', express.static(path.join(__dirname, 'public')));

app.param('yottacode', yotta.yottacode);
app.get('/api/expand', yotta.expand);
app.get('/api/:yottacode', yotta.fetch);
app.get('/api/', yotta.default);
// app.get('/', (req, res) => {
//   res.render('../public/index.html');
// });

app.listen(process.env.PORT || 8080, () => {
  console.log('yotta-url running on:', process.env.PORT || 8080);
  // Testing
  // yottacize('http://google.com');
  // yottacize('http://google.com/', { debug: true });
});

