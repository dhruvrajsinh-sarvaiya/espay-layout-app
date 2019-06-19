const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var Int32 = require('mongoose-int32');

const RegionSchema = new Schema({
    regionname: { type: String },
    slug: { type: String },
    locale: {},
    status: { type: Int32, default: 1 },
    date_created: { type: Date, default: Date.now },
    date_modified: { type: Date, default: Date.now },
    created_by: { type: String },
    modified_by: { type: String }
});

module.exports = Region = mongoose.model('region', RegionSchema);