/**
 * Create By Sanjay 
 * Created Date 27-05-2019
 * Model For HTML Blocks which is Connect With Mongo DB
*/

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var Int32 = require('mongoose-int32');

//Create Schema
const HTMLBlocksSchema = new Schema({
    htmlblockid: { type: Int32 },
    name: { type: String },
    status: { type: Int32, default: 1 },
    content: { type: String },
    date_created: { type: Date, default: Date.now },
    date_modified: { type: Date, default: Date.now },
    created_by: { type: String },
    modified_by: { type: String }
});

module.exports.HTMLBlocks = mongoose.model('htmlblocks', HTMLBlocksSchema);