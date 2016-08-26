const express = require('express');
const yottacize = require('./yotta-hash');
const Yotta = require('./controllers/Yotta');
const YottaModel = require('./models/Yotta');

const app = express();
const PORT = 1104;

app.param('urlcode', (req, res, next, val) => {
  console.log('urlcode is', val);
  next();
});

// TODO: move all the logic into controllers and keep the routes clean
app.get('/expand', (req, res) => {
  if (req.query !== {} && req.query.q) {
    const query = YottaModel.findOne({ target_url: req.query.q });

    query.exec().then(
      (err, doc) => {
        if (err) {
          res.status(400).send('there was an error searching');
          res.end();
        }
        if (doc) {
          res.status(200).send(`already exists http://localhost:1104/${record[0].yotta_code}`);
          res.end();
        }
        else {
          const yottaCode = yottacize(req.query.q);
          const y = new YottaModel({
            target_url: req.query.q,
            yotta_code: yottaCode
          });
          return y.save
        }
      }
    )
    .then(
      err => {
        if (err) {
          res.status(400).send('there was an error creating');
          res.end();
        }
        else {
          res.status(201).send(`url ${req.query.q} created successfully: http://localhost:1104/${yottaCode}`);
          res.end();
        }
      }
    );

  } else {
    res.status(400).send('no url provided');
    res.end();
  }
});

app.get('/:urlcode', (req, res) => {
  YottaModel.find({ yotta_code: req.params.urlcode }, (err, record) => {
    if (err) {
      res.status(400).send('error while searching');
      res.end();
    }
    else {
      if(record.length === 0) {
        res.status(404).send('not found');
        res.end();
      }
      else {
        res.status(200).send(`found it! ${record.target_url}`);
        res.end();
      }
    }
  });
});

app.listen(PORT, () => {
  console.log('yotta-url running:', PORT);
  yottacize('http://google.com');
  yottacize('http://google.com/', { debug: true });
});

