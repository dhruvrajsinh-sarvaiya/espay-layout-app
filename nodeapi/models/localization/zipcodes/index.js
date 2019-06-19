// Added by dhara gajera 8/2/2019 for adding zipcodes module - start 
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var Int32 = require('mongoose-int32');

const ZipcodesMaster = new Schema({
  zipcodesId: Int32,
  countryId: Int32,
  stateId: Int32,
  cityId: Int32,
  zipcode: String,
  zipAreaName: String,
  status: { type: Int32, default: 1 },
  createdBy: { type: Int32, default: 1 },
  createdDate: { type: Date, default: Date.now },
  latitude: { type: String, default: 0 },
  longitude: { type: String, default: 0 },
  accuracy: { type: Int32, default: 0 },
}, { versionKey: false });

ZipcodesMaster.index({ '$**': 'text' });

module.exports = Zipcodes = mongoose.model('zipcodes', ZipcodesMaster);
// Added by dhara gajera 8/2/2019 for adding zip codes module - end