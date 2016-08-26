const mongoose = require('mongoose');
const yottacize = require('../yotta-hash');

const Schema = mongoose.Schema;

const yottaSchema = new Schema({
  target_url: { type: String, required: true, unique: true },
  yotta_code: { type: String, required: true, unique: true },
  created_on: Date,
  updated_on: Date,
});

yottaSchema.methods.generateYottaCode = () => {
  this.yotta_code = yottacize(this.target_urL);
};

const Yotta = mongoose.model('Yotta', yottaSchema);

module.exports = Yotta;
