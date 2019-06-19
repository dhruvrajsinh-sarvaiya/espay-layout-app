// Added by Jayesh Pathak 17-12-2018 for adding servey module - start
const express = require('express');
const router = express.Router();
const urlPath = require('url');
var logHelper = require('../../../../../helper/logHelper');
var errorLog = logHelper.errorLog;
var responseLog = logHelper.responseLog;
var requestLog = logHelper.requestLog;

// Load Input Validation
const validateSurveys = require('../../../../../validation/surveys');

// Load Surveys model
const Surveys = require('../../../../../models/Surveys/index');

// @route   GET api/private/v1/surveys/listSurvey
// @desc    Retrieve all surveys 
// @access  Public
router.get('/listSurveys', function (req, res) {

  var q = urlPath.parse(req.url, true).query;
  var APIRequest = {};
  APIRequest.params = req.params;
  APIRequest.referer = req.headers['referer'];
  APIRequest.query = q;
  APIRequest.body = req.body;
  requestLog(APIRequest, "ListSurveys");

  try {

    Surveys.Surveys.find({}, {}, { _id: false })
      .then(Surveysdata => {

        res.status(200).json({ responseCode: 0, isError: false, message: '', data: Surveysdata });
        responseLog({ responseCode: 0, isError: false, message: '', data: Surveysdata }, "ListSurveys");

      }).catch(err => {

        errorLog(err, "ListSurveys");

        return res.status(500).json({
          responseCode: 1,
          isError: true,
          message: '',
          errors: err.message || "common.api.fetcherror"
        }).end();

      });

  } catch (err) {

    errorLog(err, "ListSurveys");
    return res.status(400).json({
      responseCode: 9,
      isError: true,
      message: '',
      errors: err.message || "common.api.internalerror"
    }).end();
  }

});

// @route   POST api/private/v1/surveys/addSurvey
// @desc    Create a new survey  
// @body    { "surveyName" : "" }
// @access  Public
router.post('/addSurvey', function (req, res) {

  var q = urlPath.parse(req.url, true).query;
  var APIRequest = {};
  APIRequest.params = req.params;
  APIRequest.referer = req.headers['referer'];
  APIRequest.query = q;
  APIRequest.body = req.body;
  requestLog(APIRequest, "AddSurvey");

  try {

    const { errors, isValid } = validateSurveys.validateAddSurveyInput(req.body.surveydata);

    // Check Validation
    if (!isValid) {
      return res.status(400).json({
        responseCode: 1,
        isError: true,
        message: '', errors: errors
      }).end();
    }

    if (req.body.surveydata.status == 1) {
      Surveys.Surveys.update({ category_id: req.body.surveydata.category_id }, { status: 0 }, { multi: true }, function (err) {
        if (err) {
          return res.status(400).json({
            responseCode: 1,
            isError: true,
            message: '',
            errors: "common.api.datanotfound" + req.body.surveyupdatedata.category_id
          }).end();
        }

        const survey = new Surveys.Surveys({
          locale: req.body.surveydata.locale,
          json: req.body.surveydata.surveyJson,
          category_id: req.body.surveydata.category_id,
          status: req.body.surveydata.status
        });

        // Save Survey in the database
        survey.save()
          .then(data => {

            res.status(200).json({ responseCode: 0, isError: false, message: "common.form.add.success" });
            responseLog({ responseCode: 0, isError: false, message: "common.form.add.success" }, "AddSurvey");

          }).catch(err => {

            errorLog(err, "AddSurvey");

            return res.status(500).json({
              responseCode: 1,
              isError: true,
              message: '',
              errors: err.message || "common.api.adderror"
            }).end();
          });
      });
    }
    else {
      const survey = new Surveys.Surveys({
        locale: req.body.surveydata.locale,
        json: req.body.surveydata.surveyJson,
        category_id: req.body.surveydata.category_id,
        status: req.body.surveydata.status
      });

      // Save Survey in the database
      survey.save()
        .then(data => {

          res.status(200).json({ responseCode: 0, isError: false, message: "common.form.add.success" });
          responseLog({ responseCode: 0, isError: false, message: "common.form.add.success" }, "AddSurvey");

        }).catch(err => {

          errorLog(err, "AddSurvey");

          return res.status(500).json({
            responseCode: 1,
            isError: true,
            message: '',
            errors: err.message || "common.api.adderror"
          }).end();
        });
    }

  } catch (err) {

    errorLog(err, "AddSurvey");
    return res.status(400).json({
      responseCode: 9,
      isError: true,
      message: '',
      errors: err.message || "common.api.internalerror"
    }).end();
  }
});

