const express = require('express');
const urlPath = require('url');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const filepath = (__dirname.substring(0, __dirname.indexOf("\\controller")) + '\\data\\');
var logHelper = require('../../../../../helper/logHelper');
var errorLog = logHelper.errorLog;
var responseLog = logHelper.responseLog;
var requestLog = logHelper.requestLog;

// Load Setting model
const Setting = require('../../../../../models/Setting/index');

// SiteSetting Validation
const validateSiteSetting = require('../../../../../validation/sitesetting');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(fileUpload());
app.use('/public', express.static(__dirname + '/public'));

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


// @route   GET api/private/v1/sitesetting/getSiteSettingById/:siteid
// @desc    Retrieve a single sitesetting with siteid 
// @access  Public
app.get('/getSiteSettingById/:siteid', function (req, res) {

  var q = urlPath.parse(req.url, true).query;
  var APIRequest = {};
  APIRequest.params = req.params;
  APIRequest.referer = req.headers['referer'];
  APIRequest.query = q;
  APIRequest.body = req.body;
  requestLog(APIRequest, "getSiteSettingById");
  var ip;
  if (req.headers['x-forwarded-for']) {
    ip = req.headers['x-forwarded-for'].split(",")[0].split(":")[0];
  } else if (req.connection && req.connection.remoteAddress) {
    ip = req.connection.remoteAddress.split(":")[3].split(":")[0];
  } else {
    ip = req.ip.split(":")[0];
  }
  try {

    const { errors, isValid } = validateSiteSetting.validategetSiteSettingByIdInput(req.params);

    // Check Validation
    if (isValid) {
      return res.status(400).send(JSON.parse(JSON.stringify({ status: 1, message: `Validation Failed`, errors: errors })));
    }

    Setting.findOne({ siteid: req.params.siteid }, { _id: false })
      .then(sitesetting => {

        if (!sitesetting) {
          return res.status(404).send({
            responseCode: 1,
            isError: true,
            errors: {},
            message: "SiteSetting not found with id " + req.params.siteid
          });
        }

        if (ip == '45.116.123.43') {
          sitesetting.server.maintenance_mode = 0;
        }

        res.status(200).send({ responseCode: 0, isError: false, ipaddress: ip, message: "Request Success", data: sitesetting });
        responseLog({ responseCode: 0, isError: false, message: "Request Success", data: sitesetting }, "getSiteSettingById");
      }).catch(err => {
        if (err.kind === 'ObjectId') {
          return res.status(404).send({
            responseCode: 1,
            isError: true,
            errors: {},
            message: "SiteSetting not found with id " + req.params.siteid
          });
        }
        errorLog(err, "getSiteSettingById");
        return res.status(500).send({
          responseCode: 1,
          isError: true,
          errors: {},
          message: "Error retrieving SiteSetting with id " + req.params.siteid
        });
      });

  } catch (err) {
    errorLog(err, "getSiteSettingById");
    res.status(400).send({ status: 1, message: err, errors: { message: 'Invalid Request' } });
  }
});


