/* 
  Createdby : Kushal parekh
  Updateby : Kushal parekh
  CreatedDate : 15-10-2018
  UpdatedDate : 15-10-2018
  Description :Language Master API
Updated by Jayesh Pathak 26-10-2018 for adding language module listing/add/edit/getbyid
*/

const express = require('express');
const router = express.Router();
const urlPath = require('url');
var logHelper = require('../../../../../helper/logHelper');
var errorLog = logHelper.errorLog;
var responseLog = logHelper.responseLog;
var requestLog = logHelper.requestLog;

// Load Language model
const Language = require('../../../../../models/Language/index');

// Load Language Configuration model
const LanguageConfig = require('../../../../../models/LanguageConfigurations/index');

const validateLanguage = require('../../../../../validation/language');

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

// @route   GET api/private/v1/languages
// @desc    Retrieve all language
// @access  Public
router.get('/', function (req, res) {

  var q = urlPath.parse(req.url, true).query;
  var APIRequest = {};
  APIRequest.params = req.params;
  APIRequest.referer = req.headers['referer'];
  APIRequest.query = q;
  APIRequest.body = req.body;
  requestLog(APIRequest, "ListLanguage");

  try {
    Language.find()
      .then(languages => {

        res.status(200).json({
          responseCode: 0,
          isError: false,
          message: "",
          data: languages
        })
        responseLog({ responseCode: 0, isError: false, message: '', data: languages }, "ListLanguage");

      })

      .catch(err => {
        errorLog(err, "ListLanguage");
        return res.status(500).send({
          responseCode: 1,
          isError: false,
          message: err.message || "common.api.fetcherror"
        }).end();

      });
  } catch (err) {
    errorLog(err, "ListLanguage");
    return res.status(400).json({ responseCode: 9, isError: false, message: err.message || "common.api.internalerror", data: '' }).end();
  }
});

// @route   POST api/private/v1/languages/addLanguage
// @desc    Create a new Language  
// @body    { "language_name" : "",  "code" : "", "locale" : "", "sort_order" : "", status : 1 }
// @access  Public
router.post('/addLanguage', function (req, res) {

  var q = urlPath.parse(req.url, true).query;
  var APIRequest = {};
  APIRequest.params = req.params;
  APIRequest.referer = req.headers['referer'];
  APIRequest.query = q;
  APIRequest.body = req.body;
  requestLog(APIRequest, "AddLanguage");

  try {
    const { errors, isValid } = validateLanguage.validateAddLanguageInput(req.body.languagedata);

    // Check Validation
    if (!isValid) {
      return res.status(400).json({
        responseCode: 1,
        isError: true,
        message: '', errors: errors
      }).end();
    }

    Language.findOne({}, {}, { sort: { 'id': -1 } }).then(languageid => {

      const language = new Language({
        id: (parseInt(languageid.id) + 1),
        language_name: req.body.languagedata.language_name,
        code: req.body.languagedata.code,
        rtlLayout: req.body.languagedata.rtlLayout,
        locale: req.body.languagedata.locale,
        sort_order: req.body.languagedata.sort_order,
        status: req.body.languagedata.status
      });

      // Save Language in the database
      language.save()
        .then(data => {

          res.status(200).json({ responseCode: 0, isError: false, message: "common.form.add.success" });
          responseLog({ responseCode: 0, isError: false, message: "common.form.add.success" }, "AddLanguage");

        }).catch(err => {

          errorLog(err, "AddLanguage");

          return res.status(500).json({
            responseCode: 1,
            isError: true,
            message: '',
            errors: err.message || "common.api.adderror"
          }).end();

        });

    }).catch(err => {

      errorLog(err, "AddLanguage");
      return res.status(500).json({
        responseCode: 1,
        isError: true,
        message: '',
        errors: err.message || "common.api.fetcherror"
      }).end();

    });

  } catch (err) {

    errorLog(err, "AddLanguage");
    return res.status(400).json({
      responseCode: 9,
      isError: true,
      message: '',
      errors: err.message || "common.api.internalerror"
    }).end();
  }
});

