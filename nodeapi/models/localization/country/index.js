// Added by Jayesh Pathak 09-10-2018 for adding country module - start 
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var Int32 = require('mongoose-int32');

const CountryMaster = new Schema({
  countryId: Int32,
  countryCode: String,
  locale: {},
  status: { type: Int32, default: 1 },
  createdBy: { type: Int32, default: 1 },
  createdDate: { type: Date, default: Date.now },
}, { versionKey: false });

CountryMaster.index({ '$**': 'text' });

module.exports.Country = mongoose.model('countries', CountryMaster);
// Added by Jayesh Pathak 09-10-2018 for adding country module - end