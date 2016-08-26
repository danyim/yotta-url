const mongoose = require('mongoose');
const yottacize = require('../yotta-hash');
const config = require('../mongo-config');

mongoose.connect(`mongodb://${config.username}:${config.password}@${config.host}`);
mongoose.Promise = global.Promise; // Use native ES6 promises

const Schema = mongoose.Schema;

const yottaSchema = new Schema({
  target_url: { type: String, required: true, unique: true },
  yotta_code: { type: String, index: false },
  created_on: Date,
  updated_on: Date,
});

yottaSchema.methods.generateYotta = () => {
  this.yotta_code = yottacize(this.target_urL);
};

yottaSchema.pre('save', next => {
  // Update the date fields
  const currDate = new Date();
  this.updated_on = currDate;
  if (!this.created_on) {
    this.created_on = currDate;
  }

  // // Create a yotta code if it doesn't exist
  // if (!this.yotta_code) {
  //   this.yotta_code = yottacize(this.target_url);
  // }

  next();
});

const Yotta = mongoose.model('Yotta', yottaSchema);

module.exports = Yotta;