// @route   POST api/private/v1/surveys/getSurveyById/:surveyId
// @desc    Retrieve a single survey with surveyId 
// @access  Public
router.get('/getSurveyById/:surveyId', function (req, res) {

  var q = urlPath.parse(req.url, true).query;
  var APIRequest = {};
  APIRequest.params = req.params;
  APIRequest.referer = req.headers['referer'];
  APIRequest.query = q;
  APIRequest.body = req.body;
  requestLog(APIRequest, "GetSurveyById");

  try {

    const { errors, isValid } = validateSurveys.validateGetSurveyByIdInput(req.params);

    // Check Validation
    if (!isValid) {
      return res.status(400).json({
        responseCode: 1,
        isError: true,
        message: '', errors: errors
      }).end();
    }

    Surveys.Surveys.findOne({ _id: req.params.surveyId })
      .then(surveydata => {

        if (!surveydata) {
          return res.status(400).json({
            responseCode: 1,
            isError: true,
            message: '',
            errors: "common.api.datanotfound " + req.params.surveyId
          }).end();
        }

        res.status(200).json({ responseCode: 0, isError: false, message: '', data: surveydata });
        responseLog({ responseCode: 0, isError: false, message: '', data: surveydata }, "GetSurveyById");

      }).catch(err => {

        errorLog(err, "GetSurveyById");
        return res.status(500).json({
          responseCode: 1,
          isError: true,
          message: '',
          errors: err.message || "common.api.fetcherror"
        }).end();
      });

  } catch (err) {
    errorLog(err, "GetSurveyById");
    return res.status(400).json({
      responseCode: 9,
      isError: true,
      message: '', errors: err.message || "common.api.internalerror"
    }).end();
  }
});


// @route   POST api/private/v1/surveys/getSurveyResultsById/:surveyId
// @desc    Retrieve a Survey Results with surveyId 
// @access  Public
router.get('/getSurveyResultsById/:surveyId', function (req, res) {

  var q = urlPath.parse(req.url, true).query;
  var APIRequest = {};
  APIRequest.params = req.params;
  APIRequest.referer = req.headers['referer'];
  APIRequest.query = q;
  APIRequest.body = req.body;
  requestLog(APIRequest, "GetSurveyResultsById");

  try {

    const { errors, isValid } = validateSurveys.validateGetSurveyByIdInput(req.params);

    // Check Validation
    if (!isValid) {
      return res.status(400).json({
        responseCode: 1,
        isError: true,
        message: '', errors: errors
      }).end();
    }

    Surveys.SurveysResults.find({ surveyId: req.params.surveyId })
      .then(surveydata => {

        if (!surveydata) {
          return res.status(400).json({
            responseCode: 1,
            isError: true,
            message: '',
            errors: "common.api.datanotfound " + req.params.surveyId
          }).end();
        }

        res.status(200).json({ responseCode: 0, isError: false, message: '', data: surveydata });
        responseLog({ responseCode: 0, isError: false, message: '', data: surveydata }, "GetSurveyResultsById");

      }).catch(err => {

        errorLog(err, "GetSurveyResultsById");
        return res.status(500).json({
          responseCode: 1,
          isError: true,
          message: '',
          errors: err.message || "common.api.fetcherror"
        }).end();
      });

  } catch (err) {
    errorLog(err, "GetSurveyResultsById");
    return res.status(400).json({
      responseCode: 9,
      isError: true,
      message: '', errors: err.message || "common.api.internalerror"
    }).end();
  }
});


