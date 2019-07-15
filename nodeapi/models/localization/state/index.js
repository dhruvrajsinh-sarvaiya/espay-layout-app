// Added by Jayesh Pathak 09-10-2018 for adding state module - start 
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var Int32 = require('mongoose-int32');

const StateMaster = new Schema({
  stateId: Int32,
  stateCode: String,
  locale: {},
  status: { type: Int32, default: 1 },
  createdBy: { type: Int32, default: 1 },
  createdDate: { type: Date, default: Date.now },
  countryId: Int32
}, { versionKey: false });

StateMaster.index({ '$**': 'text' });

module.exports.State = mongoose.model('states', StateMaster);
// Added by Jayesh Pathak 09-10-2018 for adding state module - end