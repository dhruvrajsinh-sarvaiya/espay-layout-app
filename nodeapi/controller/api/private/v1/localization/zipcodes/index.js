// Added by dhara gajera 8/2/2019 for adding zip codes module 
const express = require('express');
const router = express.Router();
const urlPath = require('url');
var logHelper = require('../../../../../../helper/logHelper');
var errorLog = logHelper.errorLog;
var responseLog = logHelper.responseLog;
var requestLog = logHelper.requestLog;

// Load Input Validation
const validateZipcodes = require('../../../../../../validation/zipcodes');

// Load zip codees model
const Zipcodes = require('../../../../../../models/localization/zipcodes/index');

// @route   GET api/private/v1/localization/zipcodes/listzipcodes/:page/:perpage/:searchValue?/:orderBy?/:sortOrder?
// @desc    Retrieve all zipcodes with pagination 
// @access  Public
router.get('/listzipcodes/:page?/:perpage?/:searchValue?/:orderBy?/:sortOrder?', function (req, res) {
  var q = urlPath.parse(req.url, true).query;
  var APIRequest = {};
  APIRequest.params = req.params;
  APIRequest.query = q;
  requestLog(APIRequest, "ListZipcodes");

  try {

    let page = 0;
    let perpage = 50;
    let sortBy = "zipcodesId";
    let sortOrder = 1;
    let searchValue = '.*.*';

    if (typeof req.params.page != 'undefined' && Number(req.params.page) > 0)
      page = Number(req.params.page);

    if (typeof req.params.perpage != 'undefined' && Number(req.params.perpage) > 0)
      perpage = Number(req.params.perpage);

    if (typeof req.params.orderBy != 'undefined' && (req.params.orderBy == 'zipcodesId' || req.params.orderBy == 'zipcodes' || req.params.orderBy == 'zipAreaName' || req.params.orderBy == 'cityId' || req.params.orderBy == 'status' || req.params.orderBy == 'countryId' || req.params.orderBy == 'stateId'))
      sortBy = (req.params.orderBy == 'zipcodes') ? 'zipcodes' : req.params.orderBy;

    if (typeof req.params.sortOrder != 'undefined' && (Number(req.params.sortOrder) == -1 || Number(req.params.sortOrder) == 1))
      sortOrder = req.params.sortOrder;

    if (typeof req.params.searchValue != 'undefined' && req.params.searchValue != 'null' && req.params.searchValue != null && req.params.searchValue.trim() != '' && req.params.searchValue.length > 0)
      searchValue = '.*' + req.params.searchValue + '.*';

    let sortPair = {}
    sortPair[sortBy] = sortOrder;
    Zipcodes.find({ $or: [{ "zipcode": new RegExp(searchValue, "i") }] }, { _id: false }, { sort: sortPair, skip: (perpage * page), limit: perpage }).then(zips => {
      Zipcodes.countDocuments({ $or: [{ "zipcode": new RegExp(searchValue, "i") }] }, function (err, zipCodescount) {
        if (err) {
          errorLog(err, "ListZipcodes");
          return res.status(500).json({
            responseCode: 1,
            isError: true,
            message: '',
            errors: err.message || "common.api.fetcherror"
          }).end();

        }
        res.status(200).json({
          responseCode: 0,
          isError: false, message: '', data: zips, totalCount: zipCodescount
        });
        responseLog({
          responseCode: 0,
          isError: false, message: '', data: zips, totalCount: zipCodescount
        }, "ListZipcodes");

      });

    }).catch(err => {
      errorLog(err, "ListZipcodes");
      return res.status(500).json({
        responseCode: 1,
        isError: true,
        message: '',
        errors: err.message || "common.api.fetcherror"
      });

    });
  } catch (err) {
    errorLog(err, "ListZipcodes");
    return res.status(400).json({
      responseCode: 9,
      isError: true,
      message: '',
      errors: err.message || "common.api.internalerror"
    }).end();
  }
});