// @route   POST api/private/v1/surveys/getSurveyResultsBySurveyId/:surveyId
// @desc    Retrieve a Survey Results for client with surveyId 
// @access  Public
router.post('/getSurveyResultsBySurveyId', function (req, res) {

  var q = urlPath.parse(req.url, true).query;
  var APIRequest = {};
  APIRequest.params = req.params;
  APIRequest.referer = req.headers['referer'];
  APIRequest.query = q;
  APIRequest.body = req.body;
  requestLog(APIRequest, "GetSurveyResultsBySurveyId");

  try {

    const { errors, isValid } = validateSurveys.validateGetSurveyResultsBySurveyIdInput(req.body.surveydata);

    // Check Validation
    if (!isValid) {
      return res.status(400).json({
        responseCode: 1,
        isError: true,
        message: '', errors: errors
      }).end();
    }

    Surveys.SurveysResults.find({ surveyId: req.body.surveydata.surveyId })
      .then(surveydata => {

        if (!surveydata) {
          return res.status(400).json({
            responseCode: 1,
            isError: true,
            message: '',
            errors: "common.api.datanotfound " + req.body.surveydata.surveyId
          }).end();
        }

        let allanswered = [];

        surveydata.forEach(surveydataa => {
          Object.keys(surveydataa.json).forEach(function (key) {
            allanswered.push((surveydataa.json[key]));
          });
        });

        var removeduplicate = [];
        var copy = allanswered.slice(0);

        for (var i = 0; i < allanswered.length; i++) {
          var myCount = 0;
          for (var w = 0; w < copy.length; w++) {
            if (allanswered[i] == copy[w]) {
              myCount++;
              delete copy[w];
            }
          }

          if (myCount > 0) {
            var a = new Object();
            a.answer = allanswered[i];
            a.count = myCount;
            removeduplicate.push(a);
          }
        }

        let isExist = 0;

        Surveys.SurveysResults.find({ surveyId: req.body.surveydata.surveyId, userId: req.body.surveydata.userId })
          .then(surveydata2 => {

            if (!surveydata2) {
              return res.status(400).json({
                responseCode: 1,
                isError: true,
                message: '',
                errors: "common.api.datanotfound " + req.body.surveydata2.surveyId
              }).end();
            }

            if (surveydata2.length > 0)
              isExist = 1;

            res.status(200).json({ responseCode: 0, isError: false, message: '', data: { results: removeduplicate, isExist: isExist } });
            responseLog({ responseCode: 0, isError: false, message: '', data: removeduplicate }, "GetSurveyResultsBySurveyId");

          });

      }).catch(err => {

        errorLog(err, "GetSurveyResultsBySurveyId");
        return res.status(500).json({
          responseCode: 1,
          isError: true,
          message: '',
          errors: err.message || "common.api.fetcherror"
        }).end();
      });

  } catch (err) {
    errorLog(err, "GetSurveyResultsBySurveyId");
    return res.status(400).json({
      responseCode: 9,
      isError: true,
      message: '', errors: err.message || "common.api.internalerror"
    }).end();
  }
});

