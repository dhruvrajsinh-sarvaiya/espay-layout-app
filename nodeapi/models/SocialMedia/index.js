/*
Created By : Megha Kariya
Date : 13/02/2019
Description : Model file of social media
*/
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var Int32 = require('mongoose-int32');

const SocialMediaSchema = new Schema({
    social_media_type: { type: String, default: 1 },
    name: { type: String },
    details: {},
    status: { type: Int32, default: 1 },
    date_created: { type: Date, default: Date.now },
    date_modified: { type: Date, default: Date.now },
    created_by: { type: String },
    modified_by: { type: String }
});

module.exports.SocialMedia = mongoose.model('socialmedia', SocialMediaSchema);