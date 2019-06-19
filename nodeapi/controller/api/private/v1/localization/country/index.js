// Added by Jayesh PAthak 09-10-2018 for adding country module - start
const express = require('express');
const router = express.Router();
const urlPath = require('url');
var logHelper = require('../../../../../../helper/logHelper');
var errorLog = logHelper.errorLog;
var responseLog = logHelper.responseLog;
var requestLog = logHelper.requestLog;

// Load Input Validation
const validateCountry = require('../../../../../../validation/country');

// Load Country model
const Country = require('../../../../../../models/localization/country/index');

// @route   GET api/private/v1/localization/country/listCountry/:page/:perpage/:searchValue?/:orderBy?/:sortOrder?
// @desc    Retrieve all countries with pagination 
// @access  Public
router.get('/listCountry/:page?/:perpage?/:searchValue?/:orderBy?/:sortOrder?', function (req, res) {

  var q = urlPath.parse(req.url, true).query;
  var APIRequest = {};
  APIRequest.params = req.params;
  APIRequest.query = q;
  requestLog(APIRequest, "ListCountry");

  try {

    if (typeof req.params.page != 'undefined' && req.params.page.length > 0 && req.params.page == 'all') {

      Country.find({ status: 1 }, { _id: false }).then(countrycount => {

        Country.find({ status: 1 }, { _id: false })
          .then(countries => {

            res.status(200).json({ responseCode: 0, isError: false, message: '', data: countries });
            responseLog({ responseCode: 0, isError: false, message: '', data: countries, totalCount: countrycount.length }, "ListAllCountry");

          }).catch(err => {

            errorLog(err, "ListAllCountry");

            return res.status(500).json({
              responseCode: 1,
              isError: true,
              message: '',
              errors: err.message || "common.api.fetcherror"
            }).end();

          });

      }).catch(err => {

        errorLog(err, "ListAllCountry");

        return res.status(500).json({
          responseCode: 1,
          isError: true,
          message: '',
          errors: err.message || "common.api.fetcherror"
        }).end();

      });

    }
    else {

      let page = 0;
      let perpage = 50;
      let sortBy = "countryId";
      let sortOrder = 1;
      let searchValue = '.*.*';

      if (typeof req.params.page != 'undefined' && Number(req.params.page) > 0)
        page = Number(req.params.page);

      if (typeof req.params.perpage != 'undefined' && Number(req.params.perpage) > 0)
        perpage = Number(req.params.perpage);

      if (typeof req.params.orderBy != 'undefined' && (req.params.orderBy == 'countryId' || req.params.orderBy == 'countryName' || req.params.orderBy == 'countryCode' || req.params.orderBy == 'status'))
        sortBy = (req.params.orderBy == 'countryName') ? 'locale.en' : req.params.orderBy;

      if (typeof req.params.sortOrder != 'undefined' && (Number(req.params.sortOrder) == -1 || Number(req.params.sortOrder) == 1))
        sortOrder = req.params.sortOrder;

      if (typeof req.params.searchValue != 'undefined' && req.params.searchValue != 'null' && req.params.searchValue != null && req.params.searchValue.trim() != '' && req.params.searchValue.length > 0)
        searchValue = '.*' + req.params.searchValue + '.*';

      let sortPair = {}
      sortPair[sortBy] = sortOrder;

      Country.find({ $or: [{ "locale.en": new RegExp(searchValue, "i") }, { countryCode: new RegExp(searchValue, "i") }] }, { _id: false }, { sort: sortPair, skip: (perpage * page), limit: perpage })
        .then(countries => {

          Country.countDocuments({ $or: [{ "locale.en": new RegExp(searchValue, "i") }, { countryCode: new RegExp(searchValue, "i") }] }, function (err, countrycount) {

            if (err) {
              errorLog(err, "ListCountry");

              return res.status(500).json({
                responseCode: 1,
                isError: true,
                message: '',
                errors: err.message || "common.api.fetcherror"
              }).end();

            }

            res.status(200).json({ responseCode: 0, isError: false, message: '', data: countries, totalCount: countrycount });

            responseLog({ responseCode: 0, isError: false, message: '', data: countries, totalCount: countrycount }, "ListCountry");

          });

        }).catch(err => {

          errorLog(err, "ListCountry");

          return res.status(500).json({
            responseCode: 1,
            isError: true,
            message: '',
            errors: err.message || "common.api.fetcherror"
          }).end();

        });

    }

  } catch (err) {

    errorLog(err, "ListCountry");
    return res.status(400).json({
      responseCode: 9,
      isError: true,
      message: '',
      errors: err.message || "common.api.internalerror"
    }).end();
  }

});

