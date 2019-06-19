// Added by Kushal parekh 27-11-2018 for adding CMS Dashboard module - start
const express = require('express');
const router = express.Router();
const urlPath = require('url');
var logHelper = require('../../../../../helper/logHelper');
var errorLog = logHelper.errorLog;
var responseLog = logHelper.responseLog;
var requestLog = logHelper.requestLog;

// Page model
const Page = require('../../../../../models/Page/index');

// Load ContactUs model
const ContactUs = require('../../../../../models/ContactUs/index');

// Faq Category model
const FaqCategories = require('../../../../../models/FaqCategory/index');

// Faq Question model
const FaqQuestions = require('../../../../../models/FaqQuestion/index');

// News model
const News = require('../../../../../models/News/index');

// Survey model Added by Jayesh 29-12-2018
const Surveys = require('../../../../../models/Surveys/index');

// Region model
const Region = require('../../../../../models/Regions/index');

// Help Manual Module model
const HelpManualModules = require('../../../../../models/HelpManualModule/index');

// Help Manuals model
const HelpManuals = require('../../../../../models/HelpManual/index');

//for cross origin error
const app = express();
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );
  next();
});

// @route   GET api/private/v1/cmsdashboard
// @desc    Retrieve all count for Pages, News, Faq Category, Faq Question
// @access  Public
router.get('/', function (req, res) {
  var q = urlPath.parse(req.url, true).query;
  var APIRequest = {};
  APIRequest.params = req.params;
  APIRequest.query = q;

  var count = {}
  requestLog(APIRequest, "ListPages");
  try {

    Page.countDocuments({})
      .then(pagecount => {
        count.page = pagecount;
      });

    FaqCategories.countDocuments({})
      .then(categorycount => {
        count.faqcategory = categorycount;
      });

    FaqQuestions.countDocuments({})
      .then(questioncount => {
        count.faqquestion = questioncount;
      });

    ContactUs.countDocuments({})
      .then(contactuscount => {
        count.contactus = contactuscount;
      });

    News.countDocuments({})
      .then(newscount => {
        count.news = newscount;
      });

    Region.countDocuments({})
      .then(regioncount => {
        count.region = regioncount;
      });

    HelpManualModules.countDocuments({})
      .then(helpmodulecount => {
        count.helpmodule = helpmodulecount;
      });

    HelpManuals.countDocuments({})
      .then(helpmanualcount => {
        count.helpmanual = helpmanualcount;
      });

    //Added by Jayesh 29-12-2018
    Surveys.Surveys.countDocuments({})
      .then(surveycount => {
        count.allsurvey = surveycount;

        res.status(200);
        res.json({
          responseCode: 0,
          isError: false,
          message: "Request Success",
          data: count
        });
        res.end();

        responseLog({ responseCode: 0, isError: false, message: '', data: count }, "DashboardData");

      });

  } catch (err) {
    errorLog(err, "DashboardData");
    res.status(500);
    res.json({
      responseCode: 9,
      isError: true,
      errors: { "message": "common.api.internalerror" },
      message: err,
      data: ''
    });
    res.end();
  }
});

module.exports = router;
// Added by Kushal parekh 27-11-2018 for adding CMS Dashboard module - start