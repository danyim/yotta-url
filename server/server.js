const express = require('express');
const yotta = require('./controllers/yotta');

const app = express();

app.param('yottacode', yotta.yottacode);
app.get('/expand', yotta.expand);
app.get('/:yottacode', yotta.fetch);
app.get('/', yotta.default);

app.listen(process.env.PORT || 8080, () => {
  console.log('yotta-url running on:', PORT);
  // Testing
  // yottacize('http://google.com');
  // yottacize('http://google.com/', { debug: true });
});

