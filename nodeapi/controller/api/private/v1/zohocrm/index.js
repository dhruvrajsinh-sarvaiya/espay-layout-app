// Added by Jayesh Pathak 27-12-2018 for adding CRM module - start
const express = require('express');
const router = express.Router();
var logHelper = require('../../../../../helper/logHelper');
var commanData = require('../../../../../config/common');
var request = require("request");
var errorLog = logHelper.errorLog;
var responseLog = logHelper.responseLog;
var requestLog = logHelper.requestLog;

// Load Input Validation
const validateCRMForm = require('../../../../../validation/crmform');

var DdosValidator = require('../../../../setupHelper'); // Added by Bharat Jograna on 20 Jun 2019

router.use(DdosValidator.validateDenialofService());// Added by Bharat Jograna on 20 Jun 2019

// @route   POST api/private/v1/zohocrm/addCrmForm
// @desc    Create a new CRM Form Data  
// @body    { crmdata : { } }
// @access  Public
router.post('/addCrmForm', function (req, res) {

      var APIRequest = {};
      APIRequest.body = req.body.crmdata;
      requestLog(APIRequest, "AddCrmForm");

      try {

            const { errors, isValid } = validateCRMForm.validateAddCRMInput(req.body.crmdata);

            // Check Validation
            if (!isValid) {
                  return res.status(400).json({
                        responseCode: 1,
                        isError: true,
                        message: '', errors: errors
                  }).end();
            }

            var options = {
                  method: 'POST',
                  url: commanData.zohoFormUrl,
                  headers: { 'content-type': 'multipart/form-data' },
                  formData:
                  {
                        "xnQsjsdp": commanData.xnQsjsdp,
                        "zc_gad": commanData.zc_gad,
                        "xmIwtLD": commanData.xmIwtLD,
                        "actionType": commanData.actionType,
                        "returnURL": commanData.returnURL,
                        "ldeskuid": commanData.ldeskuid,
                        "LDTuvid": commanData.LDTuvid,
                        "First Name": req.body.crmdata.firstName,
                        "Last Name": req.body.crmdata.lastName,
                        "Company": req.body.crmdata.company,
                        "Phone": req.body.crmdata.phone,
                        "Description": req.body.crmdata.description
                  }
            };

            request(options, function (error, response, body) {

                  if (error) {

                        errorLog(JSON.stringify(error), "AddCrmForm");

                        res.status(400).json({ responseCode: 1, isError: true, message: "common.form.add.failure" });

                  } else {

                        responseLog({ responseCode: 0, isError: false, message: "common.form.add.success", data: JSON.stringify(body) }, "AddCrmForm");

                        var statusCode = -1;

                        if (response && response.statusCode) {
                              statusCode = response.statusCode;
                        }

                        if (statusCode === 200) {
                              res.status(statusCode).json({ responseCode: 0, isError: false, message: "common.form.add.success" });
                        } else {
                              res.status(400).json({ responseCode: 1, isError: true, message: "common.form.add.failure" });
                        }

                  }

            });

      } catch (err) {

            errorLog(err, "AddCrmForm");
            return res.status(400).json({
                  responseCode: 9,
                  isError: true,
                  message: '',
                  errors: err.message || "common.api.internalerror"
            }).end();
      }
});

module.exports = router;
// Added by Jayesh Pathak 27-12-2018 for adding CRM module - end