// @route   PUT api/private/v1/languages/updateLanguage
// @desc    Update a language with id 
// @body    { "language_name" : "",  "code" : "", "locale" : "", "sort_order" : "", status : 1 }
// @access  Public
router.put('/updateLanguage', function (req, res) {

  var q = urlPath.parse(req.url, true).query;
  var APIRequest = {};
  APIRequest.params = req.params;
  APIRequest.referer = req.headers['referer'];
  APIRequest.query = q;
  APIRequest.body = req.body;
  requestLog(APIRequest, "UpdateLanguage");

  try {

    const { errors, isValid } = validateLanguage.validateUpdateLanguageInput(req.body.languagedata);

    // Check Validation
    if (!isValid) {
      return res.status(400).json({
        responseCode: 1,
        isError: true,
        message: '', errors: errors
      }).end();
    }

    // Find language and update it with the requested id
    Language.findOneAndUpdate({ id: req.body.languagedata.id }, {
      language_name: req.body.languagedata.language_name,
      code: req.body.languagedata.code,
      rtlLayout: req.body.languagedata.rtlLayout,
      locale: req.body.languagedata.locale,
      sort_order: req.body.languagedata.sort_order,
      status: req.body.languagedata.status
    }, { new: true })
      .then(language => {

        if (!language) {
          return res.status(400).json({
            responseCode: 1,
            isError: true,
            message: '',
            errors: "common.api.datanotfound" + req.body.languagedata.id
          }).end();
        }

        res.status(200).json({ responseCode: 0, isError: false, message: "common.form.edit.success" });
        responseLog({ responseCode: 0, isError: false, message: "common.form.edit.success" }, "UpdateLanguage");

      }).catch(err => {

        errorLog(err, "UpdateLanguage");
        return res.status(500).json({
          responseCode: 1,
          isError: true,
          message: '',
          errors: err.message || "common.api.editerror"
        }).end();
      });

  } catch (err) {

    errorLog(err, "UpdateLanguage");
    return res.status(400).json({
      responseCode: 9,
      isError: true,
      message: '', errors: err.message || "common.api.internalerror"
    }).end();
  }
});


// @route   POST api/private/v1/languages/getLanguageById/:id
// @desc    Retrieve a single language with id 
// @access  Public
router.get('/getLanguageById/:id', function (req, res) {

  var q = urlPath.parse(req.url, true).query;
  var APIRequest = {};
  APIRequest.params = req.params;
  APIRequest.referer = req.headers['referer'];
  APIRequest.query = q;
  APIRequest.body = req.body;
  requestLog(APIRequest, "GetLanguageById");

  try {

    const { errors, isValid } = validateLanguage.validateGetLanguageByIdInput(req.params);

    // Check Validation
    if (!isValid) {
      return res.status(400).json({
        responseCode: 1,
        isError: true,
        message: '', errors: errors
      }).end();
    }

    Language.findOne({ id: req.params.id }, { _id: false })
      .then(language => {

        if (!language) {
          return res.status(400).json({
            responseCode: 1,
            isError: true,
            message: '',
            errors: "common.api.datanotfound" + req.params.id
          }).end();
        }

        res.status(200).json({ responseCode: 0, isError: false, message: '', data: language });
        responseLog({ responseCode: 0, isError: false, message: '', data: language }, "GetLanguageById");

      }).catch(err => {

        errorLog(err, "GetLanguageById");
        return res.status(500).json({
          responseCode: 1,
          isError: true,
          message: '',
          errors: err.message || "common.api.fetcherror"
        }).end();
      });

  } catch (err) {
    errorLog(err, "GetLanguageById");
    return res.status(400).json({
      responseCode: 9,
      isError: true,
      message: '', errors: err.message || "common.api.internalerror"
    }).end();
  }
});

