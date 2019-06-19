const express = require('express');
const router = express.Router();
const urlPath = require('url');
var logHelper = require('../../../../../../helper/logHelper');
var errorLog = logHelper.errorLog;
var responseLog = logHelper.responseLog;
var requestLog = logHelper.requestLog;

// Load Input Validation
const validateCity = require('../../../../../../validation/city');

// Load City model
const City = require('../../../../../../models/localization/city/index');

// @route   GET api/private/v1/localization/city/listCity/:page/:perpage/:searchValue?/:orderBy?/:sortOrder?
// @desc    Retrieve all cities with pagination 
// @access  Public
router.get('/listCity/:page?/:perpage?/:searchValue?/:orderBy?/:sortOrder?', function (req, res) {

  var q = urlPath.parse(req.url, true).query;
  var APIRequest = {};
  APIRequest.params = req.params;
  APIRequest.query = q;
  requestLog(APIRequest, "ListCity");

  try {

    let page = 0;
    let perpage = 50;
    let sortBy = "cityId";
    let sortOrder = 1;
    let searchValue = '.*.*';

    if (typeof req.params.page != 'undefined' && Number(req.params.page) > 0)
      page = Number(req.params.page);

    if (typeof req.params.perpage != 'undefined' && Number(req.params.perpage) > 0)
      perpage = Number(req.params.perpage);

    if (typeof req.params.orderBy != 'undefined' && (req.params.orderBy == 'cityId' || req.params.orderBy == 'cityName' || req.params.orderBy == 'countryId' || req.params.orderBy == 'stateId' || req.params.orderBy == 'status'))
      sortBy = (req.params.orderBy == 'cityName') ? 'locale.en' : req.params.orderBy;

    if (typeof req.params.sortOrder != 'undefined' && (Number(req.params.sortOrder) == -1 || Number(req.params.sortOrder) == 1))
      sortOrder = req.params.sortOrder;

    if (typeof req.params.searchValue != 'undefined' && req.params.searchValue != 'null' && req.params.searchValue != null && req.params.searchValue.trim() != '' && req.params.searchValue.length > 0)
      searchValue = '.*' + req.params.searchValue + '.*';

    let sortPair = {}
    sortPair[sortBy] = sortOrder;

    City.find({ "locale.en": new RegExp(searchValue, "i") }, { _id: false }, { sort: sortPair, skip: (perpage * page), limit: perpage }).then(cities => {
      City.countDocuments({ "locale.en": new RegExp(searchValue, "i") }, function (err, citycount) {
        if (err) {
          errorLog(err, "ListCity");
          return res.status(500).json({
            responseCode: 1,
            isError: true,
            message: '',
            errors: err.message || "common.api.fetcherror"
          }).end();

        }

        res.status(200).json({
          responseCode: 0,
          isError: false, message: '', data: cities, totalCount: citycount
        });
        responseLog({
          responseCode: 0,
          isError: false, message: '', data: cities, totalCount: citycount
        }, "ListCity");
      });
    }).catch(err => {
      errorLog(err, "ListCity");
      return res.status(500).json({
        responseCode: 1,
        isError: true,
        message: '',
        errors: err.message || "common.api.fetcherror"
      }).end();

    });

  } catch (err) {

    errorLog(err, "ListCity");
    return res.status(400).json({
      responseCode: 9,
      isError: true,
      message: '',
      errors: err.message || "common.api.internalerror"
    }).end();
  }
});

