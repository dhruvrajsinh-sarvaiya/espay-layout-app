//develeped by dhara gajera 12/10/2019
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const CoinListFieldsSchema = new Schema({
    formfields: {},
    date_created: { type: Date, default: Date.now },
    date_modified: { type: Date, default: Date.now },
    created_by: { type: String },
    modified_by: { type: String }
});

module.exports.coinListField = mongoose.model('coinListField', CoinListFieldsSchema);