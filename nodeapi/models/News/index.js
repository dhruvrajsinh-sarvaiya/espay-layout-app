const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var Int32 = require('mongoose-int32');

// Create Schema
const NewsSchema = new Schema({
    newsid: { type: Int32 },
    locale: {},
    sort_order: { type: String },
    from_date: { type: String },
    to_date: { type: String },
    type: { type: Int32, default: 1 }, // 1= News, 2= Announcement
    status: { type: Int32, default: 1 },
    date_created: { type: Date, default: Date.now },
    date_modified: { type: Date, default: Date.now },
    created_by: { type: String },
    modified_by: { type: String }
});

module.exports = News = mongoose.model('news', NewsSchema);