// @route   PUT api/private/v1/surveys/updateSurvey/:surveyId
// @desc    Update a survey with surveyId 
// @body    { "surveyName" : "",  "json" : "", "surveyId" : "" }
// @access  Public
router.put('/updateSurvey', function (req, res) {

  var q = urlPath.parse(req.url, true).query;
  var APIRequest = {};
  APIRequest.params = req.params;
  APIRequest.referer = req.headers['referer'];
  APIRequest.query = q;
  APIRequest.body = req.body;
  requestLog(APIRequest, "UpdateSurvey");

  try {
    const { errors, isValid } = validateSurveys.validateUpdateSurveyInput(req.body.surveydata);

    // Check Validation
    if (!isValid) {
      return res.status(400).json({
        responseCode: 1,
        isError: true,
        message: '', errors: errors
      }).end();
    }

    if (req.body.surveydata.status == 1) {
      Surveys.Surveys.update({ category_id: req.body.surveydata.category_id }, { status: 0 }, { multi: true }, function (err) {
        if (err) {
          return res.status(400).json({
            responseCode: 1,
            isError: true,
            message: '',
            errors: "common.api.datanotfound" + req.body.surveyupdatedata.category_id
          }).end();
        }
        // Find survey and update it with the requested surveyId
        Surveys.Surveys.findOneAndUpdate({ _id: req.body.surveydata.surveyId }, {
          locale: req.body.surveydata.locale,
          json: req.body.surveydata.surveyJson,
          category_id: req.body.surveydata.category_id,
          status: req.body.surveydata.status
        }, { new: true })
          .then(surveydata => {
            if (!surveydata) {
              return res.status(400).json({
                responseCode: 1,
                isError: true,
                message: '',
                errors: "common.api.datanotfound" + req.body.surveydata.surveyId
              }).end();
            }

            res.status(200).json({ responseCode: 0, isError: false, message: 'common.form.edit.success' });
            responseLog({ responseCode: 0, isError: false, message: 'common.form.edit.success' }, "UpdateSurvey");

          }).catch(err => {

            errorLog(err, "UpdateSurvey");
            return res.status(500).json({
              responseCode: 1,
              isError: true,
              message: '',
              errors: err.message || "common.api.editerror"
            }).end();
          });
      });
    }
    else {
      // Find survey and update it with the requested surveyId
      Surveys.Surveys.findOneAndUpdate({ _id: req.body.surveydata.surveyId }, {
        locale: req.body.surveydata.locale,
        json: req.body.surveydata.surveyJson,
        category_id: req.body.surveydata.category_id,
        status: req.body.surveydata.status
      }, { new: true })
        .then(surveydata => {
          if (!surveydata) {
            return res.status(400).json({
              responseCode: 1,
              isError: true,
              message: '',
              errors: "common.api.datanotfound" + req.body.surveydata.surveyId
            }).end();
          }

          res.status(200).json({ responseCode: 0, isError: false, message: 'common.form.edit.success' });
          responseLog({ responseCode: 0, isError: false, message: 'common.form.edit.success' }, "UpdateSurvey");

        }).catch(err => {

          errorLog(err, "UpdateSurvey");
          return res.status(500).json({
            responseCode: 1,
            isError: true,
            message: '',
            errors: err.message || "common.api.editerror"
          }).end();
        });
    }

  } catch (err) {

    errorLog(err, "UpdateSurvey");
    return res.status(400).json({
      responseCode: 9,
      isError: true,
      message: '', errors: err.message || "common.api.internalerror"
    }).end();
  }
});


// @route   PUT api/private/v1/surveys/deleteSurvey/:surveyId
// @desc    Delete a survey with surveyId 
// @body    { "surveyId" : "" }
// @access  Public
router.put('/deleteSurvey', function (req, res) {

  var q = urlPath.parse(req.url, true).query;
  var APIRequest = {};
  APIRequest.params = req.params;
  APIRequest.referer = req.headers['referer'];
  APIRequest.query = q;
  APIRequest.body = req.body;
  requestLog(APIRequest, "DeleteSurvey");

  try {
    const { errors, isValid } = validateSurveys.validateGetSurveyByIdInput(req.params);

    // Check Validation
    if (!isValid) {
      return res.status(400).json({
        responseCode: 1,
        isError: true,
        message: '', errors: errors
      }).end();
    }

    // Find survey and delete it with the requested surveyId
    Surveys.Surveys.findOneAndDelete({ _id: req.params.surveyId })
      .then(surveydata => {

        if (!surveydata) {
          return res.status(400).json({
            responseCode: 1,
            isError: true,
            message: '',
            errors: "common.api.datanotfound" + req.params.surveyId
          }).end();
        }

        res.status(200).json({ responseCode: 0, isError: false, message: 'common.form.edit.success' });
        responseLog({ responseCode: 0, isError: false, message: 'common.form.edit.success', data: surveydata }, "DeleteSurvey");

      }).catch(err => {

        errorLog(err, "DeleteSurvey");
        return res.status(500).json({
          responseCode: 1,
          isError: true,
          message: '',
          errors: err.message || "common.api.editerror"
        }).end();
      });

  } catch (err) {

    errorLog(err, "DeleteSurvey");
    return res.status(400).json({
      responseCode: 9,
      isError: true,
      message: '', errors: err.message || "common.api.internalerror"
    }).end();
  }
});

