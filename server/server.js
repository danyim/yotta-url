const express = require('express');
const yotta = require('./controllers/yotta');

const app = express();
const PORT = process.env.PORT || 1104;

app.param('yottacode', yotta.yottacode);
app.get('/expand', yotta.expand);
app.get('/:yottacode', yotta.fetch);
app.get('/', yotta.default);

app.listen(PORT, () => {
  console.log('yotta-url running on:', PORT);
  // Testing
  // yottacize('http://google.com');
  // yottacize('http://google.com/', { debug: true });
});
