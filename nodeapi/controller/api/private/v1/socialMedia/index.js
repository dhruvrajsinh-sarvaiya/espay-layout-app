// Added by Megha Kariya (09/02/2019) Social Media Configuration - start
const express = require('express');
const router = express.Router();
const urlPath = require('url');
var logHelper = require('../../../../../helper/logHelper');
var errorLog = logHelper.errorLog;
var responseLog = logHelper.responseLog;
var requestLog = logHelper.requestLog;

// Social Media model
const SocialMedia = require('../../../../../models/SocialMedia/index');

// Validation
const validateMedia = require('../../../../../validation/socialMedias');

// validateCmsSocialMediaInput
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

// @route   GET api/private/v1/socialMedia/getAllSocialMedia/:mediatypeId"
// @desc    Retrieve all Social Medias
// @access  Public
router.get('/getAllSocialMedia/:mediatypeId?', function (req, res) {
  var q = urlPath.parse(req.url, true).query;
  var APIRequest = {};
  APIRequest.params = req.params;
  APIRequest.referer = req.headers['referer'];
  APIRequest.query = q;
  APIRequest.body = req.body;
  requestLog(APIRequest, "ListSocialMedia");
  try {
    let checkMediaType = '.*.*';
    if (typeof req.params.mediatypeId != 'undefined' && req.params.mediatypeId != '' && (req.params.mediatypeId == 1 || req.params.mediatypeId == 2)) {
      checkMediaType = '.*' + req.params.mediatypeId + '.*';
    }
    SocialMedia.find({ $or: [{ "social_media_type": new RegExp(checkMediaType, "i") }] })
      .then(Medias => {
        res.status(200);
        res.json({
          responseCode: 0,
          isError: false,
          message: "Request Success",
          data: Medias
        });
        res.end();
        responseLog({ responseCode: 0, isError: false, message: '', data: Medias }, "ListSocialMedia");
      })
      .catch(err => {
        res.status(500);
        res.json({
          responseCode: 9,
          isError: true,
          errors: { "message": "common.api.internalerror" },
          message: err.message || "Some error occurred while retrieving Social Medias."
        });
        res.end();
        errorLog(err, "ListSocialMedia");
      });
  } catch (err) {
    errorLog(err, "ListSocialMedia");
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

// @route   POST api/private/v1/socialMedia/addMedia
// @desc    Add Social Media  
// @body    {"mediaData":{"social_media_type":1,"name":"Twitter","details":{"username":"paro","source":"abc"},"status":1}}
// @access  Public
router.post('/addMedia', function (req, res) {
  var q = urlPath.parse(req.url, true).query;
  var APIRequest = {};
  APIRequest.params = req.params;
  APIRequest.referer = req.headers['referer'];
  APIRequest.query = q;
  APIRequest.body = req.body;
  requestLog(APIRequest, "AddMedia");

  try {
    //Check Validation
    const { errors, isValid } = validateMedia.validateCmsSocialMediaInput(req.body.mediaData);
    if (isValid) {
      return res.status(400).json({ responseCode: 1, isError: true, message: "Validation Failed", errors: errors }).end();
    }
    var name = '';
    if (req.body.mediaData.social_media_type === "1") {
      name = "Twitter";
    }
    else if (req.body.mediaData.social_media_type === "2") {
      name = "Facebook";
    }
    const newMedia = new SocialMedia({
      social_media_type: req.body.mediaData.social_media_type,
      name: name,
      details: req.body.mediaData.details,
      status: req.body.mediaData.status,
      date_created: new Date(),
      date_modified: new Date(),
      created_by: '',
      modified_by: ''
    });

    // Save Social Media in the database
    newMedia.save()
      .then(data => {

        res.status(200).send({ responseCode: 0, isError: false, message: 'Social Media added successfullly.' });
        responseLog({ responseCode: 0, isError: false, message: 'Social Media added successfullly.', data: data }, "AddMedia");
      }).catch(err => {
        res.status(500).send({
          responseCode: 9,
          isError: true,
          errors: { "message": "common.api.internalerror" },
          message: err.message || "Some error occurred while creating the Social Media."
        });
        errorLog(err, "AddMedia");
      });

  } catch (err) {
    errorLog(err, "AddMedia");
    res.status(400).send({ responseCode: 2, errors: {}, isError: true, message: err });
  }
});


// @route   PUT api/private/v1/socialMedia/editMedia
// @desc    Update a Social Media with Media id 
// @body   {"mediaData":{"social_media_type":2,"name":"Facebook","details":{"appId":"paro","pageUrl":"abc"},"status":1,"id":"5c5eb88fe22e7d31a89802e0"}}
// @access  Public
router.put('/editMedia', function (req, res) {

  var q = urlPath.parse(req.url, true).query;
  var APIRequest = {};
  APIRequest.params = req.params;
  APIRequest.referer = req.headers['referer'];
  APIRequest.query = q;
  APIRequest.body = req.body;
  requestLog(APIRequest, "editMedia");

  try {
    const { errors, isValid } = validateMedia.validateCmsSocialMediaInput(req.body.mediaData);
    if (isValid) {

      return res.status(400).json({ responseCode: 1, isError: true, message: "Validation Failed", errors: errors }).end();
    }
    var name = '';
    if (req.body.mediaData.social_media_type === "1") {
      name = "Twitter";
    }
    else if (req.body.mediaData.social_media_type === "2") {
      name = "Facebook";
    }
    // Find social media and update it with the requested media id
    SocialMedia.findOneAndUpdate({ _id: req.body.mediaData.id }, {

      social_media_type: req.body.mediaData.social_media_type,
      name: name,
      details: req.body.mediaData.details,
      status: req.body.mediaData.status,
      date_modified: new Date(),
      modified_by: ''
    }, { new: true })
      .then(Media => {
        if (!Media) {
          return res.status(400).send({
            responseCode: 1, isError: true, message: "Social Media not found with id " + req.body.mediaData.id, errors: {}
          });
        }

        res.status(200).json({ responseCode: 0, isError: false, message: 'Social Media Edit successfullly.' });
        responseLog({ responseCode: 0, isError: false, message: 'Social Media Edit successfullly.', data: Media }, "editMedia");

      }).catch(err => {

        errorLog(err, "editMedia");
        return res.status(500).send({
          responseCode: 9, isError: true, errors: { "message": "common.api.internalerror" },
          message: "Error updating Social Media with id " + req.body.mediaData.id
        });
      });

  } catch (err) {
    errorLog(err, "editMedia");
    res.status(400).send({ responseCode: 1, isError: true, errors: {}, message: err });
  }
});

module.exports = router;
// Added by Megha Kariya (09/02/2019) Social Media Configuration - end