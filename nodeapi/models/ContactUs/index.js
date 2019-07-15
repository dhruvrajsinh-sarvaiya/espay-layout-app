// Added by Jayesh Pathak 29-10-2018 for adding contact us module - start 
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var Int32 = require('mongoose-int32');

const ContactUsMaster = new Schema({
  id: Int32,
  email: String,
  subject: String,
  description: String,
  attachedFile: { type: String, default: '' },
  date_added: { type: Date, default: Date.now }
}, { versionKey: false });

ContactUsMaster.index({ '$**': 'text' });

module.exports.ContactUs = mongoose.model('contactus', ContactUsMaster);
// Added by Jayesh Pathak 29-10-2018 for adding contact us module - end