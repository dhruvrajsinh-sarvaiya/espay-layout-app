// Added by Jayesh PAthak 09-10-2018 for adding country module - start
const express = require('express');
const router = express.Router();
const urlPath = require('url');
var logHelper = require('../../../../../helper/logHelper');
var errorLog = logHelper.errorLog;
var responseLog = logHelper.responseLog;
var requestLog = logHelper.requestLog;

// Load Input Validation
const validateContact = require('../../../../../validation/contactus');

// Load ContactUs model
const ContactUs = require('../../../../../models/ContactUs/index');

var DdosValidator = require('../../../../setupHelper'); // Added by Bharat Jograna on 20 Jun 2019

router.use(DdosValidator.validateDenialofService());// Added by Bharat Jograna on 20 Jun 2019

// @route   GET api/private/v1/contactus/listContactUs/:page?/:perpage?/:searchValue?/:orderBy?/:sortOrder?
// @desc    Retrieve all contacts with pagination ( page, perpage,searchValue,orderBy,sortOrder are optional )
// @access  Public
router.get('/listContactUs/:page?/:perpage?/:searchValue?/:orderBy?/:sortOrder?', function (req, res) {

  var q = urlPath.parse(req.url, true).query;
  var APIRequest = {};
  APIRequest.params = req.params;
  APIRequest.query = q;
  requestLog(APIRequest, "ListContactUs");

  try {

    if (typeof req.params.page != 'undefined' && req.params.page.length > 0 && req.params.page == 'all') {

      ContactUs.find({}, { _id: false }).then(contactcount => {

        ContactUs.find({}, { _id: false })
          .then(contacts => {

            res.status(200).json({ responseCode: 0, isError: false, message: '', data: contacts });
            responseLog({ responseCode: 0, isError: false, message: '', data: contacts, totalCount: contactcount.length }, "ListContactUs");

          }).catch(err => {

            errorLog(err, "ListContactUs");

            return res.status(500).json({
              responseCode: 1,
              isError: true,
              message: '',
              errors: err.message || "common.api.fetcherror"
            }).end();

          });

      }).catch(err => {

        errorLog(err, "ListContactUs");

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
      let sortBy = "id";
      let sortOrder = 1;
      let searchValue = '.*.*';

      if (typeof req.params.page != 'undefined' && Number(req.params.page) > 0)
        page = Number(req.params.page);

      if (typeof req.params.perpage != 'undefined' && Number(req.params.perpage) > 0)
        perpage = Number(req.params.perpage);

      if (typeof req.params.orderBy != 'undefined' && (req.params.orderBy == 'id' || req.params.orderBy == 'email' || req.params.orderBy == 'subject' || req.params.orderBy == 'description' || req.params.orderBy == 'date_added'))
        sortBy = req.params.orderBy;

      if (typeof req.params.sortOrder != 'undefined' && (Number(req.params.sortOrder) == -1 || Number(req.params.sortOrder) == 1))
        sortOrder = Number(req.params.sortOrder);

      if (typeof req.params.searchValue != 'undefined' && req.params.searchValue != 'null' && req.params.searchValue != null && req.params.searchValue.trim() != '' && req.params.searchValue.length > 0)
        searchValue = '.*' + req.params.searchValue + '.*';

      let sortPair = {}
      sortPair[sortBy] = sortOrder;

      ContactUs.find({ $or: [{ email: new RegExp(searchValue, "i") }, { subject: new RegExp(searchValue, "i") }, { description: new RegExp(searchValue, "i") }] }, { _id: false }, { sort: sortPair, skip: (perpage * page), limit: perpage })
        .then(contacts => {

          ContactUs.countDocuments({ $or: [{ email: new RegExp(searchValue, "i") }, { subject: new RegExp(searchValue, "i") }, { description: new RegExp(searchValue, "i") }] }, function (err, contactcount) {
            if (err) {
              errorLog(err, "ListContactUs");
              return res.status(500).json({
                responseCode: 1,
                isError: true,
                message: '',
                errors: err.message || "common.api.fetcherror"
              }).end();

            }

            res.status(200).json({ responseCode: 0, isError: false, message: '', data: contacts, totalCount: contactcount });
            responseLog({ responseCode: 0, isError: false, message: '', data: contacts, totalCount: contactcount }, "ListContactUs");

          });

        }).catch(err => {

          errorLog(err, "ListContactUs");

          return res.status(500).json({
            responseCode: 1,
            isError: true,
            message: '',
            errors: err.message || "common.api.fetcherror"
          }).end();

        });

    }

  } catch (err) {

    errorLog(err, "ListContactUs");
    return res.status(400).json({
      responseCode: 9,
      isError: true,
      message: '',
      errors: err.message || "common.api.internalerror"
    }).end();
  }

});

// @route   POST api/private/v1/contactus/addContact
// @desc    Create a new Contact  
// @body    { "email" : "",  "subject" : "", "description" : "", "attachedFile" : "" }
// @access  Public
router.post('/addContact', function (req, res) {

  var APIRequest = {};
  APIRequest.body = req.body.contactdata;
  requestLog(APIRequest, "AddContact");

  try {

    const { errors, isValid } = validateContact.validateAddContactUsInput(req.body.contactdata);

    // Check Validation
    if (!isValid) {
      return res.status(400).json({
        responseCode: 1,
        isError: true,
        message: '', data: errors
      }).end();
    }

    let attachedFileNewName = "";

    let contactParseData = req.body.contactdata;

    ContactUs.countDocuments({}, function (err, totalcontacts) {
      if (err) {
        errorLog(err, "AddContact");
        return res.status(500).json({
          responseCode: 1,
          isError: true,
          message: '',
          data: 500
        }).end();
      }
      ContactUs.findOne({}, {}, { sort: { 'id': -1 } }).then(data => {
        var masterId;
        if (totalcontacts == 0)
          masterId = 1;
        else
          masterId = data.id + 1;

        const contact = new ContactUs({
          id: masterId, //(data.id + 1),
          email: contactParseData.email,
          subject: contactParseData.subject,
          description: contactParseData.description,
          attachedFile: attachedFileNewName
        });

        // Save ContactUs in the database
        contact.save()
          .then(() => {

            res.status(200).json({ responseCode: 0, isError: false, message: "common.form.add.success" });
            responseLog({ responseCode: 0, isError: false, message: "common.form.add.success" }, "AddContact");

          }).catch(error => {

            errorLog(error, "AddContact");
            return res.status(500).json({
              responseCode: 1,
              isError: true,
              message: '',
              data: 500
            }).end();

          });

      }).catch(error => {

        errorLog(error, "AddContact");
        return res.status(500).json({
          responseCode: 1,
          isError: true,
          message: '',
          data: 500
        }).end();

      });

    });

  } catch (err) {

    errorLog(err, "AddContact");
    return res.status(400).json({
      responseCode: 9,
      isError: true,
      message: '',
      data: "common.api.internalerror"
    }).end();
  }

});

//Added by Dhara gajera 17/1/2019
// @route   GET api/private/v1/contactus/contactUsCount
// @desc    Retrieve all count for contactus
// @access  Public
router.get('/contactUsCount', function (req, res) {
  var APIRequest = {};
  var count = {}
  requestLog(APIRequest, "contactUsCount");
  try {
    ContactUs.countDocuments({}).then(contactUsCount => {
      count.contactUsCount = contactUsCount;
      res.status(200);
      res.json({
        responseCode: 0,
        isError: false,
        message: "Request Success",
        data: count
      });
      res.end();
      responseLog({ responseCode: 0, isError: false, message: '', data: count }, "contactUsCount");
    });
  } catch (err) {
    errorLog(err, "contactUsCount");
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
// Added by Jayesh PAthak 09-10-2018 for adding country module - start