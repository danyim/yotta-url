const express = require('express');
const yottaHasher = require('./yotta-hash');

const app = express();
const PORT = 1104;

app.param('urlcode', (req, res, next, val) => {
  console.log('urlcode is', val);
  next();
});

app.get('/expand', (req, res) => {
  if (req.query !== {} && req.query.q) {
    res.status(201).send(`you provided the url ${req.query.q}`);
  } else {
    res.status(400).send('no url provided');
  }
  res.end();
});

app.get('/:urlcode', (req, res) => {
  res.status(200).send(`youre looking for ${req.params.urlcode}`);
  res.end();
});

app.listen(PORT, () => {
  console.log('yotta-url running:', PORT);
  debugger;
  yottaHasher.yottacize('http://thisisarealurl.com/somethingREAL');
  yottaHasher.yottacize('http://thisisarealurl.com/somethingREAL2');
});