// @route   POST api/private/v1/sitesetting/getSiteSettingById/:siteid
// @desc    Retrieve a single sitesetting with siteid 
// @access  Public
app.get('/getSiteSetting/:siteid', function (req, res) {

  var q = urlPath.parse(req.url, true).query;
  var APIRequest = {};
  APIRequest.params = req.params;
  APIRequest.referer = req.headers['referer'];
  APIRequest.query = q;
  APIRequest.body = req.body;
  requestLog(APIRequest, "getSiteSettingById");

  try {

    const { errors, isValid } = validateSiteSetting.validategetSiteSettingByIdInput(req.params);

    // Check Validation
    if (isValid) {
      return res.status(400).send(JSON.parse(JSON.stringify({ status: 1, message: `Validation Failed`, errors: errors })));
    }

    fs.exists(filepath + req.params.siteid + '.json', function (exists) {
      if (exists) {
        fs.readFile(filepath + req.params.siteid + '.json', function readFileCallback(err, data) {
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

        Setting.findOne({ siteid: req.params.siteid }, { _id: false })
          .then(sitesetting => {

            if (!sitesetting) {
              return res.status(404).send({
                responseCode: 1,
                isError: true,
                errors: {},
                message: "SiteSetting not found with id " + req.params.siteid
              });
            }
            res.status(200).send({ responseCode: 0, isError: false, message: "Request Success", data: sitesetting });
            responseLog({ responseCode: 0, isError: false, message: "Request Success", data: sitesetting }, "getSiteSettingById");
          }).catch(err => {
            if (err.kind === 'ObjectId') {
              return res.status(404).send({
                responseCode: 1,
                isError: true,
                errors: {},
                message: "SiteSetting not found with id " + req.params.siteid
              });
            }
            errorLog(err, "getSiteSettingById");
            return res.status(500).send({
              responseCode: 1,
              isError: true,
              errors: {},
              message: "Error retrieving SiteSetting with id " + req.params.siteid
            });
          });
      }
    });
  }
  catch (err) {
    errorLog(err, "getSiteSettingById");
    res.status(400).send({ status: 1, message: err, errors: { message: 'Invalid Request' } });
  }
});


// @route   PUT api/private/v1/sitesetting/updateSiteSetting/:siteid
// @desc    Update a sitesetting with siteid 
// @body    { "countryname" : "",  "countrycode" : "", "status" : "" }
// @access  Public
app.post('/updateSiteSetting', function (req, res) {

  var q = urlPath.parse(req.url, true).query;
  var APIRequest = {};
  APIRequest.params = req.params;
  APIRequest.referer = req.headers['referer'];
  APIRequest.query = q;
  APIRequest.body = req.body;
  var logo_name = '';
  var fevicon_name = '';
  requestLog(APIRequest, "updateSiteSetting");

  const { errors, isValid } = validateSiteSetting.validateSiteSettingPageInput(JSON.parse(req.body.data), req.files);

  if (isValid) {
    res.status(400).json({ responseCode: 1, isError: true, message: "Validation Failed", errors: errors }).end();
  }

  let setting = JSON.parse(req.body.data);
  try {
    if (typeof req.files != undefined && req.files != null) {
      if (typeof req.files.logo != 'undefined' && req.files.logo != '') {
        let logo = req.files.logo;
        var logooriginalname = logo.name;
        var logoextension = logooriginalname.split(".");
        var logofilename = logooriginalname.substr(0, logooriginalname.lastIndexOf('.'));
        var logo_name = logofilename + Date.now() + '.' + logoextension[logoextension.length - 1];

        logo.mv(`${__dirname}/public/${logo_name}`, function (err) {
          if (err) {
            logoerror = true;
          }
        });
      }

      if (typeof req.files.fevicon != 'undefined' && req.files.fevicon != '') {
        let fevicon = req.files.fevicon;
        var feviconoriginalname = fevicon.name;
        var feviconextension = feviconoriginalname.split(".");
        var logofilename = feviconoriginalname.substr(0, feviconoriginalname.lastIndexOf('.'));
        var fevicon_name = logofilename + Date.now() + '.' + feviconextension[feviconextension.length - 1];

        fevicon.mv(`${__dirname}/public/${fevicon_name}`, function (err) {
          if (err) {
            feviconerror = true;
          }
        });
      }
    }

    var output = {
      siteid: setting.siteid,
      general: {
        locale: setting.general.locale
      },
      image: {
        logo: logo_name ? logo_name : setting.image.logo,
        logoPreviewUrl: setting.image.logoPreviewUrl,
        fevicon: fevicon_name ? fevicon_name : setting.image.fevicon,
        feviconPreviewUrl: setting.image.feviconPreviewUrl
      },
      local: {
        streetaddress: setting.local.streetaddress,
        city: setting.local.city,
        postalcode: setting.local.postalcode,
        country: setting.local.country,
        state: setting.local.state,
        phoneno: setting.local.phoneno,
        emailaddress: setting.local.emailaddress,
        language: setting.local.language
      },
      seo:
      {
        //Removed meta tags & add google analytics by Jayesh on 28-12-2018
        googleanalytics: setting.seo.googleanalytics,
        googleanalytics_url: setting.seo.googleanalytics_url
      },
      social:
      {
        facebooklink: setting.social.facebooklink,
        twitterlink: setting.social.twitterlink,
        linkedinlink: setting.social.linkedinlink,
        googlepluslink: setting.social.googlepluslink,
        skypelink: setting.social.skypelink,
        youtubelink: setting.social.youtubelink,
        pinetrestlink: setting.social.pinetrestlink,
        instagramlink: setting.social.instagramlink,
        whatsapplink: setting.social.whatsapplink
      },
      server:
      {
        maintenance_mode: setting.server.maintenance_mode,
      },
      chatscript:  //Added by Jayesh for Chat API on 26-12-2018
      {
        zendesk: setting.chatscript.zendesk,
        zoho: setting.chatscript.zoho,
        tawk: setting.chatscript.tawk,
        livechatinc: setting.chatscript.livechatinc,
        livehelpnow: setting.chatscript.livehelpnow,
        smartsupp: setting.chatscript.smartsupp,
        zendesk_active: setting.chatscript.zendesk_active,
        zoho_active: setting.chatscript.zoho_active,
        tawk_active: setting.chatscript.tawk_active,
        livechatinc_active: setting.chatscript.livechatinc_active,
        livehelpnow_active: setting.chatscript.livehelpnow_active,
        smartsupp_active: setting.chatscript.smartsupp_active
      },
      date_created: new Date(),
      date_modified: new Date(),
      created_by: '',
      modified_by: ''
    };
    Setting.findOneAndUpdate({ siteid: setting.siteid }, {
      general: {
        locale: setting.general.locale
      },
      image: {
        logo: logo_name ? logo_name : setting.image.logo,
        logoPreviewUrl: setting.image.logoPreviewUrl,
        fevicon: fevicon_name ? fevicon_name : setting.image.fevicon,
        feviconPreviewUrl: setting.image.feviconPreviewUrl
      },
      local: {
        streetaddress: setting.local.streetaddress,
        city: setting.local.city,
        postalcode: setting.local.postalcode,
        country: setting.local.country,
        state: setting.local.state,
        phoneno: setting.local.phoneno,
        emailaddress: setting.local.emailaddress,
        language: setting.local.language
      },
      seo:
      {
        //Removed meta tags & add google analytics by Jayesh on 28-12-2018
        googleanalytics: setting.seo.googleanalytics,
        googleanalytics_url: setting.seo.googleanalytics_url
      },
      social:
      {
        facebooklink: setting.social.facebooklink,
        twitterlink: setting.social.twitterlink,
        linkedinlink: setting.social.linkedinlink,
        googlepluslink: setting.social.googlepluslink,
        skypelink: setting.social.skypelink,
        youtubelink: setting.social.youtubelink,
        pinetrestlink: setting.social.pinetrestlink,
        instagramlink: setting.social.instagramlink,
        whatsapplink: setting.social.whatsapplink
      },
      server:
      {
        maintenance_mode: setting.server.maintenance_mode,
      },
      chatscript:  //Added by Jayesh for Chat API on 26-12-2018
      {
        zendesk: setting.chatscript.zendesk,
        zoho: setting.chatscript.zoho,
        tawk: setting.chatscript.tawk,
        livechatinc: setting.chatscript.livechatinc,
        livehelpnow: setting.chatscript.livehelpnow,
        smartsupp: setting.chatscript.smartsupp,
        zendesk_active: setting.chatscript.zendesk_active,
        zoho_active: setting.chatscript.zoho_active,
        tawk_active: setting.chatscript.tawk_active,
        livechatinc_active: setting.chatscript.livechatinc_active,
        livehelpnow_active: setting.chatscript.livehelpnow_active,
        smartsupp_active: setting.chatscript.smartsupp_active
      },
      date_created: new Date(),
      date_modified: new Date(),
      created_by: '',
      modified_by: ''
    }, {
        upsert: true,
        new: true,
      })
      .then(sitesetting => {
        if (!sitesetting) {
          return res.status(404).send({
            responseCode: 1,
            isError: true,
            errors: { "message": "common.api.internalerror" },
            message: "SiteSeeting not found with" + setting.siteid
          });
        }
        res.status(200).json({ responseCode: 0, isError: false, message: 'SiteSetting Updated Successfully.', data: sitesetting });
        responseLog({ responseCode: 0, isError: false, message: 'SiteSetting Updated Successfully.', data: sitesetting }, "UpdateSiteSetting");
        const content = JSON.stringify(output);
        fs.writeFileSync(filepath + setting.siteid + '.json', content);
      }).catch(err => {
        if (err.kind === 'ObjectId') {
          return res.status(404).send({
            responseCode: 1,
            isError: true,
            errors: { "message": "common.api.internalerror" },
            message: "SiteSetting not found with id " + setting.siteid
          });
        }
        return res.status(500).send({
          responseCode: 1,
          isError: true,
          errors: { "message": "common.api.internalerror" },
          message: "Error updating SiteSetting with id " + setting.siteid
        });
      });
  } catch (err) {
    errorLog(err, "UpdateSiteSetting");
    res.status(400).send({ responseCode: 1, isError: true, errors: { "message": "common.api.internalerror" }, message: err, data: '' });
  }
});


// @route   POST api/private/v1/sitesetting/getIpAddress
// @desc    Retrieve a Ipaddress
// @access  Public
app.get('/getIpAddress', function (req, res) {

  var q = urlPath.parse(req.url, true).query;

  var ip;
  if (req.headers['x-forwarded-for']) {
    ip = req.headers['x-forwarded-for'].split(",")[0].split(":")[0];
  } else if (req.connection && req.connection.remoteAddress) {
    ip = req.connection.remoteAddress.split(":")[3].split(":")[0];
  } else {
    ip = req.ip.split(":")[0];
  }

  var APIRequest = {};
  APIRequest.params = req.params;
  APIRequest.query = q;
  APIRequest.IPADDRESS = ip;
  requestLog(APIRequest, "getIpAddress");

  try {
    if (ip != '') {
      res.status(200).send({ responseCode: 0, isError: false, message: "Request Success", ipAddress: ip });
    }
    else {
      res.status(200).send({ responseCode: 1, isError: true, message: "IPAddress Not Found", ipAddress: '' });
    }
  }
  catch (err) {
    errorLog(err, "getIpAddress");
    res.status(500).send({ responseCode: 1, message: err, message: "IPAddress Not Found" });
  }
});

module.exports = app;