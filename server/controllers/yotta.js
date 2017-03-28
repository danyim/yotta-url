const { wrap: async } = require('co');
const YottaModel = require('../models/Yotta');

exports.yottacode = async(function* (req, res, next, id) {
  try {
    req.yotta = yield YottaModel.getByYottaCode(id);
    if(!req.yotta) return next(new Error(`Yottacode not found.`));
  }
  catch(err) {
    // return next(err);
    return err;
  }
  next();
});

exports.create = (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  const message = {};

  if (req.query !== {} && req.query.q) {
    YottaModel.getByUrl(req.query.q)
    .then(
      (doc) => {
        if (doc) {
          message.yottacode = doc.yotta_code;
          message.created = doc.updated_on;
          message.msg = 'already exists';
          res.status(200).send(message);
          // res.status(200).send(`already exists (created ${doc.updated_on}) http://localhost:8080/${doc.yotta_code}`);
          res.end();
        }
        else {
          const y = new YottaModel({
            target_url: req.query.q
          });
          return y.save();
        }
      }
    )
    .then(
      doc => {
        if (doc) {
          message.yottacode = doc.yotta_code;
          message.created = doc.updated_on;
          message.msg = 'created successfully';
          res.status(200).send(message);
          // res.status(201).send(`url ${doc.target_url} created successfully on ${doc.created_on}: http://localhost:8080/${doc.yotta_code}`);
          res.end();
        }
      }
    )
    .catch(
      err => {
        message.msg = `there was an error creating ${err.toString()}`;
        res.status(500).send(message);
        // res.status(500).send(`there was an error creating ${err.toString()}`);
        res.end();
      }
    );
  } else {
    message.msg = 'Missing a parameter';
    res.status(400).send(message);
    // res.status(400).send('no url provided');
    res.end();
  }
};

exports.fetch = (req, res) => {
  YottaModel.incrementVisit(req.yotta.yotta_code).then(() => {
    res.redirect(req.yotta.target_url);
  });
};

exports.default = (req, res) => {
  res.status(200).send(`yotta-url up and running`);
};
