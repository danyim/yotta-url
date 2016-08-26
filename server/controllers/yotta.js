const { wrap: async } = require('co');
const YottaModel = require('../models/Yotta');

exports.yottacode = async(function* (req, res, next, id) {
  try {
    req.yottaUrl = yield YottaModel.getUrl(id);
    if(!req.yottaUrl) return next(new Error(`yottacode not found`));
  }
  catch(err) {
    return next(err)
  }
  next();
});

exports.expand = (req, res) => {
  if (req.query !== {} && req.query.q) {
    const query = YottaModel.findOne({ target_url: req.query.q });

    query.exec().then(
      (doc) => {
        if (doc) {
          res.status(200).send(`already exists (created ${doc.updated_on}) http://localhost:8080/${doc.yotta_code}`);
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
          res.status(201).send(`url ${doc.target_url} created successfully on ${doc.created_on}: http://localhost:8080/${doc.yotta_code}`);
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
  res.redirect(req.yottaUrl.target_url);
};

exports.default = (req, res) => {
  res.status(200).send(`yotta-url up and running`);
};
