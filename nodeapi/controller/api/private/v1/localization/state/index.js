// Added by Jayesh PAthak 09-10-2018 for adding state module - start 
const express = require('express');
const router = express.Router();
const urlPath = require('url');
var logHelper = require('../../../../../../helper/logHelper');
var errorLog = logHelper.errorLog;
var responseLog = logHelper.responseLog;
var requestLog = logHelper.requestLog;

// Load Input Validation
const validateState = require('../../../../../../validation/state');

// Load State model
const State = require('../../../../../../models/localization/state/index');

// @route   GET api/private/v1/localization/state/listState/:page/:perpage/:searchValue?/:orderBy?/:sortOrder?
// @desc    Retrieve all states with pagination 
// @access  Public
router.get('/listState/:page?/:perpage?/:searchValue?/:orderBy?/:sortOrder?', function (req, res) {

  var q = urlPath.parse(req.url, true).query;
  var APIRequest = {};
  APIRequest.params = req.params;
  APIRequest.query = q;
  requestLog(APIRequest, "ListState");

  try {

    let page = 0;
    let perpage = 50;
    let sortBy = "stateId";
    let sortOrder = 1;
    let searchValue = '.*.*';

    if (typeof req.params.page != 'undefined' && Number(req.params.page) > 0)
      page = Number(req.params.page);

    if (typeof req.params.perpage != 'undefined' && Number(req.params.perpage) > 0)
      perpage = Number(req.params.perpage);

    if (typeof req.params.orderBy != 'undefined' && (req.params.orderBy == 'stateId' || req.params.orderBy == 'stateName' || req.params.orderBy == 'stateCode' || req.params.orderBy == 'countryId' || req.params.orderBy == 'status'))
      sortBy = (req.params.orderBy == 'stateName') ? 'locale.en' : req.params.orderBy;

    if (typeof req.params.sortOrder != 'undefined' && (Number(req.params.sortOrder) == -1 || Number(req.params.sortOrder) == 1))
      sortOrder = req.params.sortOrder;

    if (typeof req.params.searchValue != 'undefined' && req.params.searchValue != 'null' && req.params.searchValue != null && req.params.searchValue.trim() != '' && req.params.searchValue.length > 0)
      searchValue = '.*' + req.params.searchValue + '.*';

    let sortPair = {}
    sortPair[sortBy] = sortOrder;

    State.find({ $or: [{ "locale.en": new RegExp(searchValue, "i") }, { stateCode: new RegExp(searchValue, "i") }] }, { _id: false }, { sort: sortPair, skip: (perpage * page), limit: perpage })
      .then(states => {

        State.countDocuments({ $or: [{ "locale.en": new RegExp(searchValue, "i") }, { stateCode: new RegExp(searchValue, "i") }] }, function (err, statecount) {

          if (err) {
            errorLog(err, "ListState");
            return res.status(500).json({
              responseCode: 1,
              isError: true,
              message: '',
              errors: err.message || "common.api.fetcherror"
            }).end();

          }

          res.status(200).json({
            responseCode: 0,
            isError: false, message: '', data: states, totalCount: statecount
          });
          responseLog({
            responseCode: 0,
            isError: false, message: '', data: states, totalCount: statecount
          }, "ListState");

        });

      }).catch(err => {
        errorLog(err, "ListState");

        return res.status(500).json({
          responseCode: 1,
          isError: true,
          message: '',
          errors: err.message || "common.api.fetcherror"
        });

      });

  } catch (err) {
    errorLog(err, "ListState");
    return res.status(400).json({
      responseCode: 9,
      isError: true,
      message: '',
      errors: err.message || "common.api.internalerror"
    }).end();
  }

});

// @route   POST api/private/v1/localization/state/addState
// @desc    Create a new state  
// @body    { "statename" : "",  "statecode" : "", "countryid" : "" }
// @access  Public
router.post('/addState', function (req, res) {

  var APIRequest = {};
  APIRequest.body = req.body.statedata;
  requestLog(APIRequest, "AddState");

  try {

    const { errors, isValid } = validateState.validateAddStateInput(req.body.statedata);

    // Check Validation
    if (!isValid) {
      return res.status(400).json({
        responseCode: 1,
        isError: true,
        message: '',
        errors: errors
      }).end();
    }

    State.findOne({}, {}, { sort: { 'stateId': -1 } }).then(stateid => {

      const state = new State({
        stateId: (stateid.stateId + 1),
        locale: req.body.statedata.locale,
        stateCode: req.body.statedata.stateCode,
        countryId: req.body.statedata.countryId
      });

      // Save State in the database
      state.save()
        .then(data => {
          res.status(200).json({
            responseCode: 0,
            isError: false, message: "common.form.add.success", data: ''
          });

          responseLog({
            responseCode: 0,
            isError: false, message: "common.form.add.success"
          }, "AddState");
        }).catch(err => {

          errorLog(err, "AddState");
          return res.status(500).json({
            responseCode: 1,
            isError: true,
            message: '',
            errors: err.message || "common.api.adderror"
          }).end();

        });

    }).catch(err => {

      errorLog(err, "AddState");

      return res.status(500).json({
        responseCode: 1,
        isError: true,
        message: '',
        errors: err.message || "common.api.fetcherror"
      }).end();

    });

  } catch (err) {
    errorLog(err, "AddState");
    return res.status(400).json({
      responseCode: 9,
      isError: true,
      message: '',
      errors: err.message || "common.api.internalerror"
    }).end();
  }
});

