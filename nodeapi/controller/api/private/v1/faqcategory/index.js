// Added by Kushal parekh 20-10-2018 for adding Faq Category module - start
const express = require('express');
const router = express.Router();
const urlPath = require('url');
var logHelper = require('../../../../../helper/logHelper');
var errorLog = logHelper.errorLog;
var responseLog = logHelper.responseLog;
var requestLog = logHelper.requestLog;

// Faq Category model
const FaqCategories = require('../../../../../models/FaqCategory/index');

// Faq Question model
const FaqQuestions = require('../../../../../models/FaqQuestion/index');

// Validation
const validateFaqCategories = require('../../../../../validation/faqcategories');

// @route   GET api/private/v1/faqcategory
// @desc    Retrieve all Faq Category
// @access  Public
router.get('/', function (req, res) {
  var q = urlPath.parse(req.url, true).query;
  var APIRequest = {};
  APIRequest.params = req.params;
  APIRequest.referer = req.headers['referer'];
  APIRequest.query = q;
  APIRequest.body = req.body;
  requestLog(APIRequest, "ListFaqcategory");

  try {
    FaqCategories.find()
      .then(faqcategories => {
        res.status(200);
        res.json({
          responseCode: 0,
          isError: false,
          message: "Request Success",
          data: faqcategories
        });
        res.end();
        responseLog({ responseCode: 0, isError: false, message: '', data: faqcategories }, "ListFaqcategory");
      })
      .catch(err => {
        res.status(500);
        res.json({
          responseCode: 9,
          isError: true,
          errors: { "message": "common.api.internalerror" },
          message: err.message || "Some error occurred while retrieving ListFaqcategory."
        });
        res.end();
        errorLog(err, "ListFaqcategory");
      });
  } catch (err) {
    errorLog(err, "ListFaqcategory");
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

// @route   POST api/private/v1/addFaqCategory
// @desc    Add Faq Category  
// @body    { "locale" : "","sort_order":"","status":""}
// @access  Public
router.post('/addFaqCategory', function (req, res) {
  var q = urlPath.parse(req.url, true).query;
  var APIRequest = {};
  APIRequest.params = req.params;
  APIRequest.referer = req.headers['referer'];
  APIRequest.query = q;
  APIRequest.body = req.body;
  requestLog(APIRequest, "addFaqCategory");

  try {
    //Check Validation
    const { errors, isValid } = validateFaqCategories.validateFaqCategoryInput(req.body.faqcategorydata);

    if (isValid) {
      return res.status(400).json({ responseCode: 1, isError: true, message: "Validation Failed", errors: errors }).end();
    }
    FaqCategories.countDocuments({}, function (err, totalcategory) {
      if (err) {
        errorLog(err, "addFaqQuestion");
        return res.status(500).json({
          responseCode: 1,
          isError: true,
          message: '',
          errors: { "message": "common.api.internalerror" }
        }).end();
      }

      FaqCategories.findOne({}, {}, { sort: { 'category_id': -1 } }).then(category => {
        if (totalcategory == 0)
          masterId = 1;
        else
          masterId = parseInt(category.category_id) + 1;
        const faqcategories = new FaqCategories({
          category_id: masterId,
          locale: req.body.faqcategorydata.locale,
          sort_order: req.body.faqcategorydata.sort_order,
          status: req.body.faqcategorydata.status,
          date_created: new Date(),
          date_modified: new Date(),
          created_by: '',
          modified_by: ''
        });

        // Save Faq Category in the database
        faqcategories.save()
          .then(data => {
            res.status(200).send({ responseCode: 0, isError: false, message: 'addFaqCategory added successfullly.' });
            responseLog({ responseCode: 0, isError: false, message: 'addFaqCategory added successfullly.', data: faqcategories }, "addFaqCategory");
          }).catch(err => {
            res.status(500).send({
              responseCode: 9,
              errors: { "message": "common.api.internalerror" },
              isError: true,
              message: err.message || "Some error occurred while creating the addFaqCategory."
            });
            errorLog(err, "addFaqCategory");
          });
      }).catch(err => {
        res.status(500).send({
          responseCode: 9,
          errors: { "message": "common.api.internalerror" },
          isError: true,
          message: err.message || "Some error occurred while retrieving addFaqCategory."
        });
        errorLog(err, "addFaqCategory");
      });
    });
  } catch (err) {
    errorLog(err, "addFaqCategory");
    res.status(400).send({ responseCode: 1, errors: {}, isError: true, message: err });
  }
});

// @route   GET api/private/v1/faqcategory/getFaqCategoryById/:faqcategoryId
// @desc    Retrieve a single faqcategory with faqcategoryId 
// @access  Public
router.get('/getFaqCategoryById/:faqcategoryId', function (req, res) {
  var q = urlPath.parse(req.url, true).query;
  var APIRequest = {};
  APIRequest.params = req.params;
  APIRequest.referer = req.headers['referer'];
  APIRequest.query = q;
  APIRequest.body = req.body;
  requestLog(APIRequest, "GetFaqCategoryById");
  try {
    const { errors, isValid } = validateFaqCategories.validateGetFaqcategoryByIdInput(req.params);

    //Check Validation
    if (isValid) {
      return res.status(400).json({ responseCode: 1, isError: true, message: "Validation Failed", errors: errors }).end();
    }

    FaqCategories.findOne({ _id: req.params.faqcategoryId })
      .then(faqcategories => {

        if (!faqcategories) {
          return res.status(404).send({
            responseCode: 1, isError: true,
            message: "FaqCategory not found with id " + req.params.faqcategoryId
          });
        }
        res.status(200).send({ responseCode: 0, isError: false, message: 'FaqCategory Get successfullly.', data: faqcategories });
        responseLog({ responseCode: 0, isError: false, message: '', data: faqcategories }, "GetFaqCategoryById");
      }).catch(err => {
        if (err.kind === 'ObjectId') {
          return res.status(404).send({
            responseCode: 1, errors: {}, isError: true,
            message: "FaqCategory not found with id " + req.params.faqcategoryId
          });
        }
        errorLog(err, "GetFaqCategoryById");
        return res.status(500).send({
          responseCode: 9, isError: true, errors: { "message": "common.api.internalerror" },
          message: "Error retrieving FaqCategory with id " + req.params.faqcategoryId
        });
      });
  } catch (err) {
    errorLog(err, "GetFaqCategoryById");
    res.status(400).send({ responseCode: 1, errors: {}, isError: true, message: err });
  }
});

// @route   PUT api/private/v1/faqcategory/editFaqCategory
// @desc    Update a faq category with faqcategoryId 
// @body   { "id":"", "locale" : "","sort_order":"","status":""}
// @access  Public
router.put('/editFaqCategory', function (req, res) {

  var q = urlPath.parse(req.url, true).query;
  var APIRequest = {};
  APIRequest.params = req.params;
  APIRequest.referer = req.headers['referer'];
  APIRequest.query = q;
  APIRequest.body = req.body;
  requestLog(APIRequest, "editFaqCategory");

  try {
    const { errors, isValid } = validateFaqCategories.validateFaqCategoryInput(req.body.faqcategorydata);
    if (isValid) {
      return res.status(400).json({ responseCode: 1, isError: true, message: "Validation Failed", errors: errors }).end();
    }
    // Find Faq Category and update it with the requested category_id
    FaqCategories.findOneAndUpdate({ _id: req.body.faqcategorydata.id }, {
      locale: req.body.faqcategorydata.locale,
      sort_order: req.body.faqcategorydata.sort_order,
      status: req.body.faqcategorydata.status,
      date_modified: new Date(),
      modified_by: ''
    }, { new: true })
      .then(faqcategories => {
        if (!faqcategories) {
          return res.status(400).send({
            responseCode: 1, isError: true, message: "Faq Category not found with id " + req.body.faqcategorydata.id, errors: {},
          });
        }

        res.status(200).json({ responseCode: 0, isError: false, message: 'Faq Category Edit successfullly.' });
        responseLog({ responseCode: 0, isError: false, message: 'Faq Category Edit successfullly.', data: faqcategories }, "editFaqCategory");

      }).catch(err => {

        errorLog(err, "editFaqCategory");
        return res.status(500).send({
          responseCode: 9, isError: true, errors: { "message": "common.api.internalerror" },
          message: "Error updating Faq Category with id " + req.body.faqcategorydata.id
        });
      });

  } catch (err) {
    errorLog(err, "editFaqCategory");
    res.status(400).send({ responseCode: 1, isError: true, errors: {}, message: err });
  }
});

// @route   DELETE api/private/v1/faqcategory/deleteFaqCategory/:faqcategoryId
// @desc    Delete a FaqCategory with faqcategoryId 
// @access  Public
router.delete('/deleteFaqCategory/:faqcategoryId', function (req, res) {

  var q = urlPath.parse(req.url, true).query;
  var APIRequest = {};
  APIRequest.params = req.params;
  APIRequest.referer = req.headers['referer'];
  APIRequest.query = q;
  APIRequest.body = req.body;
  requestLog(APIRequest, "DeleteFaqCategory");

  try {
    const { errors, isValid } = validateFaqCategories.validateDeleteFaqCategoryInput(req.params);
    // Check Validation
    if (isValid) {
      return res.status(400).send({ responseCode: 1, isError: true, message: errors });
    }

    FaqQuestions.countDocuments({ category_id: req.params.faqcategoryId }, function (err, totalquestion) {

      if (err) {
        errorLog(err, "DeleteFaqCategory");
        return res.status(500).json({
          responseCode: 1,
          isError: true,
          message: '',
          errors: { "message": "common.api.internalerror" }
        }).end();
      }
      if (totalquestion > 0) {
        res.status(400).json({ responseCode: 1, isError: true, errors: { "message": "faqcategory.alreadyassign" }, message: 'You can not delete category' });
        responseLog({ responseCode: 1, isError: true, message: 'You can not delete category' }, "DeleteFaqCategory");
      }
      else {
        FaqCategories.findOneAndDelete({ _id: req.params.faqcategoryId })
          .then(faqcategories => {

            if (!faqcategories) {
              return res.status(404).send({
                responseCode: 1, isError: true,
                message: "Faq Category not found with id " + req.params.faqcategoryId
              });
            }

            res.status(200).json({ responseCode: 0, isError: false, message: 'Faq Category deleted successfully.' });
            responseLog({ responseCode: 0, isError: false, message: 'Faq Category deleted Successfully.', data: faqcategories }, "DeleteFaqCategory");

          }).catch(err => {

            errorLog(err, "DeleteFaqCategory");
            return res.status(500).send({
              responseCode: 9, isError: true, errors: { "message": "common.api.internalerror" },
              message: "Could not delete Faq Category with id " + req.params.faqcategoryId
            });
          });
      }
    });
  } catch (err) {
    errorLog(err, "DeleteFaqCategory");
    res.status(400).send({ responseCode: 1, isError: true, message: err, data: '' });
  }
});

// @route   GET api/private/v1/faqcategory/getActiveFaqCategory
// @desc    Retrieve all Active FaqCategory
// @access  Public
router.get('/getActiveFaqCategory', function (req, res) {
  var q = urlPath.parse(req.url, true).query;
  var APIRequest = {};
  APIRequest.params = req.params;
  APIRequest.referer = req.headers['referer'];
  APIRequest.query = q;
  APIRequest.body = req.body;
  requestLog(APIRequest, "ListFaqCategory");
  try {
    FaqCategories.find({ status: 1 })
      .sort({ sort_order: 'asc' })
      .then(faqcategories => {
        res.status(200);
        res.json({
          responseCode: 0,
          isError: false,
          message: "Request Success",
          data: faqcategories
        });
        res.end();
        responseLog({ responseCode: 0, isError: false, message: '', data: faqcategories }, "ListFaqCategory");
      })
      .catch(err => {
        res.status(500);
        res.json({
          responseCode: 1,
          isError: true,
          message: err.message || "Some error occurred while retrieving News."
        });
        res.end();
        errorLog(err, "ListFaqCategory");
      });
  } catch (err) {
    errorLog(err, "ListFaqCategory");
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

module.exports = router;
// Added by Kushal Parekh 20-10-2018 for adding faq Category module - start