/**
 * Create By Sanjay
 * Created Date 29-05-2019
 * Model For Image Slider
*/

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var Int32 = require('mongoose-int32');

const ImageSlidersSchema = new Schema({
    sliderid: Int32,
    slidername: { type: String },
    status: { type: Int32, default: 0 },
    imageslist: [{
        image: { type: String },
        imagepreviewurl: { type: String },
        imagelink: { type: String },
        sortorder: { type: Int32 }
    }],
    date_created: { type: Date, default: Date.now },
    date_modified: { type: Date, default: Date.now },
    created_by: { type: String },
    modified_by: { type: String }
});

module.exports = ImageSliders = mongoose.model('imagesliders', ImageSlidersSchema);