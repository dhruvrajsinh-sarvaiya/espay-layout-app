//Added By Jayesh 17-12-2018 for survey 
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var Int32 = require('mongoose-int32');

const SurveysSchema = new Schema({
    locale: {},
    json: {},
    category_id: { type: Int32, default: 1 },
    date_created: { type: Date, default: Date.now },
    date_modified: { type: Date, default: Date.now },
    created_by: { type: String, default: "" },
    modified_by: { type: String, default: "" },
    status: { type: Int32, default: 1 },
    isDefault: { type: Int32, default: 0 },
    surveyStartDate: { type: Date, default: Date.now },
    surveyEndDate: { type: Date },
}, { versionKey: false });

Surveys = mongoose.model('surveys', SurveysSchema);

const SurveysResultsSchema = new Schema({
    surveyId: { type: Schema.Types.ObjectId, ref: 'surveys' },
    userId: { type: String, default: "" },
    json: {},
    date_created: { type: Date, default: Date.now },
    date_modified: { type: Date, default: Date.now },
    survey_by: { type: String, default: "" },
}, { versionKey: false });

SurveysResults = mongoose.model('surveys_results', SurveysResultsSchema);

delete mongoose.models['surveys_results'];
delete mongoose.modelSchemas[SurveysResultsSchema];

delete mongoose.models['surveys'];
delete mongoose.modelSchemas[SurveysSchema];

module.exports = {
    Surveys: Surveys,
    SurveysResults: SurveysResults
};