// Added by Jayesh on 11-12-2018
// @route   POST api/private/v1/languages/getLanguageInfo/
// @desc    Retrieve a language information
// @access  Public
router.get('/getLanguageInfo', function (req, res) {

  var q = urlPath.parse(req.url, true).query;
  var APIRequest = {};
  APIRequest.params = req.params;
  APIRequest.referer = req.headers['referer'];
  APIRequest.query = q;
  APIRequest.body = req.body;
  requestLog(APIRequest, "getLanguageInfo");

  try {

    LanguageConfig.findOne()
      .then(languageconfiguration => {

        if (!languageconfiguration) {
          return res.status(400).json({
            responseCode: 1,
            isError: true,
            message: '',
            errors: "common.api.datanotfound"
          }).end();
        }

        res.status(200).json({ responseCode: 0, isError: false, message: '', data: languageconfiguration });
        responseLog({ responseCode: 0, isError: false, message: '', data: languageconfiguration }, "getLanguageInfo");

      }).catch(err => {

        errorLog(err, "getLanguageInfo");
        return res.status(500).json({
          responseCode: 1,
          isError: true,
          message: '',
          errors: err.message || "common.api.fetcherror"
        }).end();
      });

  } catch (err) {
    errorLog(err, "getLanguageInfo");
    return res.status(400).json({
      responseCode: 9,
      isError: true,
      message: '', errors: err.message || "common.api.internalerror"
    }).end();
  }
});

// Added by Jayesh on 11-12-2018
router.get('/getActiveDefaultLanguages', function (req, res) {

  var q = urlPath.parse(req.url, true).query;
  var APIRequest = {};
  APIRequest.params = req.params;
  APIRequest.referer = req.headers['referer'];
  APIRequest.query = q;
  APIRequest.body = req.body;
  requestLog(APIRequest, "GetActiveDefaultLanguages");
  let dataCounter = 0;
  let wholeNewResponse = { language: [], defaultlanguage: {} };
  try {

    LanguageConfig.findOne().then(languageconfiguration => {

      if (!languageconfiguration) {
        return res.status(400).json({
          responseCode: 1,
          isError: true,
          message: '',
          errors: "common.api.datanotfound"
        }).end();
      }

      languageconfiguration.languages.forEach(element => {

        Language.findOne({ _id: element.languageId }, { _id: false })
          .then(language => {

            if (!language) {
              return res.status(400).json({
                responseCode: 1,
                isError: true,
                message: '',
                errors: "common.api.datanotfound" + element.languageId
              }).end();
            }

            dataCounter++;

            let properObj = {};
            let defaultObj = {};

            properObj.languageId = language.language_name.toLowerCase();
            properObj.locale = language.code;
            properObj.name = language.language_name;
            properObj.icon = language.code;
            properObj.rtlLayout = language.rtlLayout;
            properObj.sort_order = language.sort_order;
            wholeNewResponse.language.push(properObj);

            if (element.isDefault == 1) {
              defaultObj.languageId = language.language_name.toLowerCase();
              defaultObj.locale = language.code;
              defaultObj.name = language.language_name;
              defaultObj.icon = language.code;
              defaultObj.rtlLayout = language.rtlLayout;
              wholeNewResponse.defaultlanguage = defaultObj;
            }

            if (languageconfiguration.languages.length == dataCounter) {
              wholeNewResponse.language.sort(function (a, b) {
                return a.sort_order - b.sort_order
              });

              res.status(200).json({ responseCode: 0, isError: false, message: '', data: wholeNewResponse });
              responseLog({ responseCode: 0, isError: false, message: '', data: language }, "GetActiveDefaultLanguages");
            }

          }).catch(err => {

            errorLog(err, "GetActiveDefaultLanguages");
            return res.status(500).json({
              responseCode: 1,
              isError: true,
              message: '',
              errors: err.message || "common.api.fetcherror"
            }).end();
          });

      });

    }).catch(err => {

      errorLog(err, "GetActiveDefaultLanguages");
      return res.status(500).json({
        responseCode: 1,
        isError: true,
        message: '',
        errors: err.message || "common.api.fetcherror"
      }).end();
    });

  } catch (err) {
    errorLog(err, "GetActiveDefaultLanguages");
    return res.status(400).json({
      responseCode: 9,
      isError: true,
      message: '', errors: err.message || "common.api.internalerror"
    }).end();
  }

});