// @route   POST api/private/v1/localization/state/getStateById/:stateId
// @desc    Retrieve a single state with stateId 
// @access  Public
router.get('/getStateById/:stateId', function (req, res) {

  var q = urlPath.parse(req.url, true).query;
  var APIRequest = {};
  APIRequest.params = req.params;
  APIRequest.query = q;
  requestLog(APIRequest, "GetStateById");

  try {

    const { errors, isValid } = validateState.validateGetStateByIdInput(req.params);

    // Check Validation
    if (!isValid) {
      return res.status(400).json({
        responseCode: 1,
        isError: true,
        message: '',
        errors: errors
      }).end();
    }

    State.findOne({ stateId: req.params.stateId }, { _id: false })
      .then(state => {
        if (!state) {
          return res.status(400).json({
            responseCode: 1,
            isError: true,
            message: '',
            errors: "common.api.datanotfound" + req.params.stateId
          }).end();
        }
        res.status(200).json({
          responseCode: 0,
          isError: true, message: '', data: state
        });
        responseLog({
          responseCode: 0,
          isError: false, message: '', data: state
        }, "GetStateById");
      }).catch(err => {

        errorLog(err, "GetStateById");
        return res.status(500).json({
          responseCode: 1,
          isError: true,
          message: '',
          errors: err.message || "common.api.fetcherror"
        }).end();
      });

  } catch (err) {
    errorLog(err, "GetStateById");
    return res.status(400).json({
      responseCode: 9,
      isError: true,
      message: '',
      errors: err.message || "common.api.internalerror"
    }).end();
  }
});

// @route   POST api/private/v1/localization/state/getStateByCountryId/:countryId
// @desc    Retrieve states with countryId 
// @access  Public
router.get('/getStateByCountryId/:countryId', function (req, res) {

  var q = urlPath.parse(req.url, true).query;
  var APIRequest = {};
  APIRequest.params = req.params;
  APIRequest.query = q;
  requestLog(APIRequest, "GetStateByCountryId");

  try {

    const { errors, isValid } = validateState.validateGetStateByCountryIdInput(req.params);

    // Check Validation
    if (!isValid) {
      return res.status(400).json({
        responseCode: 1,
        isError: true,
        message: '',
        errors: errors
      }).end();
    }

    State.find({ countryId: Number(req.params.countryId), status: 1 }, { _id: false })
      .then(state => {
        if (!state) {
          return res.status(400).json({
            responseCode: 1,
            isError: true,
            message: '',
            errors: "common.api.datanotfound" + req.params.countryId
          }).end();
        }

        res.status(200).json({
          responseCode: 0,
          isError: false, message: '', data: state
        });
        responseLog({
          responseCode: 0,
          isError: false, message: '', data: state
        }, "GetStateByCountryId");
      }).catch(err => {

        errorLog(err, "GetStateByCountryId");
        return res.status(500).json({
          responseCode: 1,
          isError: true,
          message: '',
          errors: err.message || "common.api.fetcherror"
        }).end();
      });

  } catch (err) {
    errorLog(err, "GetStateByCountryId");
    return res.status(400).json({
      responseCode: 9,
      isError: true,
      message: '',
      errors: err.message || "common.api.internalerror"
    }).end();
  }
});

// @route   PUT api/private/v1/localization/state/updateState/:stateId
// @desc    Update a state with stateId 
// @body    { "statename" : "",  "statecode" : "", "countryid" : "" }
// @access  Public
router.put('/updateState', function (req, res) {

  var APIRequest = {};
  APIRequest.body = req.body.statedata;
  requestLog(APIRequest, "UpdateState");

  try {

    const { errors, isValid } = validateState.validateUpdateStateInput(req.body.statedata);

    // Check Validation
    if (!isValid) {
      return res.status(400).json({
        responseCode: 1,
        isError: true,
        message: '',
        errors: errors
      }).end();
    }

    // Find state and update it with the requested stateId
    State.findOneAndUpdate({ stateId: req.body.statedata.stateId }, {
      locale: req.body.statedata.locale,
      stateCode: req.body.statedata.stateCode,
      countryId: req.body.statedata.countryId,
      status: req.body.statedata.status
    }, { new: true })
      .then(state => {
        if (!state) {
          return res.status(400).json({
            responseCode: 1,
            isError: true,
            message: '',
            errors: "common.api.datanotfound" + req.body.statedata.stateId
          }).end();
        }
        res.status(200).json({
          responseCode: 0,
          isError: false, message: "common.form.edit.success"
        });
        responseLog({
          responseCode: 0,
          isError: false, message: "common.form.edit.success"
        }, "UpdateState");
      }).catch(err => {

        errorLog(err, "UpdateState");
        return res.status(500).json({
          responseCode: 1,
          isError: true,
          message: '',
          errors: err.message || "common.api.editerror"
        }).end();
      });

  } catch (err) {
    errorLog(err, "UpdateState");
    return res.status(400).json({
      responseCode: 9,
      isError: true,
      message: '',
      errors: err.message || "common.api.internalerror"
    }).end();
  }

});

module.exports = router;