// Added by Kushal parekh 08-01-2019 for adding Help Manual module - start
const express = require('express');
const router = express.Router();
const urlPath = require('url');
var logHelper = require('../../../../../helper/logHelper');
var errorLog = logHelper.errorLog;
var responseLog = logHelper.responseLog;
var requestLog = logHelper.requestLog;

// Help Manual Module model
const HelpManualModules = require('../../../../../models/HelpManualModule/index');

// Help Manuals model
const HelpManuals = require('../../../../../models/HelpManual/index');

// Validation
const validateHelpManualModules = require('../../../../../validation/helpmanualmodule');

var DdosValidator = require('../../../../setupHelper'); // Added by Bharat Jograna on 20 Jun 2019

router.use(DdosValidator.validateDenialofService());// Added by Bharat Jograna on 20 Jun 2019

// @route   GET api/private/v1/helpmanualmodule
// @desc    Retrieve all Help manual Modules
// @access  Public
router.get('/', function (req, res) {
  var q = urlPath.parse(req.url, true).query;
  var APIRequest = {};
  APIRequest.params = req.params;
  APIRequest.referer = req.headers['referer'];
  APIRequest.query = q;
  APIRequest.body = req.body;
  requestLog(APIRequest, "ListHelpManualModule");

  try {
    HelpManualModules.find()
      .then(helpmanualmodules => {
        res.status(200);
        res.json({
          responseCode: 0,
          isError: false,
          message: "Request Success",
          data: helpmanualmodules
        });
        res.end();
        responseLog({ responseCode: 0, isError: false, message: '', data: helpmanualmodules }, "ListHelpManualModule");
      })
      .catch(err => {
        res.status(500);
        res.json({
          responseCode: 9,
          isError: true,
          errors: { "message": "common.api.internalerror" },
          message: err.message || "Some error occurred while retrieving ListHelpManualModule."
        });
        res.end();
        errorLog(err, "ListHelpManualModule");
      });
  } catch (err) {
    errorLog(err, "ListHelpManualModule");
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

// @route   POST api/private/v1/helpmanualmodule/addHelpModule
// @desc    Add Help Module
// @body    { "locale" : "","sort_order":"","status":""}
// @access  Public
router.post('/addHelpModule', function (req, res) {
  var q = urlPath.parse(req.url, true).query;
  var APIRequest = {};
  APIRequest.params = req.params;
  APIRequest.referer = req.headers['referer'];
  APIRequest.query = q;
  APIRequest.body = req.body;
  requestLog(APIRequest, "addHelpModule");

  try {
    //Check Validation
    const { errors, isValid } = validateHelpManualModules.validateHelpManualModuleInput(req.body.helpmoduledata);

    if (isValid) {
      return res.status(400).json({ responseCode: 1, isError: true, message: "Validation Failed", errors: errors }).end();
    }
    HelpManualModules.countDocuments({}, function (err, totalhelpmodule) {
      if (err) {
        errorLog(err, "addHelpManual");
        return res.status(500).json({
          responseCode: 1,
          isError: true,
          errors: { "message": "common.api.internalerror" },
          message: '',
        }).end();
      }

      HelpManualModules.findOne({}, {}, { sort: { 'module_id': -1 } }).then(module => {
        let masterId;
        if (totalhelpmodule == 0)
          masterId = 1;
        else
          masterId = (parseInt(module.module_id) + 1);
        const helpmanualmodules = new HelpManualModules({
          module_id: masterId,
          locale: req.body.helpmoduledata.locale,
          sort_order: req.body.helpmoduledata.sort_order,
          status: req.body.helpmoduledata.status,
          date_created: new Date(),
          date_modified: new Date(),
          created_by: '',
          modified_by: ''
        });

        // Save Help Module in the database
        helpmanualmodules.save()
          .then(data => {
            res.status(200).send({ responseCode: 0, isError: false, message: 'addHelpModule added successfullly.' });
            responseLog({ responseCode: 0, isError: false, message: 'addHelpModule added successfullly.', data: helpmanualmodules }, "addHelpModule");
          }).catch(error => {
            res.status(500).send({
              responseCode: 9,
              errors: { "message": "common.api.internalerror" },
              isError: true,
              message: error.message || "Some error occurred while creating the addHelpModule."
            });
            errorLog(error, "addHelpModule");
          });
      }).catch(error => {
        res.status(500).send({
          responseCode: 9,
          errors: { "message": "common.api.internalerror" },
          isError: true,
          message: error.message || "Some error occurred while retrieving addHelpModule."
        });
        errorLog(error, "addHelpModule");
      });
    });
  } catch (err) {
    errorLog(err, "addHelpModule");
    res.status(400).send({ responseCode: 1, errors: {}, isError: true, message: err });
  }
});


// @route   GET api/private/v1/helpmanualmodule/getHelpModuleById/:moduleId
// @desc    Retrieve a single help module with moduleId 
// @access  Public
router.get('/getHelpModuleById/:moduleId', function (req, res) {

  var q = urlPath.parse(req.url, true).query;
  var APIRequest = {};
  APIRequest.params = req.params;
  APIRequest.referer = req.headers['referer'];
  APIRequest.query = q;
  APIRequest.body = req.body;
  requestLog(APIRequest, "getHelpModuleById");

  try {
    const { errors, isValid } = validateHelpManualModules.validateHelpManualModuleByIdInput(req.params);

    //Check Validation
    if (isValid) {
      return res.status(400).json({ responseCode: 1, isError: true, message: "Validation Failed", errors: errors }).end();
    }

    HelpManualModules.findOne({ _id: req.params.moduleId })
      .then(helpmanualmodules => {

        if (!helpmanualmodules) {
          return res.status(404).send({
            responseCode: 1, isError: true,
            message: "HelpModule not found with id " + req.params.moduleId
          });
        }
        res.status(200).send({ responseCode: 0, isError: false, message: 'HelpModule Get successfullly.', data: helpmanualmodules });
        responseLog({ responseCode: 0, isError: false, message: '', data: helpmanualmodules }, "getHelpModuleById");
      }).catch(err => {
        if (err.kind === 'ObjectId') {
          return res.status(404).send({
            responseCode: 1, errors: {}, isError: true,
            message: "HelpModule not found with id " + req.params.moduleId
          });
        }
        errorLog(err, "getHelpModuleById");
        return res.status(500).send({
          responseCode: 9, isError: true, errors: { "message": "common.api.internalerror" },
          message: "Error retrieving HelpModule with id " + req.params.moduleId
        });
      });
  } catch (err) {
    errorLog(err, "getHelpModuleById");
    res.status(400).send({ responseCode: 1, errors: {}, isError: true, message: err });
  }
});


// @route   PUT api/private/v1/helpmanualmodule/editHelpModule
// @desc    Update a helpmodule with moduleId 
// @body   { "id":"", "locale" : "","sort_order":"","status":""}
// @access  Public
router.put('/editHelpModule', function (req, res) {

  var q = urlPath.parse(req.url, true).query;
  var APIRequest = {};
  APIRequest.params = req.params;
  APIRequest.referer = req.headers['referer'];
  APIRequest.query = q;
  APIRequest.body = req.body;
  requestLog(APIRequest, "editHelpModule");

  try {
    const { errors, isValid } = validateHelpManualModules.validateHelpManualModuleInput(req.body.helpmoduledata);
    if (isValid) {
      return res.status(400).json({ responseCode: 1, isError: true, message: "Validation Failed", errors: errors }).end();
    }
    // Find Help Module and update it with the requested moduleid
    HelpManualModules.findOneAndUpdate({ _id: req.body.helpmoduledata.id }, {
      locale: req.body.helpmoduledata.locale,
      sort_order: req.body.helpmoduledata.sort_order,
      status: req.body.helpmoduledata.status,
      date_modified: new Date(),
      modified_by: ''
    }, { new: true })
      .then(helpmanualmodules => {
        if (!helpmanualmodules) {
          return res.status(400).send({
            responseCode: 1, isError: true, message: "Help Module not found with id " + req.body.helpmoduledata.id, errors: {},
          });
        }

        res.status(200).json({ responseCode: 0, isError: false, message: 'Help Module Edit successfullly.' });
        responseLog({ responseCode: 0, isError: false, message: 'Help Module Edit successfullly.', data: helpmanualmodules }, "editHelpModule");

      }).catch(err => {

        errorLog(err, "editHelpModule");
        return res.status(500).send({
          responseCode: 9, isError: true, errors: { "message": "common.api.internalerror" },
          message: "Error updating Help Module with id " + req.body.helpmoduledata.id
        });
      });
  } catch (err) {
    errorLog(err, "editHelpModule");
    res.status(400).send({ responseCode: 1, isError: true, errors: {}, message: err });
  }
});


// @route   DELETE api/private/v1/helpmanualmodule/deleteHelpModule/:moduleId
// @desc    Delete a HelpModule with moduleId 
// @access  Public
router.delete('/deleteHelpModule/:moduleId', function (req, res) {

  var q = urlPath.parse(req.url, true).query;
  var APIRequest = {};
  APIRequest.params = req.params;
  APIRequest.referer = req.headers['referer'];
  APIRequest.query = q;
  APIRequest.body = req.body;
  requestLog(APIRequest, "DeleteHelpModule");

  try {
    const { errors, isValid } = validateHelpManualModules.validateDeleteHelpModuleInput(req.params);

    // Check Validation
    if (isValid) {
      return res.status(400).send({ responseCode: 1, isError: true, message: errors });
    }

    HelpManuals.countDocuments({ module_id: req.params.moduleId }, function (err, totalhelpmanual) {
      if (err) {
        errorLog(err, "DeleteHelpModule");
        return res.status(500).json({
          responseCode: 1,
          isError: true,
          errors: { "message": "common.api.internalerror" },
          message: '',
        }).end();
      }
      if (totalhelpmanual > 0) {
        res.status(400).json({ responseCode: 1, isError: true, errors: { "message": "helpmodule.alreadyassign" }, message: 'You can not delete module' });
        responseLog({ responseCode: 1, isError: true, message: 'You can not delete module' }, "DeleteHelpModule");
      }
      else {
        HelpManualModules.findOneAndDelete({ _id: req.params.moduleId })
          .then(helpmanualmodules => {

            if (!helpmanualmodules) {
              return res.status(404).send({
                responseCode: 1, isError: true,
                message: "Help Module not found with id " + req.params.moduleId
              });
            }

            res.status(200).json({ responseCode: 0, isError: false, message: 'Help Module deleted successfully.' });
            responseLog({ responseCode: 0, isError: false, message: 'Help Module deleted Successfully.', data: helpmanualmodules }, "DeleteHelpModule");

          }).catch(error => {

            errorLog(error, "DeleteHelpModule");
            return res.status(500).send({
              responseCode: 9, isError: true, errors: { "message": "common.api.internalerror" },
              message: "Could not delete Help Module with id " + req.params.moduleId
            });
          });
      }
    });
  } catch (err) {
    errorLog(err, "DeleteHelpModule");
    res.status(400).send({ responseCode: 1, isError: true, message: err, data: '' });
  }
});

// Added Front side api calls by Jayesh 09-01-2019 
// @route   GET api/private/v1/helpmanualmodule/listHelpManualModule
// @desc    Retrieve all list of Help Manual Modules 
// @access  Public
router.get('/listHelpManualModule', function (req, res) {

  var q = urlPath.parse(req.url, true).query;
  var APIRequest = {};
  APIRequest.params = req.params;
  APIRequest.referer = req.headers['referer'];
  APIRequest.query = q;
  APIRequest.body = req.body;
  requestLog(APIRequest, "ListHelpManualModuleFront");

  try {

    HelpManualModules.find({}, {}, { _id: false }).sort('sort_order')
      .then(HelpManualModuleData => {

        res.status(200).json({ responseCode: 0, isError: false, message: '', data: HelpManualModuleData });
        responseLog({ responseCode: 0, isError: false, message: '', data: HelpManualModuleData }, "ListHelpManualModuleFront");

      }).catch(err => {

        errorLog(err, "ListHelpManualModuleFront");

        return res.status(500).json({
          responseCode: 1,
          isError: true,
          message: '',
          errors: err.message || "common.api.fetcherror"
        }).end();

      });

  } catch (err) {

    errorLog(err, "ListHelpManualModuleFront");
    return res.status(400).json({
      responseCode: 9,
      isError: true,
      message: '',
      errors: err.message || "common.api.internalerror"
    }).end();
  }
});

module.exports = router;
// Added by Kushal Parekh 20-10-2018 for adding Help Manual module - start