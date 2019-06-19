// Added by Jayesh Pathak 09-10-2018 for adding city module - start 
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var Int32 = require('mongoose-int32');

const CityMaster = new Schema({
  cityId: Int32,
  stateId: Int32,
  locale: {},
  status: { type: Int32, default: 1 },
  createdBy: { type: Int32, default: 1 },
  createdDate: { type: Date, default: Date.now },
  countryId: Int32
}, { versionKey: false });

CityMaster.index({ '$**': 'text' });

module.exports = City = mongoose.model('cities', CityMaster);
// Added by Jayesh Pathak 09-10-2018 for adding city module - end