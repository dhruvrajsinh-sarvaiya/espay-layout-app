// Added by Kushal parekh 18-10-2018 for adding Pages module - start
const express = require('express');
const router = express.Router();
const urlPath = require('url');
var logHelper = require('../../../../../helper/logHelper');
var errorLog = logHelper.errorLog;
var responseLog = logHelper.responseLog;
var requestLog = logHelper.requestLog;

// Page model
const Page = require('../../../../../models/Page/index');

// Validation
const validatePage = require('../../../../../validation/pages');

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

// @route   GET api/private/v1/pages/getallpages/:pagetypeId"
// @desc    Retrieve all Pages
// @access  Public
router.get('/getallpages/:pagetypeId?', function (req, res) {
  var q = urlPath.parse(req.url, true).query;
  var APIRequest = {};
  APIRequest.params = req.params;
  APIRequest.referer = req.headers['referer'];
  APIRequest.query = q;
  APIRequest.body = req.body;
  requestLog(APIRequest, "ListPages");
  try {
    let checkpagetype = '.*.*';
    if (typeof req.params.pagetypeId != 'undefined' && req.params.pagetypeId != '' && (req.params.pagetypeId == 1 || req.params.pagetypeId == 2)) {
      checkpagetype = '.*' + req.params.pagetypeId + '.*';
    }
    Page.find({ $or: [{ "page_type": new RegExp(checkpagetype, "i") }] })
      .then(pages => {
        res.status(200);
        res.json({
          responseCode: 0,
          isError: false,
          message: "Request Success",
          data: pages
        });
        res.end();
        responseLog({ responseCode: 0, isError: false, message: '', data: pages }, "ListPages");
      })
      .catch(err => {
        res.status(500);
        res.json({
          responseCode: 9,
          isError: true,
          errors: { "message": "common.api.internalerror" },
          message: err.message || "Some error occurred while retrieving Pages."
        });
        res.end();
        errorLog(err, "ListPages");
      });
  } catch (err) {
    errorLog(err, "ListPages");
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
// @body    { "locale" : "","route":"","sort_order":"","status":""}
// @access  Public
router.post('/addPage', function (req, res) {
  var q = urlPath.parse(req.url, true).query;
  var APIRequest = {};
  APIRequest.params = req.params;
  APIRequest.referer = req.headers['referer'];
  APIRequest.query = q;
  APIRequest.body = req.body;
  requestLog(APIRequest, "AddNews");

  try {
    //Check Validation
    const { errors, isValid } = validatePage.validateCmsPageInput(req.body.pagedata);
    if (isValid) {
      return res.status(400).json({ responseCode: 1, isError: true, message: "Validation Failed", errors: errors }).end();
    }
    const newPage = new Page({
      locale: req.body.pagedata.locale,
      layout_id: 1,
      channel_id: 1,
      page_type: req.body.pagedata.page_type,
      sort_order: req.body.pagedata.sort_order,
      route: req.body.pagedata.route,
      status: req.body.pagedata.status,
      date_created: new Date(),
      date_modified: new Date(),
      created_by: '',
      modified_by: ''
    });

    // Save News in the database
    newPage.save()
      .then(data => {
        res.status(200).send({ responseCode: 0, isError: false, message: 'Page added successfullly.' });
        responseLog({ responseCode: 0, isError: false, message: 'Page added successfullly.', data: page }, "AddPage");
      }).catch(err => {
        res.status(500).send({
          responseCode: 9,
          isError: true,
          errors: { "message": "common.api.internalerror" },
          message: err.message || "Some error occurred while creating the Page."
        });
        errorLog(err, "AddPage");
      });

  } catch (err) {
    errorLog(err, "AddPage");
    res.status(400).send({ responseCode: 2, errors: {}, isError: true, message: err });
  }
});

// @route   GET api/private/v1/pages/getpagebyid/:id
// @desc    Get page by id with for backoffice
// @access  Public
router.get('/getpagebyid/:pageId', (req, res) => {

  var q = urlPath.parse(req.url, true).query;
  var APIRequest = {};
  APIRequest.params = req.params;
  APIRequest.referer = req.headers['referer'];
  APIRequest.query = q;
  APIRequest.body = req.body;
  requestLog(APIRequest, "GetPageById");

  try {
    const { errors, isValid } = validatePage.validateGetPageByIdInput(req.params);

    //Check Validation
    if (isValid) {
      return res.status(400).json({ responseCode: 1, isError: true, message: "Validation Failed", errors: errors }).end();
    }

    Page.findOne({ _id: req.params.pageId })
      .then(page => {
        if (!page) {
          return res.status(404).send({
            responseCode: 1, isError: true, errors: {},
            message: "Page not found with id " + req.params.pageId
          });
        }
        res.status(200).send({ responseCode: 0, isError: false, message: 'Page Get successfullly.', data: page });
        responseLog({ responseCode: 0, isError: false, message: '', data: page }, "GetPageById");
      }).catch(err => {
        if (err.kind === 'ObjectId') {
          return res.status(404).send({
            responseCode: 1, isError: true, errors: {},
            message: "News not found with id " + req.params.pageId
          });
        }
        errorLog(err, "GetPageById");
        return res.status(500).send({
          responseCode: 9, isError: true, errors: { "message": "common.api.internalerror" },
          message: "Error retrieving Page with id " + req.params.pageId
        });
      });
  } catch (err) {
    errorLog(err, "GetPageById");
    res.status(400).send({ responseCode: 1, isError: true, errors: {}, message: err });
  }
});


// @route   PUT api/private/v1/news/editPage
// @desc    Update a Page with pageid 
// @body   {"locale" : "", "route":"" ,"sort_order":"","status":""}
// @access  Public
router.put('/editPage', function (req, res) {

  var q = urlPath.parse(req.url, true).query;
  var APIRequest = {};
  APIRequest.params = req.params;
  APIRequest.referer = req.headers['referer'];
  APIRequest.query = q;
  APIRequest.body = req.body;
  requestLog(APIRequest, "editPage");

  try {
    const { errors, isValid } = validatePage.validateCmsPageInput(req.body.pagedata);
    if (isValid) {
      return res.status(400).json({ responseCode: 1, isError: true, message: "Validation Failed", errors: errors }).end();
    }

    // Find news and update it with the requested newsid
    Page.findOneAndUpdate({ _id: req.body.pagedata.id }, {
      locale: req.body.pagedata.locale,
      layout_id: 1,
      channel_id: 1,
      page_type: req.body.pagedata.page_type,
      sort_order: req.body.pagedata.sort_order,
      route: req.body.pagedata.route,
      status: req.body.pagedata.status,
      date_modified: new Date(),
      modified_by: ''
    }, { new: true })
      .then(page => {
        if (!page) {
          return res.status(400).send({
            responseCode: 1, isError: true, message: "Page not found with id " + req.body.pagedata.id, errors: {}
          });
        }

        res.status(200).json({ responseCode: 0, isError: false, message: 'Page Edit successfullly.' });
        responseLog({ responseCode: 0, isError: false, message: 'Page Edit successfullly.', data: page }, "editPage");

      }).catch(err => {

        errorLog(err, "editPage");
        return res.status(500).send({
          responseCode: 9, isError: true, errors: { "message": "common.api.internalerror" },
          message: "Error updating Page with id " + req.body.pagedata.id
        });
      });

  } catch (err) {
    errorLog(err, "editPage");
    res.status(400).send({ responseCode: 1, isError: true, errors: {}, message: err });
  }
});

//Added by Dhara gajera 16/1/2019
// @route   GET api/private/v1/pages/pagesCount
// @desc    Retrieve all count for Pages
// @access  Public
router.get('/pagesCount', function (req, res) {
  var q = urlPath.parse(req.url, true).query;
  var APIRequest = {};
  APIRequest.params = req.params;
  APIRequest.referer = req.headers['referer'];
  APIRequest.query = q;
  APIRequest.body = req.body;
  requestLog(APIRequest, "ListPages");
  var count = {}

  try {
    Page.countDocuments({}).then(pagecount => {
      count.pagesCount = pagecount;
      if (typeof count.pagesCount != "undefined" && count.pagesCount != null) {
        Page.countDocuments({ $or: [{ "page_type": new RegExp(2, "i") }] })
          .then(polocycount => {
            count.policyManagementCount = polocycount;
            res.status(200);
            res.json({
              responseCode: 0,
              isError: false,
              message: "Request Success",
              data: count
            });
            res.end();
            responseLog({ responseCode: 0, isError: false, message: '', data: count }, "pagesData");
          });
      }
    });
  } catch (err) {
    errorLog(err, "pagesData");
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

// @route   GET api/private/v1/pages/:id
// @desc    Client Page API : Get page by id with status active=1
// @access  Public
router.get('/:id', (req, res) => {
  Page.findOne({ _id: req.params.id, status: 1 }).select('locale')
    .then(page => res.json(page))
    .catch(err =>
      res.status(404).json({ nopagesfound: 'No page found with that ID' })
    );
});

module.exports = router;
// Added by Kushal parekh 18-10-2018 for adding Pages module - start