// @route   POST api/private/v1/localization/country/addCountry
// @desc    Create a new country  
// @body    { "locale" : "",  "countrycode" : "", "status" : 1 }
// @access  Public
router.post('/addCountry', function (req, res) {

  var APIRequest = {};
  APIRequest.body = req.body.countrydata;
  requestLog(APIRequest, "AddCountry");

  try {

    const { errors, isValid } = validateCountry.validateAddCountryInput(req.body.countrydata);

    // Check Validation
    if (!isValid) {
      return res.status(400).json({
        responseCode: 1,
        isError: true,
        message: '', errors: errors
      }).end();
    }

    Country.findOne({}, {}, { sort: { 'countryId': -1 } }).then(countryid => {

      const country = new Country({
        countryId: (countryid.countryId + 1),
        locale: req.body.countrydata.locale,
        countryCode: req.body.countrydata.countryCode,
        status: req.body.countrydata.status
      });

      // Save Country in the database
      country.save()
        .then(data => {

          res.status(200).json({ responseCode: 0, isError: false, message: "common.form.add.success" });
          responseLog({ responseCode: 0, isError: false, message: "common.form.add.success" }, "AddCountry");

        }).catch(err => {

          errorLog(err, "AddCountry");

          return res.status(500).json({
            responseCode: 1,
            isError: true,
            message: '',
            errors: err.message || "common.api.adderror"
          }).end();

        });

    }).catch(err => {

      errorLog(err, "AddCountry");

      return res.status(500).json({
        responseCode: 1,
        isError: true,
        message: '',
        errors: err.message || "common.api.fetcherror"
      }).end();

    });

  } catch (err) {

    errorLog(err, "AddCountry");
    return res.status(400).json({
      responseCode: 9,
      isError: true,
      message: '',
      errors: err.message || "common.api.internalerror"
    }).end();

  }

});

// @route   POST api/private/v1/localization/country/getCountryById/:countryId
// @desc    Retrieve a single country with countryId 
// @access  Public
router.get('/getCountryById/:countryId', function (req, res) {

  var q = urlPath.parse(req.url, true).query;
  var APIRequest = {};
  APIRequest.params = req.params;
  APIRequest.query = q;
  requestLog(APIRequest, "GetCountryById");

  try {

    const { errors, isValid } = validateCountry.validateGetCountryByIdInput(req.params);

    // Check Validation
    if (!isValid) {
      return res.status(400).json({
        responseCode: 1,
        isError: true,
        message: '', errors: errors
      }).end();
    }

    Country.findOne({ countryId: req.params.countryId }, { _id: false })
      .then(country => {

        if (!country) {
          return res.status(400).json({
            responseCode: 1,
            isError: true,
            message: '',
            errors: "common.api.datanotfound" + req.params.countryId
          }).end();
        }

        res.status(200).json({ responseCode: 0, isError: false, message: '', data: country });
        responseLog({ responseCode: 0, isError: false, message: '', data: country }, "GetCountryById");

      }).catch(err => {

        errorLog(err, "GetCountryById");
        return res.status(500).json({
          responseCode: 1,
          isError: true,
          message: '',
          errors: err.message || "common.api.fetcherror"
        }).end();
      });

  } catch (err) {
    errorLog(err, "GetCountryById");
    return res.status(400).json({
      responseCode: 9,
      isError: true,
      message: '', errors: err.message || "common.api.internalerror"
    }).end();
  }
});

// @route   PUT api/private/v1/localization/country/updateCountry/:countryId
// @desc    Update a country with countryId 
// @body    { "locale" : "",  "countrycode" : "", "status" : "", "countryId" : "" }
// @access  Public
router.put('/updateCountry', function (req, res) {

  var APIRequest = {};
  APIRequest.body = req.body.countrydata;
  requestLog(APIRequest, "UpdateCountry");

  try {
    const { errors, isValid } = validateCountry.validateUpdateCountryInput(req.body.countrydata);

    // Check Validation
    if (!isValid) {
      return res.status(400).json({
        responseCode: 1,
        isError: true,
        message: '', errors: errors
      }).end();
    }

    // Find country and update it with the requested countryId
    Country.findOneAndUpdate({ countryId: req.body.countrydata.countryId }, {
      locale: req.body.countrydata.locale,
      countryCode: req.body.countrydata.countryCode,
      status: req.body.countrydata.status
    }, { new: true })
      .then(country => {

        if (!country) {
          return res.status(400).json({
            responseCode: 1,
            isError: true,
            message: '',
            errors: "common.api.datanotfound" + req.body.countrydata.countryId
          }).end();
        }

        res.status(200).json({ responseCode: 0, isError: false, message: 'common.form.edit.success' });
        responseLog({ responseCode: 0, isError: false, message: 'common.form.edit.success' }, "UpdateCountry");

      }).catch(err => {

        errorLog(err, "UpdateCountry");
        return res.status(500).json({
          responseCode: 1,
          isError: true,
          message: '',
          errors: err.message || "common.api.editerror"
        }).end();
      });

  } catch (err) {

    errorLog(err, "UpdateCountry");
    return res.status(400).json({
      responseCode: 9,
      isError: true,
      message: '', errors: err.message || "common.api.internalerror"
    }).end();
  }
});
module.exports = router;
// Added by Jayesh PAthak 09-10-2018 for adding country module - start