// @route   GET api/private/v1/surveys/getSurvey/:id
// @desc    Retrieve Survey Form JSON Data
// @access  Public
router.get('/getSurvey/:id', function (req, res) {
  var q = urlPath.parse(req.url, true).query;
  var APIRequest = {};
  APIRequest.params = req.params;
  APIRequest.referer = req.headers['referer'];
  APIRequest.query = q;
  APIRequest.body = req.body;
  requestLog(APIRequest, "getSurvey");

  try {
    Surveys.Surveys.findOne({ category_id: req.params.id, status: 1 })
      .then(surveys => {
        res.status(200);
        res.json({
          responseCode: 0,
          isError: false,
          message: "Request Success",
          data: surveys
        });
        res.end();
        responseLog({ responseCode: 0, isError: false, message: '', data: surveys }, "getSurvey");
      })
      .catch(err => {
        res.status(500);
        res.json({
          responseCode: 9,
          isError: true,
          errors: { "message": "common.api.internalerror" },
          message: err.message || "Some error occurred while retrieving getSurvey."
        });
        res.end();
        errorLog(err, "getSurvey");
      });
  } catch (err) {
    errorLog(err, "getSurvey");
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

// @route   POST api/private/v1/surveys/addSurveyResult
// @desc    Add Survey Result
// @body    { "surveyId" : "","userId":"","json":""}
// @access  Public
router.post('/addSurveyResult', function (req, res) {
  var q = urlPath.parse(req.url, true).query;
  var APIRequest = {};
  APIRequest.params = req.params;
  APIRequest.referer = req.headers['referer'];
  APIRequest.query = q;
  APIRequest.body = req.body;
  requestLog(APIRequest, "addSurveyResult");

  try {

    const { errors, isValid } = validateSurveys.validateAddSurveyResultInput(req.body.surveyansdata);

    // Check Validation
    if (!isValid) {
      return res.status(400).json({
        responseCode: 1,
        isError: true,
        message: '', errors: errors
      }).end();
    }
    const surveyresult = new Surveys.SurveysResults({
      surveyId: req.body.surveyansdata.surveyId,
      userId: req.body.surveyansdata.userId,
      json: req.body.surveyansdata.answerjson,
      date_created: new Date(),
      date_modified: new Date(),
      created_by: '',
      modified_by: ''
    });

    // Save Faq Category in the database
    surveyresult.save()
      .then(data => {
        res.status(200).send({ responseCode: 0, isError: false, message: 'addSurveyResult added successfullly.' });
        responseLog({ responseCode: 0, isError: false, message: 'addSurveyResult added successfullly.', data: surveyresult }, "addSurveyResult");
      }).catch(err => {
        res.status(500).send({
          responseCode: 9,
          errors: { "message": "common.api.internalerror" },
          isError: true,
          message: err.message || "Some error occurred while creating the addSurveyResult."
        });
        errorLog(err, "addSurveyResult");
      });
  } catch (err) {
    errorLog(err, "addSurveyResult");
    res.status(400).send({ responseCode: 1, errors: {}, isError: true, message: err });
  }
});

//Added by Dhara gajera 17/1/2019
// @route   GET api/private/v1/surveys/surveysCount
// @desc    Retrieve all count for surveys
// @access  Public
router.get('/surveysCount', function (req, res) {
  var q = urlPath.parse(req.url, true).query;
  var APIRequest = {};
  APIRequest.params = req.params;
  APIRequest.referer = req.headers['referer'];
  APIRequest.query = q;
  APIRequest.body = req.body;
  requestLog(APIRequest, "surveysCount");
  var count = {}
  try {
    //Added by Jayesh 29-12-2018
    Surveys.Surveys.count({})
      .then(surveycount => {
        count.surveysCount = surveycount;

        res.status(200);
        res.json({
          responseCode: 0,
          isError: false,
          message: "Request Success",
          data: count
        });
        res.end();
        responseLog({ responseCode: 0, isError: false, message: '', data: count }, "surveysCount");
      });
  } catch (err) {
    errorLog(err, "surveysCount");
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
// Added by Jayesh Pathak 17-12-2018 for adding servey module - end