// @route   POST api/private/v1/localization/city/addCity
// @desc    Create a new city  
// @body    { "cityname" : "",  "citycode" : "", "countryid" : 1 }
// @access  Public
router.post('/addCity', function (req, res) {

  var APIRequest = {};
  APIRequest.body = req.body.citydata;
  requestLog(APIRequest, "AddCity");

  try {

    const { errors, isValid } = validateCity.validateAddCityInput(req.body.citydata);

    // Check Validation
    if (!isValid) {
      return res.status(400).json({
        responseCode: 1,
        isError: true,
        message: '',
        errors: errors
      }).end();
    }

    City.findOne({}, {}, { sort: { 'cityId': -1 } }).then(cityid => {

      const city = new City({
        cityId: (cityid.cityId + 1),
        stateId: req.body.citydata.stateId,
        locale: req.body.citydata.locale,
        countryId: req.body.citydata.countryId
      });

      // Save City in the database
      city.save()
        .then(data => {
          res.status(200).json({
            responseCode: 0,
            isError: false, message: "common.form.add.success"
          });
          responseLog({
            responseCode: 0,
            isError: false, message: "common.form.add.success"
          }, "AddCity");
        }).catch(err => {
          errorLog(err, "AddCity");
          return res.status(500).json({
            responseCode: 1,
            isError: true,
            message: '',
            errors: err.message || "common.api.adderror"
          }).end();

        });

    }).catch(err => {

      errorLog(err, "AddCity");

      return res.status(500).json({
        responseCode: 1,
        isError: true,
        message: '',
        errors: err.message || "common.api.fetcherror"
      }).end();

    });

  } catch (err) {
    errorLog(err, "AddCity");
    return res.status(400).json({
      responseCode: 9,
      isError: true,
      message: '',
      errors: err.message || "common.api.internalerror"
    }).end();
  }

});

// @route   POST api/private/v1/localization/city/getCityById/:cityId
// @desc    Retrieve a single city with cityId 
// @access  Public
router.get('/getCityById/:cityId', function (req, res) {

  var q = urlPath.parse(req.url, true).query;
  var APIRequest = {};
  APIRequest.params = req.params;
  APIRequest.query = q;
  requestLog(APIRequest, "GetCityById");

  try {

    const { errors, isValid } = validateCity.validateGetCityByIdInput(req.params);

    // Check Validation
    if (!isValid) {
      return res.status(400).json({
        responseCode: 1,
        isError: true,
        message: '',
        errors: errors
      }).end();
    }

    City.findOne({ cityId: req.params.cityId }, { _id: false })
      .then(city => {

        if (!city) {
          return res.status(400).json({
            responseCode: 1,
            isError: true,
            message: '',
            errors: "common.api.datanotfound" + req.params.cityId
          }).end();
        }

        res.status(200).json({
          responseCode: 0,
          isError: false, message: '', data: city
        });
        responseLog({
          responseCode: 0,
          isError: false, message: '', data: city
        }, "GetCityById");
      }).catch(err => {

        errorLog(err, "GetCityById");
        return res.status(500).json({
          responseCode: 1,
          isError: true,
          message: '',
          errors: err.message || "common.api.fetcherror"
        }).end();
      });

  } catch (err) {
    errorLog(err, "GetCityById");
    res.status(400).json({
      responseCode: 9,
      isError: true,
      message: '',
      errors: err.message || "common.api.internalerror"
    }).end();
  }

});

// @route   PUT api/private/v1/localization/city/updateCity/:cityId
// @desc    Update a city with cityId 
// @body    { "cityname" : "",  "citycode" : "", "countryid" : 1 }
// @access  Public
router.put('/updateCity', function (req, res) {

  var APIRequest = {};
  APIRequest.body = req.body.citydata;
  requestLog(APIRequest, "UpdateCity");

  try {

    const { errors, isValid } = validateCity.validateUpdateCityInput(req.body.citydata);

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
    City.findOneAndUpdate({ cityId: req.body.citydata.cityId }, {
      stateId: req.body.citydata.stateId,
      locale: req.body.citydata.locale,
      countryId: req.body.citydata.countryId,
      status: req.body.citydata.status
    }, { new: true })
      .then(city => {

        if (!city) {
          return res.status(400).json({
            responseCode: 1,
            isError: true,
            message: '',
            errors: "common.api.datanotfound" + req.body.citydata.cityId
          }).end();
        }
        res.status(200).json({
          responseCode: 0,
          isError: false, message: "common.form.edit.success"
        });
        responseLog({
          responseCode: 0,
          isError: false, message: "common.form.edit.success"
        }, "UpdateCity");
      }).catch(err => {

        errorLog(err, "UpdateCity");
        return res.status(500).json({
          responseCode: 1,
          isError: true,
          message: '',
          errors: err.message || "common.api.editerror"
        }).end();
      });

  } catch (err) {
    errorLog(err, "UpdateCity");
    return res.status(400).json({
      responseCode: 9,
      isError: true,
      message: '',
      errors: err.message || "common.api.internalerror"
    }).end();
  }
});

module.exports = router;