// @route   POST api/private/v1/localization/zipcodes/addZipcode
// @desc    Create a new zipcode  
// @access  Public
router.post('/addZipcode', function (req, res) {
  var APIRequest = {};
  APIRequest.body = req.body.zipCodedata;
  requestLog(APIRequest, "addZipcodes");

  try {
    const { errors, isValid } = validateZipcodes.validateAddZipcodesInput(req.body.zipCodedata);
    // Check Validation
    if (!isValid) {
      return res.status(400).json({
        responseCode: 1,
        isError: true,
        message: '',
        errors: errors
      }).end();
    }
    Zipcodes.findOne({}, {}, { sort: { 'zipcodesId': -1 } }).then(zipcodesId => {
      const zipcodess = new Zipcodes({
        zipcodesId: (zipcodesId.zipcodesId + 1),
        countryId: req.body.zipCodedata.countryId,
        stateId: req.body.zipCodedata.stateId,
        cityId: req.body.zipCodedata.cityId,
        status: req.body.zipCodedata.status,
        zipcode: req.body.zipCodedata.zipCode,
        zipAreaName: req.body.zipCodedata.zipAreaName
      });

      // Save zipcode in the database
      zipcodess.save()
        .then(data => {
          res.status(200).json({
            responseCode: 0,
            isError: false, message: "common.form.add.success"
          });
          responseLog({
            responseCode: 0,
            isError: false, message: "common.form.add.success"
          }, "addZipcodes");
        }).catch(err => {
          errorLog(err, "addZipcodes");
          return res.status(500).json({
            responseCode: 1,
            isError: true,
            message: '',
            errors: err.message || "common.api.adderror"
          }).end();

        });

    }).catch(err => {
      errorLog(err, "addZipcodes");
      return res.status(500).json({
        responseCode: 1,
        isError: true,
        message: '',
        errors: err.message || "common.api.fetcherror"
      }).end();

    });

  } catch (err) {
    errorLog(err, "addZipcodes");
    return res.status(400).json({
      responseCode: 9,
      isError: true,
      message: '',
      errors: err.message || "common.api.internalerror"
    }).end();
  }
});

// @route   POST api/private/v1/localization/zipcodes/getZipcodeById/:zipcodesId
// @desc    Retrieve a single zipcode data with zipcodesId 
// @access  Public
router.get('/getZipcodeById/:zipcodesId', function (req, res) {

  var q = urlPath.parse(req.url, true).query;
  var APIRequest = {};
  APIRequest.params = req.params;
  APIRequest.query = q;
  requestLog(APIRequest, "getZipcodeById");
  try {
    const { errors, isValid } = validateZipcodes.validateGetZipcodeByIdInput(req.params);
    // Check Validation
    if (!isValid) {
      return res.status(400).json({
        responseCode: 1,
        isError: true,
        message: '',
        errors: errors
      }).end();
    }

    Zipcodes.findOne({ zipcodesId: parseInt(req.params.zipcodesId) }, { _id: false })
      .then(zip => {
        if (!zip) {
          return res.status(400).json({
            responseCode: 1,
            isError: true,
            message: '',
            errors: "common.api.datanotfound" + req.params.zipcodesId
          }).end();
        }
        res.status(200).json({
          responseCode: 0,
          isError: true, message: '', data: zip
        });
        responseLog({
          responseCode: 0,
          isError: false, message: '', data: zip
        }, "getZipcodeById");
      }).catch(err => {

        errorLog(err, "getZipcodeById");
        return res.status(500).json({
          responseCode: 1,
          isError: true,
          message: '',
          errors: err.message || "common.api.fetcherror"
        }).end();
      });

  } catch (err) {
    errorLog(err, "getZipcodeById");
    return res.status(400).json({
      responseCode: 9,
      isError: true,
      message: '',
      errors: err.message || "common.api.internalerror"
    }).end();
  }
});

//Added by dhara 12/2/2019
// @route   PUT api/private/v1/localization/zipcodes/updateZipcode
// @desc    Update a zipcode with zipcodesId 
// @access  Public
router.put('/updateZipcode', function (req, res) {
  var APIRequest = {};
  APIRequest.body = req.body.zipCodedata;
  requestLog(APIRequest, "UpdateZipcode");

  try {
    const { errors, isValid } = validateZipcodes.validateUpdateZipcodeInput(req.body.zipCodedata);
    // Check Validation
    if (!isValid) {
      return res.status(400).json({
        responseCode: 1,
        isError: true,
        message: '',
        errors: errors
      }).end();
    }
    // Find city and update it with the requested cityId
    Zipcodes.findOneAndUpdate({ zipcodesId: req.body.zipCodedata.zipcodesId }, {
      countryId: req.body.zipCodedata.countryId,
      stateId: req.body.zipCodedata.stateId,
      cityId: req.body.zipCodedata.cityId,
      status: req.body.zipCodedata.status,
      zipcode: req.body.zipCodedata.zipcode,
      zipAreaName: req.body.zipCodedata.zipAreaName
    }, { new: true })
      .then(zip => {

        if (!zip) {
          return res.status(400).json({
            responseCode: 1,
            isError: true,
            message: '',
            errors: "common.api.datanotfound" + req.body.zipCodedata.zipcodesId
          }).end();
        }
        res.status(200).json({
          responseCode: 0,
          isError: false, message: "common.form.edit.success"
        });
        responseLog({
          responseCode: 0,
          isError: false, message: "common.form.edit.success"
        }, "UpdateZipcode");
      }).catch(err => {

        errorLog(err, "UpdateZipcode");
        return res.status(500).json({
          responseCode: 1,
          isError: true,
          message: '',
          errors: err.message || "common.api.editerror"
        }).end();
      });

  } catch (err) {
    errorLog(err, "UpdateZipcode");
    return res.status(400).json({
      responseCode: 9,
      isError: true,
      message: '',
      errors: err.message || "common.api.internalerror"
    }).end();
  }
});

module.exports = router;