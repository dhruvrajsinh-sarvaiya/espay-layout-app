// Added by Kushal parekh 010-01-2019 for adding Help Manual - start
const express = require('express');
const router = express.Router();
const urlPath = require('url');
var logHelper = require('../../../../../helper/logHelper');
var errorLog = logHelper.errorLog;
var responseLog = logHelper.responseLog;
var requestLog = logHelper.requestLog;

// Help Manuals model
const HelpManuals = require('../../../../../models/HelpManual/index');

// Validation
const validateHelpManuals = require('../../../../../validation/helpmanual');

// @route   GET api/private/v1/helpmanual
// @desc    Retrieve all Help Manual
// @access  Public
router.get('/', function (req, res) {
  var q = urlPath.parse(req.url, true).query;
  var APIRequest = {};
  APIRequest.params = req.params;
  APIRequest.referer = req.headers['referer'];
  APIRequest.query = q;
  APIRequest.body = req.body;
  requestLog(APIRequest, "ListHelpManual");
  try {
    HelpManuals.find().populate('module_id')
      .then(helpmanuals => {
        res.status(200);
        res.json({
          responseCode: 0,
          isError: false,
          message: "Request Success",
          data: helpmanuals
        });
        res.end();
        responseLog({ responseCode: 0, isError: false, message: '', data: helpmanuals }, "ListHelpManual");
      })
      .catch(err => {
        res.status(500);
        res.json({
          responseCode: 9,
          isError: true,
          errors: { "message": "common.api.internalerror" },
          message: err.message || "Some error occurred while retrieving ListHelpManual."
        });
        res.end();
        errorLog(err, "ListHelpManual");
      });
  } catch (err) {
    errorLog(err, "ListHelpManual");
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

// @route   POST api/private/v1/helpmanual/addHelpManual
// @desc    Add Help Manual 
// @body    { "locale" : "","module_id":"",sort_order":"","status":""}
// @access  Public
router.post('/addHelpManual', function (req, res) {
  var q = urlPath.parse(req.url, true).query;
  var APIRequest = {};
  APIRequest.params = req.params;
  APIRequest.referer = req.headers['referer'];
  APIRequest.query = q;
  APIRequest.body = req.body;
  requestLog(APIRequest, "addHelpManual");
  try {
    //Check Validation
    const { errors, isValid } = validateHelpManuals.validateHelpManualInput(req.body.helpmanualdata);
    if (isValid) {
      return res.status(400).json({ responseCode: 1, isError: true, message: "Validation Failed", errors: errors }).end();
    }

    HelpManuals.countDocuments({}, function (err, totalhelpmanual) {
      if (err) {
        errorLog(err, "addHelpManual");
        return res.status(500).json({
          responseCode: 1,
          isError: true,
          errors: { "message": "common.api.internalerror" },
          message: '',
        }).end();
      }

      HelpManuals.findOne({}, {}, { sort: { 'manual_id': -1 } }).then(manual => {
        if (totalhelpmanual == 0)
          masterId = 1;
        else
          masterId = (parseInt(manual.manual_id) + 1);
        const helpmanuals = new HelpManuals({
          manual_id: masterId,
          locale: req.body.helpmanualdata.locale,
          module_id: req.body.helpmanualdata.module_id,
          sort_order: req.body.helpmanualdata.sort_order,
          status: req.body.helpmanualdata.status,
          date_created: new Date(),
          date_modified: new Date(),
          created_by: '',
          modified_by: ''
        });

        // Save Help Manual in the database
        helpmanuals.save()
          .then(data => {
            res.status(200).send({ responseCode: 0, isError: false, message: 'addHelpManual added successfullly.' });
            responseLog({ responseCode: 0, isError: false, message: 'addHelpManual added successfullly.', data: helpmanuals }, "addHelpManual");
          }).catch(err => {
            res.status(500).send({
              responseCode: 1,
              errors: {},
              isError: true,
              message: err.message || "Some error occurred while creating the addHelpManual."
            });
            errorLog(err, "addHelpManual");
          });
      }).catch(err => {
        res.status(500).send({
          responseCode: 9,
          errors: { "message": "common.api.internalerror" },
          isError: true,
          message: err.message || "Some error occurred while retrieving addHelpManual."
        });
        errorLog(err, "addHelpManual");
      });
    });
  } catch (err) {
    errorLog(err, "addHelpManual");
    res.status(400).send({ responseCode: 1, errors: {}, isError: true, message: err });
  }
});


// @route   GET api/private/v1/helpmanual/getHelpManualById/:helpmanualId
// @desc    Retrieve a single helpmanual with helpmanualId 
// @access  Public
router.get('/getHelpManualById/:helpmanualId', function (req, res) {

  var q = urlPath.parse(req.url, true).query;
  var APIRequest = {};
  APIRequest.params = req.params;
  APIRequest.referer = req.headers['referer'];
  APIRequest.query = q;
  APIRequest.body = req.body;
  requestLog(APIRequest, "GetHelpManualById");

  try {
    const { errors, isValid } = validateHelpManuals.validateGetHelpManualByIdInput(req.params);

    //Check Validation
    if (isValid) {
      return res.status(400).json({ responseCode: 1, isError: true, message: "Validation Failed", errors: errors }).end();
    }

    HelpManuals.findOne({ _id: req.params.helpmanualId })
      .then(helpmanuals => {

        if (!helpmanuals) {
          return res.status(404).send({
            responseCode: 1, isError: true,
            message: "HelpManual not found with id " + req.params.helpmanualId
          });
        }
        res.status(200).send({ responseCode: 0, isError: false, message: 'HelpManual Get successfullly.', data: helpmanuals });
        responseLog({ responseCode: 0, isError: false, message: '', data: helpmanuals }, "GetHelpManualById");
      }).catch(err => {
        if (err.kind === 'ObjectId') {
          return res.status(404).send({
            responseCode: 1, errors: {}, isError: true,
            message: "HelpManual not found with id " + req.params.helpmanualId
          });
        }
        errorLog(err, "GetHelpManualById");
        return res.status(500).send({
          responseCode: 9, isError: true, errors: { "message": "common.api.internalerror" },
          message: "Error retrieving HelpManual with id " + req.params.helpmanualId
        });
      });
  } catch (err) {
    errorLog(err, "GetHelpManualById");
    res.status(400).send({ responseCode: 1, errors: {}, isError: true, message: err });
  }
});


// @route   PUT api/private/v1/helpmanual/editHelpManual
// @desc    Update a help manual with helpmanualId 
// @body   { "id":"", "locale" : "","module_id","","sort_order":"","status":""}
// @access  Public
router.put('/editHelpManual', function (req, res) {
  var q = urlPath.parse(req.url, true).query;
  var APIRequest = {};
  APIRequest.params = req.params;
  APIRequest.referer = req.headers['referer'];
  APIRequest.query = q;
  APIRequest.body = req.body;
  requestLog(APIRequest, "editHelpManual");

  try {
    const { errors, isValid } = validateHelpManuals.validateHelpManualInput(req.body.helpmanualdata);
    if (isValid) {
      return res.status(400).json({ responseCode: 1, isError: true, message: "Validation Failed", errors: errors }).end();
    }
    // Find Help Manual and update it with the requested module_id
    HelpManuals.findOneAndUpdate({ _id: req.body.helpmanualdata.id }, {
      locale: req.body.helpmanualdata.locale,
      category_id: req.body.helpmanualdata.category_id,
      sort_order: req.body.helpmanualdata.sort_order,
      status: req.body.helpmanualdata.status,
      date_modified: new Date(),
      modified_by: ''
    }, { new: true })
      .then(helpmanuals => {
        if (!helpmanuals) {
          return res.status(400).send({
            responseCode: 1, isError: true, message: "Help Manual not found with id " + req.body.helpmanualdata.id, errors: {},
          });
        }

        res.status(200).json({ responseCode: 0, isError: false, message: 'Help Manual Edit successfullly.' });
        responseLog({ responseCode: 0, isError: false, message: 'Help Manual Edit successfullly.', data: helpmanuals }, "editHelpManual");

      }).catch(err => {

        errorLog(err, "editHelpManual");
        return res.status(500).send({
          responseCode: 9, isError: true, errors: { "message": "common.api.internalerror" },
          message: "Error updating Help Manual with id " + req.body.helpmanualdata.id
        });
      });
  } catch (err) {
    errorLog(err, "editHelpManual");
    res.status(400).send({ responseCode: 1, isError: true, errors: {}, message: err });
  }
});


// @route   DELETE api/private/v1/helpmanual/deleteHelpManual/:helpmanualId
// @desc    Delete a Help Manual with helpmanualId 
// @access  Public
router.delete('/deleteHelpManual/:helpmanualId', function (req, res) {

  var q = urlPath.parse(req.url, true).query;
  var APIRequest = {};
  APIRequest.params = req.params;
  APIRequest.referer = req.headers['referer'];
  APIRequest.query = q;
  APIRequest.body = req.body;
  requestLog(APIRequest, "DeleteHelpManual");

  try {

    const { errors, isValid } = validateHelpManuals.validateDeleteHelpManualInput(req.params);

    // Check Validation
    if (isValid) {
      return res.status(400).send({ responseCode: 1, isError: true, message: errors });
    }

    HelpManuals.findOneAndDelete({ _id: req.params.helpmanualId })
      .then(helpmanuals => {

        if (!helpmanuals) {
          return res.status(404).send({
            responseCode: 1, isError: true,
            message: "Help Manual not found with id " + req.params.helpmanualId
          });
        }

        res.status(200).json({ responseCode: 0, isError: false, message: 'Help Manual deleted successfully.' });
        responseLog({ responseCode: 0, isError: false, message: 'Help Manual deleted Successfully.', data: helpmanuals }, "DeleteHelpManual");

      }).catch(err => {

        errorLog(err, "DeleteHelpManual");
        return res.status(500).send({
          responseCode: 9, isError: true, errors: { "message": "common.api.internalerror" },
          message: "Could not delete Help Manual with id " + req.params.helpmanualId
        });
      });

  } catch (err) {
    errorLog(err, "DeleteHelpManual");
    res.status(400).send({ responseCode: 1, isError: true, message: err, data: '' });
  }
});

// Added Front side api calls with validation by Jayesh 09-01-2019 
// @route   POST api/private/v1/helpmanual/getHelpManualByModuleId/:moduleId
// @desc    Retrieve a single helpmanualmodule details with moduleId 
// @access  Public
router.get('/getHelpManualByModuleId/:moduleId', function (req, res) {

  var q = urlPath.parse(req.url, true).query;
  var APIRequest = {};
  APIRequest.params = req.params;
  APIRequest.referer = req.headers['referer'];
  APIRequest.query = q;
  APIRequest.body = req.body;
  requestLog(APIRequest, "GetHelpManualByModuleId");

  try {

    const { errors, isValid } = validateHelpManuals.validateGetHelpManualByModuleIdInput(req.params);

    // Check Validation
    if (!isValid) {
      return res.status(400).json({
        responseCode: 1,
        isError: true,
        message: '', errors: errors
      }).end();
    }

    HelpManuals.find({ module_id: req.params.moduleId }).populate("module_id").sort('sort_order')
      .then(manualdata => {

        if (!manualdata) {
          return res.status(400).json({
            responseCode: 1,
            isError: true,
            message: '',
            errors: "common.api.datanotfound " + req.params.moduleId
          }).end();
        }

        res.status(200).json({ responseCode: 0, isError: false, message: '', data: manualdata });
        responseLog({ responseCode: 0, isError: false, message: '', data: manualdata }, "GetHelpManualByModuleId");

      }).catch(err => {

        errorLog(err, "GetHelpManualByModuleId");
        return res.status(500).json({
          responseCode: 1,
          isError: true,
          message: '',
          errors: err.message || "common.api.fetcherror"
        }).end();
      });

  } catch (err) {
    errorLog(err, "GetHelpManualByModuleId");
    return res.status(400).json({
      responseCode: 9,
      isError: true,
      message: '', errors: err.message || "common.api.internalerror"
    }).end();
  }
});

//Added by Dhara gajera 17/1/2019
// @route   GET api/private/v1/helpmanual/helpmanualCount
// @desc    Retrieve all count for helpmanual and helpmanual module
// @access  Public
router.get('/helpmanualCount', function (req, res) {
  var q = urlPath.parse(req.url, true).query;
  var APIRequest = {};
  APIRequest.params = req.params;
  APIRequest.referer = req.headers['referer'];
  APIRequest.query = q;
  APIRequest.body = req.body;
  requestLog(APIRequest, "helpmanualCount");
  var count = {}
  try {
    HelpManuals.count({}).then(helpManuals => {
      count.HelpManuals = helpManuals;

      if (typeof count.HelpManuals != "undefined" && count.HelpManuals != null) {
        HelpManualModules.count({}).then(HelpManualModulescount => {
          count.HelpManualModulescount = HelpManualModulescount;
          res.status(200);
          res.json({
            responseCode: 0,
            isError: false,
            message: "Request Success",
            data: count
          });
          res.end();
          responseLog({ responseCode: 0, isError: false, message: '', data: count }, "helpmanualCount");
        });
      }
    });
  } catch (err) {
    errorLog(err, "helpmanualCount");
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
// Added by Kushal Parekh 10-01-2019 for adding Help Manual - start