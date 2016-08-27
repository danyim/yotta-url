const mongoose = require('mongoose');
const yottaHash = require('../yotta-hash');
const config = require('../config');

mongoose.connect(`mongodb://${config.mongo.user}:${config.mongo.password}@${config.mongo.hostname}`);
mongoose.Promise = global.Promise; // Use native ES6 promises

const Schema = mongoose.Schema;

const yottaSchema = new Schema({
  target_url: { type: String, required: true, unique: true },
  yotta_code: { type: String, index: false },
  created_on: Date,
  last_visited: Date,
  visits: Number
});

yottaSchema.pre('save', function(next) {
  // Update the created date field
  if (!this.created_on) {
    this.created_on = new Date();
  }

  // Sanitize the URL
  if(!this.target_url.startsWith('http://') && !this.target_url.startsWith('https://')) {
    this.target_url = `http://${this.target_url}`;
  }

  // Create a yotta code if it doesn't exist
  if (!this.yotta_code) {
    this.yotta_code = yottaHash.yottacize(this.target_url);
  }

  // Initialize the visits
  if (!this.visits) {
    this.visits = 0;
  }

  next();
});

yottaSchema.methods = {
  // generateYotta: () => {
  //   this.yotta_code = yottaHash.yottacize(this.target_urL);
  // }
}

yottaSchema.statics = {
  getByYottaCode: function(yottacode) {
    return this.findOne({ yotta_code: yottacode })
      .exec();
  },
  incrementVisit: function(yottaCode) {
    return this.update(
      { yotta_code: yottaCode },
      {
        $inc: { visits: 1 },
        $set: { last_visited: new Date() }
      }
    );
  }
}

const Yotta = mongoose.model('Yotta', yottaSchema);

module.exports = Yotta;
