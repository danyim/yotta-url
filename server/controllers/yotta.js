const yottacize = require('../yotta-hash');
const YottaModel = require('../models/Yotta');

exports.urldecode = (req, res, next, val) => {
  console.log('urlcode is', val);
  next();
};

exports.expand = (req, res) => {
  if (req.query !== {} && req.query.q) {
    const query = YottaModel.findOne({ target_url: req.query.q });

    query.exec().then(
      (doc) => {
        if (doc) {
          res.status(200).send(`already exists http://localhost:1104/${doc.yotta_code}`);
          res.end();
        }
        else {
          const yottaCode = yottacize(req.query.q);
          const y = new YottaModel({
            target_url: req.query.q,
            yotta_code: yottaCode
          });
          return y.save();
        }
      }
    )
    .then(
      doc => {
        if (doc) {
          res.status(201).send(`url ${doc.target_url} created successfully on ${doc.created_on}: http://localhost:1104/${doc.yotta_code}`);
          res.end();
        }
      }
    )
    .catch(
      err => {
        res.status(400).send(`there was an error creating ${err.toString()}`);
        res.end();
      }
    );

  } else {
    res.status(400).send('no url provided');
    res.end();
  }
};

exports.fetch = (req, res) => {
  const query = YottaModel.findOne({ yotta_code: req.params.urlcode });

  query.then(
    (doc) => {
      if(doc) {
        res.redirect(doc.target_url);
      }
      else {
        res.status(404).send('not found');
        res.end();
      }
    }
  )
  .catch(
    err => {
      res.status(400).send(`error while searching ${err.toString()}`);
      res.end();
    }
  );
};

exports.default = (req, res) => {
  res.status(200).send(`yotta-url up and running`);
};