// @route   PUT api/private/v1/languages/updateLanguageConfiguration
// @desc    Update a updateLanguageConfiguration with id 
// @body 
// @access  Public
router.put('/updateLanguageConfiguration', function (req, res) {

  var q = urlPath.parse(req.url, true).query;
  var APIRequest = {};
  APIRequest.params = req.params;
  APIRequest.referer = req.headers['referer'];
  APIRequest.query = q;
  APIRequest.body = req.body;
  requestLog(APIRequest, "UpdateLanguageConfiguration");

  try {

    const { errors, isValid } = validateLanguage.validateUpdateLanguageConfigInput(req.body.languagedata);

    // Check Validation
    if (!isValid) {
      return res.status(400).json({
        responseCode: 1,
        isError: true,
        message: '', errors: errors
      }).end();
    }

    // Find language and update it with the requested id
    LanguageConfig.findOneAndUpdate({ _id: req.body.languagedata.id }, {
      languages: req.body.languagedata.languagedata,
    }, { new: true })
      .then(language => {

        if (!language) {
          return res.status(400).json({
            responseCode: 1,
            isError: true,
            message: '',
            errors: "common.api.datanotfound" + req.body.languagedata.id
          }).end();
        }

        res.status(200).json({ responseCode: 0, isError: false, message: "common.form.edit.success" });
        responseLog({ responseCode: 0, isError: false, message: "common.form.edit.success" }, "UpdateLanguageConfiguration");

      }).catch(err => {

        errorLog(err, "UpdateLanguageConfiguration");
        return res.status(500).json({
          responseCode: 1,
          isError: true,
          message: '',
          errors: err.message || "common.api.editerror"
        }).end();
      });

  } catch (err) {

    errorLog(err, "UpdateLanguageConfiguration");
    return res.status(400).json({
      responseCode: 9,
      isError: true,
      message: '', errors: err.message || "common.api.internalerror"
    }).end();
  }
});

router.get('/getActiveLanguagesConfig', function (req, res) {

  var q = urlPath.parse(req.url, true).query;
  var APIRequest = {};
  APIRequest.params = req.params;
  APIRequest.referer = req.headers['referer'];
  APIRequest.query = q;
  APIRequest.body = req.body;
  requestLog(APIRequest, "GetActiveLanguagesConfig");
  let dataCounter = 0;
  let wholeNewResponse = { language: [], defaultlanguage: {} };
  try {

    LanguageConfig.findOne().then(languageconfiguration => {

      if (!languageconfiguration) {
        return res.status(400).json({
          responseCode: 1,
          isError: true,
          message: '',
          errors: "common.api.datanotfound"
        }).end();
      }

      languageconfiguration.languages.forEach(element => {

        Language.findOne({ _id: element.languageId })
          .then(language => {

            if (!language) {
              return res.status(400).json({
                responseCode: 1,
                isError: true,
                message: '',
                errors: "common.api.datanotfound" + element.languageId
              }).end();
            }

            dataCounter++;

            let properObj = {};

            properObj.languageId = language._id;
            properObj.id = language.id;
            properObj.locale = language.locale;
            properObj.language_name = language.language_name;
            properObj.code = language.code;
            wholeNewResponse.language.push(properObj);

            if (languageconfiguration.languages.length == dataCounter) {
              res.status(200).json({ responseCode: 0, isError: false, message: '', data: wholeNewResponse.language });
              responseLog({ responseCode: 0, isError: false, message: '', data: language }, "GetActiveLanguagesConfig");
            }

          }).catch(err => {

            errorLog(err, "GetActiveLanguagesConfig");
            return res.status(500).json({
              responseCode: 1,
              isError: true,
              message: '',
              errors: err.message || "common.api.fetcherror"
            }).end();
          });

      });

    }).catch(err => {

      errorLog(err, "GetActiveLanguagesConfig");
      return res.status(500).json({
        responseCode: 1,
        isError: true,
        message: '',
        errors: err.message || "common.api.fetcherror"
      }).end();
    });

  } catch (err) {
    errorLog(err, "GetActiveLanguagesConfig");
    return res.status(400).json({
      responseCode: 9,
      isError: true,
      message: '', errors: err.message || "common.api.internalerror"
    }).end();
  }
});

module.exports = router;
// Added by Kushal Parekh 15-10-2018 for Language module - start