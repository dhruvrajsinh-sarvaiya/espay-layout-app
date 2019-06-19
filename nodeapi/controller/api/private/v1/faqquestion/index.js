// Added by Kushal parekh 20-10-2018 for adding Faq Question module - start
const express = require('express');
const router = express.Router();
const urlPath = require('url');
var logHelper = require('../../../../../helper/logHelper');
var errorLog = logHelper.errorLog;
var responseLog = logHelper.responseLog;
var requestLog = logHelper.requestLog;

// Faq Question model
const FaqQuestions = require('../../../../../models/FaqQuestion/index');

// Validation
const validateFaqQuestions = require('../../../../../validation/faqquestions');

// @route   GET api/private/v1/faqquestion
// @desc    Retrieve all Faq Question
// @access  Public
router.get('/', function (req, res) {
  var q = urlPath.parse(req.url, true).query;
  var APIRequest = {};
  APIRequest.params = req.params;
  APIRequest.referer = req.headers['referer'];
  APIRequest.query = q;
  APIRequest.body = req.body;
  requestLog(APIRequest, "ListFaqQuestion");
  try {
    FaqQuestions.find().populate('category_id')
      .then(faqquestions => {
        res.status(200);
        res.json({
          responseCode: 0,
          isError: false,
          message: "Request Success",
          data: faqquestions
        });
        res.end();
        responseLog({ responseCode: 0, isError: false, message: '', data: faqquestions }, "ListFaqQuestion");
      })
      .catch(err => {
        res.status(500);
        res.json({
          responseCode: 9,
          isError: true,
          errors: { "message": "common.api.internalerror" },
          message: err.message || "Some error occurred while retrieving ListFaqQuestion."
        });
        res.end();
        errorLog(err, "ListFaqQuestion");
      });
  } catch (err) {
    errorLog(err, "ListFaqQuestion");
    res.status(400);
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

// @route   POST api/private/v1/addFaqQuestion
// @desc    Add Faq Question  
// @body    { "locale" : "","category_id":"",sort_order":"","status":""}
// @access  Public
router.post('/addFaqQuestion', function (req, res) {
  var q = urlPath.parse(req.url, true).query;
  var APIRequest = {};
  APIRequest.params = req.params;
  APIRequest.referer = req.headers['referer'];
  APIRequest.query = q;
  APIRequest.body = req.body;
  requestLog(APIRequest, "addFaqQuestion");

  try {
    //Check Validation
    const { errors, isValid } = validateFaqQuestions.validateFaqQuestionInput(req.body.faqquestiondata);
    if (isValid) {
      return res.status(400).json({ responseCode: 1, isError: true, message: "Validation Failed", errors: errors }).end();
    }
    FaqQuestions.countDocuments({}, function (err, totalquestion) {
      if (err) {
        errorLog(err, "addFaqQuestion");
        return res.status(500).json({
          responseCode: 1,
          isError: true,
          message: '',
          errors: { "message": "common.api.internalerror" }
        }).end();
      }
      FaqQuestions.findOne({}, {}, { sort: { 'question_id': -1 } }).then(question => {
        if (totalquestion == 0)
          masterId = 1;
        else
          masterId = parseInt(question.question_id) + 1;
        const faqquestions = new FaqQuestions({
          question_id: masterId,
          locale: req.body.faqquestiondata.locale,
          category_id: req.body.faqquestiondata.category_id,
          sort_order: req.body.faqquestiondata.sort_order,
          status: req.body.faqquestiondata.status,
          date_created: new Date(),
          date_modified: new Date(),
          created_by: '',
          modified_by: ''
        });

        // Save Faq Question in the database
        faqquestions.save()
          .then(data => {
            res.status(200).send({ responseCode: 0, isError: false, message: 'addFaqQuestion added successfullly.' });
            responseLog({ responseCode: 0, isError: false, message: 'addFaqQuestion added successfullly.', data: faqquestions }, "addFaqQuestion");
          }).catch(err => {
            res.status(500).send({
              responseCode: 1,
              errors: {},
              isError: true,
              message: err.message || "Some error occurred while creating the addFaqQuestion."
            });
            errorLog(err, "addFaqQuestion");
          });
      }).catch(err => {
        res.status(500).send({
          responseCode: 9,
          errors: { "message": "common.api.internalerror" },
          isError: true,
          message: err.message || "Some error occurred while retrieving addFaqQuestion."
        });
        errorLog(err, "addFaqQuestion");
      });
    });
  } catch (err) {
    errorLog(err, "addFaqQuestion");
    res.status(400).send({ responseCode: 1, errors: {}, isError: true, message: err });
  }
});


// @route   GET api/private/v1/faqquestion/getFaqQuestionById/:faqquestionId
// @desc    Retrieve a single faqquestion with faqquestionId 
// @access  Public
router.get('/getFaqQuestionById/:faqquestionId', function (req, res) {

  var q = urlPath.parse(req.url, true).query;
  var APIRequest = {};
  APIRequest.params = req.params;
  APIRequest.referer = req.headers['referer'];
  APIRequest.query = q;
  APIRequest.body = req.body;
  requestLog(APIRequest, "GetFaqQuestionById");

  try {
    const { errors, isValid } = validateFaqQuestions.validateGetFaqQuestionByIdInput(req.params);

    //Check Validation
    if (isValid) {
      return res.status(400).json({ responseCode: 1, isError: true, message: "Validation Failed", errors: errors }).end();
    }

    FaqQuestions.findOne({ _id: req.params.faqquestionId })
      .then(faqquestions => {

        if (!faqquestions) {
          return res.status(404).send({
            responseCode: 1, isError: true,
            message: "FaqQuestion not found with id " + req.params.faqquestionId
          });
        }
        res.status(200).send({ responseCode: 0, isError: false, message: 'FaqQuestion Get successfullly.', data: faqquestions });
        responseLog({ responseCode: 0, isError: false, message: '', data: faqquestions }, "GetFaqQuestionById");
      }).catch(err => {
        if (err.kind === 'ObjectId') {
          return res.status(404).send({
            responseCode: 1, errors: {}, isError: true,
            message: "FaqQuestion not found with id " + req.params.faqquestionId
          });
        }
        errorLog(err, "GetFaqQuestionById");
        return res.status(500).send({
          responseCode: 9, isError: true, errors: { "message": "common.api.internalerror" },
          message: "Error retrieving FaqQuestion with id " + req.params.faqquestionId
        });
      });
  } catch (err) {
    errorLog(err, "GetFaqQuestionById");
    res.status(400).send({ responseCode: 1, errors: {}, isError: true, message: err });
  }
});


// @route   PUT api/private/v1/faqquestion/editFaqQuestion
// @desc    Update a faq question with faqquestionId 
// @body   { "id":"", "locale" : "","category_id","","sort_order":"","status":""}
// @access  Public
router.put('/editFaqQuestion', function (req, res) {

  var q = urlPath.parse(req.url, true).query;
  var APIRequest = {};
  APIRequest.params = req.params;
  APIRequest.referer = req.headers['referer'];
  APIRequest.query = q;
  APIRequest.body = req.body;
  requestLog(APIRequest, "editFaqQuestion");

  try {
    const { errors, isValid } = validateFaqQuestions.validateFaqQuestionInput(req.body.faqquestiondata);
    if (isValid) {
      return res.status(400).json({ responseCode: 1, isError: true, message: "Validation Failed", errors: errors }).end();
    }
    // Find Faq Question and update it with the requested question_id
    FaqQuestions.findOneAndUpdate({ _id: req.body.faqquestiondata.id }, {
      locale: req.body.faqquestiondata.locale,
      category_id: req.body.faqquestiondata.category_id,
      sort_order: req.body.faqquestiondata.sort_order,
      status: req.body.faqquestiondata.status,
      date_modified: new Date(),
      modified_by: ''
    }, { new: true })
      .then(faqquestions => {
        if (!faqquestions) {
          return res.status(400).send({
            responseCode: 1, isError: true, message: "Faq Question not found with id " + req.body.faqquestiondata.id, errors: {},
          });
        }

        res.status(200).json({ responseCode: 0, isError: false, message: 'Faq Question Edit successfullly.' });
        responseLog({ responseCode: 0, isError: false, message: 'Faq Question Edit successfullly.', data: faqquestions }, "editFaqQuestion");

      }).catch(err => {

        errorLog(err, "editFaqQuestion");
        return res.status(500).send({
          responseCode: 9, isError: true, errors: { "message": "common.api.internalerror" },
          message: "Error updating Faq Question with id " + req.body.faqquestiondata.id
        });
      });

  } catch (err) {

    errorLog(err, "editFaqQuestion");
    res.status(400).send({ responseCode: 1, isError: true, errors: {}, message: err });

  }
});


// @route   DELETE api/private/v1/faqquestion/deleteFaqQuestion/:faqquestionId
// @desc    Delete a FaqQuestion with faqquestionId 
// @access  Public
router.delete('/deleteFaqQuestion/:faqquestionId', function (req, res) {

  var q = urlPath.parse(req.url, true).query;
  var APIRequest = {};
  APIRequest.params = req.params;
  APIRequest.referer = req.headers['referer'];
  APIRequest.query = q;
  APIRequest.body = req.body;
  requestLog(APIRequest, "DeleteFaqQuestion");

  try {

    const { errors, isValid } = validateFaqQuestions.validateDeleteFaqQuestionInput(req.params);

    // Check Validation
    if (isValid) {
      return res.status(400).send({ responseCode: 1, isError: true, message: errors });
    }

    FaqQuestions.findOneAndDelete({ _id: req.params.faqquestionId })
      .then(faqquestions => {

        if (!faqquestions) {
          return res.status(404).send({
            responseCode: 1, isError: true,
            message: "Faq Question not found with id " + req.params.faqquestionId
          });
        }

        res.status(200).json({ responseCode: 0, isError: false, message: 'Faq Question deleted successfully.' });
        responseLog({ responseCode: 0, isError: false, message: 'Faq Question deleted Successfully.', data: faqquestions }, "DeleteFaqQuestion");

      }).catch(err => {

        errorLog(err, "DeleteFaqQuestion");
        return res.status(500).send({
          responseCode: 9, isError: true, errors: { "message": "common.api.internalerror" },
          message: "Could not delete Faq Question with id " + req.params.faqquestionId
        });
      });

  } catch (err) {
    errorLog(err, "DeleteFaqQuestion");
    res.status(400).send({ responseCode: 1, isError: true, message: err, data: '' });
  }
});

// @route   GET api/private/v1/faqquestion/getActiveFaqQuestion
// @desc    Retrieve all Active FaqQuestion
// @access  Public
router.get('/getActiveFaqQuestion', function (req, res) {
  var q = urlPath.parse(req.url, true).query;
  var APIRequest = {};
  APIRequest.params = req.params;
  APIRequest.referer = req.headers['referer'];
  APIRequest.query = q;
  APIRequest.body = req.body;
  requestLog(APIRequest, "ListFaqQuestion");
  try {
    FaqQuestions.find({ status: 1 })
      .sort({ sort_order: 'asc' })
      .then(faqquestions => {
        res.status(200);
        res.json({
          responseCode: 0,
          isError: false,
          message: "Request Success",
          data: faqquestions
        });
        res.end();
        responseLog({ responseCode: 0, isError: false, message: '', data: faqquestions }, "ListFaqQuestion");
      })
      .catch(err => {
        res.status(500);
        res.json({
          responseCode: 1,
          isError: true,
          message: err.message || "Some error occurred while retrieving News."
        });
        res.end();
        errorLog(err, "ListFaqQuestion");
      });
  } catch (err) {
    errorLog(err, "ListFaqQuestion");
    res.status(400);
    res.json({
      responseCode: 1,
      isError: true,
      message: err,
      data: ''
    });
    res.end();
  }
});

//Added by Dhara gajera 16/1/2019
// @route   GET api/private/v1/faqquestion/faqCount
// @desc    Retrieve all count for Pages
// @access  Public
router.get('/faqCount', function (req, res) {
  var q = urlPath.parse(req.url, true).query;
  var APIRequest = {};
  APIRequest.params = req.params;
  APIRequest.referer = req.headers['referer'];
  APIRequest.query = q;
  APIRequest.body = req.body;
  requestLog(APIRequest, "faqCount");
  var count = {}
  try {

    FaqQuestions.countDocuments({}).then(FaqQuestions => {
      count.FaqQuestions = FaqQuestions;

      if (typeof count.FaqQuestions != "undefined" && count.FaqQuestions != null) {
        FaqCategories.countDocuments({}).then(FaqCategories => {
          count.FaqCategories = FaqCategories;
          res.status(200);
          res.json({
            responseCode: 0,
            isError: false,
            message: "Request Success",
            data: count
          });
          res.end();
          responseLog({ responseCode: 0, isError: false, message: '', data: count }, "faqCount");
        });
      }
    });
  } catch (err) {
    errorLog(err, "faqCount");
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
// Added by Kushal Parekh 20-10-2018 for adding faq Question module - start