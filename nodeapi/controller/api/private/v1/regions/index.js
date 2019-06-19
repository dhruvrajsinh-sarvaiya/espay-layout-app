// Added by Kushal parekh 27-12-2018 for adding Region module - start
const express = require('express');
const router = express.Router();
const urlPath = require('url');
var logHelper = require('../../../../../helper/logHelper');
var errorLog = logHelper.errorLog;
var responseLog = logHelper.responseLog;
var requestLog = logHelper.requestLog;
const fs = require('fs');
const filepath = (__dirname.substring(0, __dirname.indexOf("\\controller")) + '\\data\\');

// Region model
const Region = require('../../../../../models/Regions/index');

// Validation
const validateRegion = require('../../../../../validation/regions');

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

// @route   GET api/private/v1/regions
// @desc    Retrieve all Regions
// @access  Public
router.get('/', function (req, res) {
  var q = urlPath.parse(req.url, true).query;
  var APIRequest = {};
  APIRequest.params = req.params;
  APIRequest.referer = req.headers['referer'];
  APIRequest.query = q;
  APIRequest.body = req.body;
  requestLog(APIRequest, "ListRegions");
  try {
    Region.find()
      .then(regions => {
        res.status(200);
        res.json({
          responseCode: 0,
          isError: false,
          message: "Request Success",
          data: regions
        });
        res.end();
        responseLog({ responseCode: 0, isError: false, message: '', data: regions }, "ListRegions");
      })
      .catch(err => {
        res.status(500);
        res.json({
          responseCode: 9,
          isError: true,
          errors: { "message": "common.api.internalerror" },
          message: err.message || "Some error occurred while retrieving Regions."
        });
        res.end();
        errorLog(err, "ListRegions");
      });
  } catch (err) {
    errorLog(err, "ListRegions");
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

// @route   POST api/private/v1/addRegion
// @desc    Add News  
// @body    { "regionname": "", "locale" : "","status":""}
// @access  Public
router.post('/addRegion', function (req, res) {
  var q = urlPath.parse(req.url, true).query;
  var APIRequest = {};
  APIRequest.params = req.params;
  APIRequest.referer = req.headers['referer'];
  APIRequest.query = q;
  APIRequest.body = req.body;
  requestLog(APIRequest, "AddRegion");
  try {
    //Check Validation
    const { errors, isValid } = validateRegion.validateRegionFormInput(req.body.regiondata);
    if (isValid) {
      return res.status(400).json({ responseCode: 1, isError: true, message: "Validation Failed", errors: errors }).end();
    }
    var sulgregion = req.body.regiondata.regionname.toString().toLowerCase()
      .replace(/\s+/g, '_')           // Replace spaces with -
      .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
      .replace(/\-\-+/g, '_')         // Replace multiple - with single -
      .replace(/^-+/, '')             // Trim - from start of text
      .replace(/-+$/, '');
    const newRegion = new Region({
      regionname: req.body.regiondata.regionname,
      slug: sulgregion,
      locale: req.body.regiondata.locale,
      status: req.body.regiondata.status,
      date_created: new Date(),
      date_modified: new Date(),
      created_by: '',
      modified_by: ''
    });

    // Save News in the database
    newRegion.save()
      .then(data => {

        Region.find({ status: 1 }).select({ "locale": 1, "regionname": 1, "slug": 1, "_id": 0 })
          .then(regions => {
            let jsondata = {};

            regions.forEach(regiondata => {
              jsondata[regiondata.slug] = regiondata.locale
            });
            const content = JSON.stringify(jsondata);

            fs.writeFile(filepath + 'region.json', content);

          }).catch(err =>
            errorLog(err, "Selectregion")
          );

        res.status(200).send({ responseCode: 0, isError: false, message: 'Region added successfullly.' });
        responseLog({ responseCode: 0, isError: false, message: 'Region added successfullly.', data: regions }, "AddRegion");
      }).catch(err => {
        res.status(500).send({
          responseCode: 9,
          isError: true,
          errors: { "message": "common.api.internalerror" },
          message: err.message || "Some error occurred while creating the Region."
        });
        errorLog(err, "AddRegion");
      });

  } catch (err) {
    errorLog(err, "AddRegion");
    res.status(400).send({ responseCode: 2, errors: {}, isError: true, message: err });
  }
});

// @route   GET api/private/v1/regions/getregionbyid/:id
// @desc    Get region by id with for backoffice
// @access  Public
router.get('/getregionbyid/:regionId', (req, res) => {

  var q = urlPath.parse(req.url, true).query;
  var APIRequest = {};
  APIRequest.params = req.params;
  APIRequest.referer = req.headers['referer'];
  APIRequest.query = q;
  APIRequest.body = req.body;
  requestLog(APIRequest, "GetRegionById");

  try {
    const { errors, isValid } = validateRegion.validateGetRegionByIdInput(req.params);

    //Check Validation
    if (isValid) {
      return res.status(400).json({ responseCode: 1, isError: true, message: "Validation Failed", errors: errors }).end();
    }

    Region.findOne({ _id: req.params.regionId })
      .then(region => {
        if (!region) {
          return res.status(404).send({
            responseCode: 1, isError: true, errors: {},
            message: "Region not found with id " + req.params.regionId
          });
        }
        res.status(200).send({ responseCode: 0, isError: false, message: 'Region Get successfullly.', data: region });
        responseLog({ responseCode: 0, isError: false, message: '', data: region }, "GetRegionById");
      }).catch(err => {
        if (err.kind === 'ObjectId') {
          return res.status(404).send({
            responseCode: 1, isError: true, errors: {},
            message: "News not found with id " + req.params.regionId
          });
        }
        errorLog(err, "GetRegionById");
        return res.status(500).send({
          responseCode: 9, isError: true, errors: { "message": "common.api.internalerror" },
          message: "Error retrieving Region with id " + req.params.regionId
        });
      });
  } catch (err) {
    errorLog(err, "GetRegionById");
    res.status(400).send({ responseCode: 1, isError: true, errors: {}, message: err });
  }
});


// @route   PUT api/private/v1/regions/editRegion
// @desc    Update a Region with regionid 
// @body   {"locale" : "", "regionname":"","status":""}
// @access  Public
router.put('/editRegion', function (req, res) {

  var q = urlPath.parse(req.url, true).query;
  var APIRequest = {};
  APIRequest.params = req.params;
  APIRequest.referer = req.headers['referer'];
  APIRequest.query = q;
  APIRequest.body = req.body;
  requestLog(APIRequest, "editRegion");

  try {
    const { errors, isValid } = validateRegion.validateRegionFormInput(req.body.regiondata);
    if (isValid) {
      return res.status(400).json({ responseCode: 1, isError: true, message: "Validation Failed", errors: errors }).end();
    }
    var sulgregion = req.body.regiondata.regionname.toString().toLowerCase()
      .replace(/\s+/g, '_')           // Replace spaces with -
      .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
      .replace(/\-\-+/g, '_')         // Replace multiple - with single -
      .replace(/^-+/, '')             // Trim - from start of text
      .replace(/-+$/, '');
    // Find news and update it with the requested newsid
    Region.findOneAndUpdate({ _id: req.body.regiondata.id }, {
      regionname: req.body.regiondata.regionname,
      slug: sulgregion,
      locale: req.body.regiondata.locale,
      status: req.body.regiondata.status,
      date_modified: new Date(),
      modified_by: ''
    }, { new: true })
      .then(region => {
        if (!region) {
          return res.status(400).send({
            responseCode: 1, isError: true, message: "Region not found with id " + req.body.regiondata.id, errors: {}
          });
        }

        Region.find({ status: 1 }).select({ "locale": 1, "regionname": 1, "slug": 1, "_id": 0 })
          .then(regions => {
            let jsondata = {};

            regions.forEach(regiondata => {
              jsondata[regiondata.slug] = regiondata.locale;
            });
            const content = JSON.stringify(jsondata);
            fs.writeFile(filepath + 'region.json', content);

          }).catch(err =>
            errorLog(err, "Selectregion")
          );

        res.status(200).json({ responseCode: 0, isError: false, message: 'Region Edit successfullly.' });
        responseLog({ responseCode: 0, isError: false, message: 'Region Edit successfullly.', data: region }, "editRegion");

      }).catch(err => {

        errorLog(err, "editRegion");
        return res.status(500).send({
          responseCode: 9, isError: true, errors: { "message": "common.api.internalerror" },
          message: "Error updating Region with id " + req.body.regiondata.id
        });
      });

  } catch (err) {
    errorLog(err, "editRegion");
    res.status(400).send({ responseCode: 1, isError: true, errors: {}, message: err });
  }
});

// @route   GET api/private/v1/regions/getallActiveregion
// @desc    Client Page API : Get page by id with status active=1
// @access  Public
router.get('/getallActiveregion', (req, res) => {
  fs.exists(filepath + 'region.json', function (exists) {
    if (exists) {
      fs.readFile(filepath + 'region.json', function readFileCallback(err, data) {
        if (err) {
          return res.status(500).send({
            responseCode: 1,
            isError: true,
            errors: {},
            message: "Error retrieving SiteSetting with id " + req.params.siteid
          });
        } else {
          obj = JSON.parse(data);
          res.status(200).send({ responseCode: 0, isError: false, message: "Request Success", data: obj });
        }
      });
    } else {

      Region.find({ status: 1 }).select({ "locale": 1, "regionname": 1, "slug": 1, "_id": 0 })
        .then(regions => {
          res.status(200).json({ responseCode: 0, isError: false, message: '', data: regions });
          responseLog({ responseCode: 0, isError: false, message: '' }, "getallActiveregion");
        }).catch(err =>
          res.status(404).json({ nopagesfound: 'No Region found' })
        );
    }
  });
});

//Added by Dhara gajera 16/1/2019
// @route   GET api/private/v1/regions/regionsCount
// @desc    Retrieve all count for regions 
// @access  Public
router.get('/regionsCount', function (req, res) {
  var q = urlPath.parse(req.url, true).query;
  var APIRequest = {};
  APIRequest.params = req.params;
  APIRequest.referer = req.headers['referer'];
  APIRequest.query = q;
  APIRequest.body = req.body;
  requestLog(APIRequest, "regionsCount");
  var count = {}

  try {

    Region.count({}).then(regionsCount => {
      count.regionsCount = regionsCount;
      res.status(200);
      res.json({
        responseCode: 0,
        isError: false,
        message: "Request Success",
        data: count
      });
      res.end();
      responseLog({ responseCode: 0, isError: false, message: '', data: count }, "regionsCount");
    });
  } catch (err) {
    errorLog(err, "regionsCount");
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
// Added by Kushal parekh 27-12-2018 for adding Region module - end