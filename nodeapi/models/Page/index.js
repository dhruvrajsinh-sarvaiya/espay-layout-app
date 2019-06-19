const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var Int32 = require('mongoose-int32');

const PageSchema = new Schema({
    locale: {},
    layout_id: { type: String },
    channel_id: { type: String },
    sort_order: { type: String },
    route: { type: String },
    page_type: { type: String, default: 1 },
    status: { type: Int32, default: 1 },
    date_created: { type: Date, default: Date.now },
    date_modified: { type: Date, default: Date.now },
    created_by: { type: String },
    modified_by: { type: String }
});

module.exports = Page = mongoose.model('page', PageSchema);