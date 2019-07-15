// Added by Kushal parekh 17-10-2018 for adding News module - start
const express = require('express');
const router = express.Router();
const urlPath = require('url');
var logHelper = require('../../../../../helper/logHelper');
const common = require("../../../../../config/common");
var errorLog = logHelper.errorLog;
var responseLog = logHelper.responseLog;
var requestLog = logHelper.requestLog;
const HttpClientrequest = require("request");

// Post model
const News = require('../../../../../models/News/index');

// Validation
const validateNews = require('../../../../../validation/news');

var DdosValidator = require('../../../../setupHelper'); // Added by Bharat Jograna on 20 Jun 2019

router.use(DdosValidator.validateDenialofService());// Added by Bharat Jograna on 20 Jun 2019

// @route   GET api/private/v1/news
// @desc    Retrieve all News
// @access  Public
router.get('/', function (req, res) {
  var q = urlPath.parse(req.url, true).query;
  var APIRequest = {};
  APIRequest.params = req.params;
  APIRequest.query = q;
  requestLog(APIRequest, "ListNews");
  try {
    News.find()
      .then(news => {
        res.status(200);
        res.json({
          responseCode: 0,
          isError: false,
          message: "Request Success",
          data: news
        });
        res.end();
        responseLog({ responseCode: 0, isError: false, message: '', data: news }, "ListNews");
      })
      .catch(err => {
        res.status(500);
        res.json({
          responseCode: 9,
          isError: true,
          errors: { "message": "common.api.internalerror" },
          message: err.message || "Some error occurred while retrieving News."
        });
        res.end();
        errorLog(err, "ListNews");
      });
  } catch (err) {
    errorLog(err, "ListNews");
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

// @route   POST api/private/v1/addNews
// @desc    Add News  
// @body    { "locale" : "",  "from_date" : "", "to_date":"", "from_date":"","sort_order":"","status":""}
// @access  Public
router.post('/addNews', function (req, res) {
  var APIRequest = {};
  APIRequest.body = req.body;
  requestLog(APIRequest, "AddNews");

  try {
    //Check Validation
    const { errors, isValid } = validateNews.validateNewsInput(req.body.newsdata);
    if (isValid) {
      return res.status(400).json({ responseCode: 1, isError: true, message: "Validation Failed", errors: errors }).end();
    }
    News.countDocuments({}, function (err, totalnews) {
      if (err) {
        errorLog(err, "AddNews");
        return res.status(500).json({
          responseCode: 1,
          isError: true,
          message: '',
          errors: { "message": "common.api.internalerror" }
        }).end();
      }
      News.findOne({}, {}, { sort: { 'newsid': -1 } }).then(news_id => {
        let masterId;
        if (totalnews == 0)
          masterId = 1;
        else
          masterId = parseInt(news_id.newsid) + 1;
        const news = new News({
          newsid: masterId,
          locale: req.body.newsdata.locale,
          sort_order: req.body.newsdata.sort_order,
          from_date: req.body.newsdata.from_date,
          to_date: req.body.newsdata.to_date,
          type: req.body.newsdata.type,
          status: req.body.newsdata.status,
          date_created: new Date(),
          date_modified: new Date(),
          created_by: '',
          modified_by: ''
        });

        // Save News in the database
        news.save()
          .then(data => {
            res.status(200).send({ responseCode: 0, isError: false, message: 'News added successfullly.' });
            responseLog({ responseCode: 0, isError: false, message: 'News added successfullly.', data: news }, "AddNews");

            if ((req.body.newsdata.type == 2 || req.body.newsdata.type == 1) && req.body.newsdata.status == 1) {
              var URL = '';
              if (req.body.newsdata.type == 2) {
                URL = common.apiUrl + 'api/GlobalNotification/Announcement';
              }
              if (req.body.newsdata.type == 1) {
                URL = common.apiUrl + 'api/GlobalNotification/News';
              }

              // code for post method type
              var obj = new Object();
              obj.locale = req.body.newsdata.locale;
              obj.type = req.body.newsdata.type;
              obj.date_created = new Date();
              var jsonString = JSON.stringify(obj);
              requestLog(jsonString, "Notification");
              var options = {
                method: 'POST',
                url: URL,
                headers: { 'content-type': 'text/plain' },
                body: jsonString
              }

              //Start the request
              HttpClientrequest(options, function (error, response, body) {

                var statusCode = -1;
                if (response && response.statusCode) {
                  statusCode = response.statusCode;
                }
                try {
                  if (error) {
                    if (typeof error === 'string') {
                      error = JSON.parse(error);
                    }
                    error.statusCode = statusCode;
                    errorLog(error, "Notification");
                  } else {

                    if (!body) {
                      body = {};
                    }
                    if (typeof body === 'string') {
                      body = JSON.parse(body);
                    }
                    body.statusCode = statusCode;
                    responseLog({ responseCode: 0, statusCode: statusCode, isError: false, message: '', data: body }, "Notification");
                  }

                } catch (e) {
                  const responses = {
                    statusCode: statusCode,
                    ReturnMsg: "Unhandle Response.!",
                    ReturnCode: 1,
                    ErrorCode: statusCode
                  }
                  errorLog(responses, "Notification");
                }
              });
            }
          }).catch(error => {
            res.status(500).send({
              responseCode: 9,
              errors: { "message": "common.api.internalerror" },
              isError: true,
              message: error.message || "Some error occurred while creating the News."
            });
            errorLog(error, "AddNews");
          });
      }).catch(error => {
        res.status(500).send({
          responseCode: 9,
          errors: { "message": "common.api.internalerror" },
          isError: true,
          message: error.message || "Some error occurred while retrieving news."
        });
        errorLog(error, "AddNews");
      });
    });
  } catch (err) {
    errorLog(err, "AddNews");
    res.status(400).send({ responseCode: 1, errors: {}, isError: true, message: err });
  }
});


// @route   GET api/private/v1/news/getNewsById/:newsId
// @desc    Retrieve a single news with newsId 
// @access  Public
router.get('/getNewsById/:newsId', function (req, res) {

  var q = urlPath.parse(req.url, true).query;
  var APIRequest = {};
  APIRequest.params = req.params;
  APIRequest.query = q;
  requestLog(APIRequest, "GetNewsById");

  try {
    const { errors, isValid } = validateNews.validateGetNewsByIdInput(req.params);

    //Check Validation
    if (isValid) {
      return res.status(400).json({ responseCode: 1, isError: true, message: "Validation Failed", errors: errors }).end();
    }

    News.findOne({ _id: req.params.newsId })
      .then(news => {

        if (!news) {
          return res.status(404).send({
            responseCode: 1, isError: true,
            message: "News not found with id " + req.params.newsId
          });
        }
        res.status(200).send({ responseCode: 0, isError: false, message: 'News Get successfullly.', data: news });
        responseLog({ responseCode: 0, isError: false, message: '', data: news }, "GetNewsById");
      }).catch(err => {
        if (err.kind === 'ObjectId') {
          return res.status(404).send({
            responseCode: 1, errors: {}, isError: true,
            message: "News not found with id " + req.params.newsId
          });
        }
        errorLog(err, "GetNewsById");
        return res.status(500).send({
          responseCode: 9, isError: true, errors: { "message": "common.api.internalerror" },
          message: "Error retrieving News with id " + req.params.newsId
        });
      });
  } catch (err) {
    errorLog(err, "GetNewsById");
    res.status(400).send({ responseCode: 1, errors: {}, isError: true, message: err });
  }
});


// @route   PUT api/private/v1/news/editNews
// @desc    Update a news with newsid 
// @body   { "newsid":"", "locale" : "", "from_date" : "", "to_date":"", "from_date":"","sort_order":"","status":""}
// @access  Public
router.put('/editNews', function (req, res) {

  var q = urlPath.parse(req.url, true).query;
  var APIRequest = {};
  APIRequest.params = req.params;
  APIRequest.query = q;
  requestLog(APIRequest, "editNews");

  try {
    const { errors, isValid } = validateNews.validateNewsInput(req.body.newsdata);
    if (isValid) {
      return res.status(400).json({ responseCode: 1, isError: true, message: "Validation Failed", errors: errors }).end();
    }
    // Find news and update it with the requested newsid
    News.findOneAndUpdate({ _id: req.body.newsdata.id }, {
      locale: req.body.newsdata.locale,
      sort_order: req.body.newsdata.sort_order,
      from_date: req.body.newsdata.from_date,
      to_date: req.body.newsdata.to_date,
      type: req.body.newsdata.type,
      status: req.body.newsdata.status,
      date_modified: new Date(),
      modified_by: ''
    }, { new: true })
      .then(news => {
        if (!news) {
          return res.status(400).send({
            responseCode: 1, isError: true, message: "News not found with id " + req.body.newsdata.newsid, errors: {},
          });
        }

        res.status(200).json({ responseCode: 0, isError: false, message: 'News Edit successfullly.' });
        responseLog({ responseCode: 0, isError: false, message: 'News Edit successfullly.', data: news }, "editNews");

      }).catch(err => {

        errorLog(err, "editNews");
        return res.status(500).send({
          responseCode: 9, isError: true, errors: { "message": "common.api.internalerror" },
          message: "Error updating News with id " + req.body.newsdata.newsid
        });
      });

  } catch (err) {
    errorLog(err, "editNews");
    res.status(400).send({ responseCode: 1, isError: true, errors: {}, message: err });
  }
});


// @route   DELETE api/private/v1/news/deleteNews/:newsId
// @desc    Delete a News with newsId 
// @access  Public
router.delete('/deleteNews/:newsId', function (req, res) {

  var q = urlPath.parse(req.url, true).query;
  var APIRequest = {};
  APIRequest.params = req.params;
  APIRequest.query = q;
  requestLog(APIRequest, "DeleteNews");

  try {

    const { errors, isValid } = validateNews.validateDeleteNewsInput(req.params);

    // Check Validation
    if (isValid) {
      return res.status(400).send({ responseCode: 1, isError: true, message: errors });
    }

    News.findOneAndDelete({ _id: req.params.newsId })
      .then(news => {

        if (!news) {
          return res.status(404).send({
            responseCode: 1, isError: true,
            message: "News not found with id " + req.params.newsId
          });
        }

        res.status(200).json({ responseCode: 0, isError: false, message: 'News deleted successfully.' });
        responseLog({ responseCode: 0, isError: false, message: 'News deleted Successfully.', data: news }, "DeleteNews");

      }).catch(err => {

        errorLog(err, "DeleteNews");
        return res.status(500).send({
          responseCode: 9, isError: true, errors: { "message": "common.api.internalerror" },
          message: "Could not delete News with id " + req.params.newsId
        });
      });

  } catch (err) {
    errorLog(err, "DeleteNews");
    res.status(400).send({ responseCode: 1, isError: true, message: err, data: '' });
  }
});



// @route   GET api/private/v1/news/getActiveNews
// @desc    Retrieve all Active News
// @access  Public
router.get('/getActiveNews', function (req, res) {
  var q = urlPath.parse(req.url, true).query;
  var APIRequest = {};
  APIRequest.params = req.params;
  APIRequest.query = q;
  requestLog(APIRequest, "ListNews");
  try {
    News.find({ status: 1, type: 1 })
      .sort({ sort_order: 'asc', newsid: 'desc' })
      .then(news => {
        res.status(200);
        res.json({
          responseCode: 0,
          isError: false,
          message: "Request Success",
          data: news
        });
        res.end();
        responseLog({ responseCode: 0, isError: false, message: '', data: news }, "ListNews");
      })
      .catch(err => {
        res.status(500);
        res.json({
          responseCode: 1,
          isError: true,
          message: err.message || "Some error occurred while retrieving News."
        });
        res.end();
        errorLog(err, "ListNews");
      });
  } catch (err) {
    errorLog(err, "ListNews");
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

// @route   GET api/private/v1/news/getActiveAnnouncement
// @desc    Retrieve all Active Announcement
// @access  Public
router.get('/getActiveAnnouncement', function (req, res) {
  var q = urlPath.parse(req.url, true).query;
  var APIRequest = {};
  APIRequest.params = req.params;
  APIRequest.query = q;
  requestLog(APIRequest, "ListAnnouncement");
  try {
    News.find({ status: 1, type: 2 })
      .sort({ sort_order: 'asc', newsid: 'desc' })
      .then(news => {
        res.status(200);
        res.json({
          responseCode: 0,
          isError: false,
          message: "Request Success",
          data: news
        });
        res.end();
        responseLog({ responseCode: 0, isError: false, message: '', data: news }, "ListAnnouncement");
      })
      .catch(err => {
        res.status(500);
        res.json({
          responseCode: 1,
          isError: true,
          message: err.message || "Some error occurred while retrieving Announcement."
        });
        res.end();
        errorLog(err, "ListAnnouncement");
      });
  } catch (err) {
    errorLog(err, "ListAnnouncement");
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

//Added by Dhara gajera 17/1/2019
// @route   GET api/private/v1/news/newsCount
// @desc    Retrieve all count for news
// @access  Public
router.get('/newsCount', function (req, res) {
  var APIRequest = {};
  var count = {}
  requestLog(APIRequest, "newsCount");
  try {
    News.countDocuments({}).then(newscount => {
      count.newsCount = newscount;
      res.status(200);
      res.json({
        responseCode: 0,
        isError: false,
        message: "Request Success",
        data: count
      });
      res.end();
      responseLog({ responseCode: 0, isError: false, message: '', data: count }, "newsCount");
    });
  } catch (err) {
    errorLog(err, "newsCount");
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
// Added by Kushal Parekh 17-10-2018 for adding News module - end