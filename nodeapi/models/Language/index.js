const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var Int32 = require('mongoose-int32');

const LanguageSchema = new Schema({
    id: { type: Int32 },
    language_name: { type: String },
    code: { type: String },
    rtlLayout: { type: String },
    locale: { type: String },
    status: { type: Int32 },
    sort_order: { type: Int32 },
    date_created: { type: Date, default: Date.now },
    date_modified: { type: Date, default: Date.now },
    created_by: { type: String },
    modified_by: { type: String }
}, { versionKey: false });

module.exports = Language = mongoose.model('languages', LanguageSchema);