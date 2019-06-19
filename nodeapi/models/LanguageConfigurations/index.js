//Added By Jayesh 11-12-2018 for getting active & default languages information
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var Int32 = require('mongoose-int32');

const LanguageConfigurationsSchema = new Schema({
    languages: [{
        languageId: { type: Schema.Types.ObjectId, ref: 'languages' },
        status: { type: Int32 },
        isDefault: { type: Int32 }
    }],
    date_created: { type: Date, default: Date.now },
    date_modified: { type: Date, default: Date.now },
    created_by: { type: String, default: "" },
    modified_by: { type: String, default: "" }
}, { versionKey: false });

module.exports = LanguageConfig = mongoose.model('languageconfigurations', LanguageConfigurationsSchema);