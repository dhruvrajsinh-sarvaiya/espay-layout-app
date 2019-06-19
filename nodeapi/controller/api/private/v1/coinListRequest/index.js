// Added by Dhara gajera 3-1-2019 for coin list fields - start
const express = require('express');
const router = express.Router();
const urlPath = require('url');
var logHelper = require('../../../../../helper/logHelper');
var errorLog = logHelper.errorLog;
var responseLog = logHelper.responseLog;
var requestLog = logHelper.requestLog;

// coin list field model
const CoinListField = require('../../../../../models/CoinListField/index');
const CoinListFieldData = require('../../../../../models/CoinListFieldData/index');

// Validation
const validateCoinListField = require('../../../../../validation/coinListField');

// @route   GET api/private/v1/coinListRequest
// @desc    Retrieve all coin list fields
// @access  Public
router.get('/', function (req, res) {
  var q = urlPath.parse(req.url, true).query;
  var APIRequest = {};
  APIRequest.params = req.params;
  APIRequest.referer = req.headers['referer'];
  APIRequest.query = q;
  APIRequest.body = req.body;
  requestLog(APIRequest, "coinListRequest");
  try {
    CoinListField.find().sort("sortOrder")
      .then(coinlistfields => {
        res.status(200);
        res.json({
          responseCode: 0,
          isError: false,
          message: "Request Success",
          data: coinlistfields
        });
        res.end();
        responseLog({ responseCode: 0, isError: false, message: '', data: coinlistfields }, "coinListRequest");
      })
      .catch(err => {
        res.status(500);
        res.json({
          responseCode: 9,
          isError: true,
          errors: { "message": "common.api.internalerror" },
          message: err.message || "Some error occurred while getting Coin List Fields."
        });
        res.end();
        errorLog(err, "coinListRequest");
      });
  } catch (err) {
    errorLog(err, "coinListRequest");
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

// @route   PUT api/private/v1/coinListRequest/editCoinListField 
// @desc    Update coin list field by name 
// @body   { "id":"xyz","formfields":"{"fieldname" : "If this coin is a security?","status" : 0,"Isrequired:1}"}
// @access  Public
router.put('/editCoinListField', function (req, res) {

  var q = urlPath.parse(req.url, true).query;
  var APIRequest = {};
  APIRequest.params = req.params;
  APIRequest.referer = req.headers['referer'];
  APIRequest.query = q;
  APIRequest.body = req.body;
  requestLog(APIRequest, "editCoinListField");
  try {
    const { errors, isValid } = validateCoinListField.validateCoinListFieldsInput(req.body.coinListdata.formfields);
    if (isValid) {
      return res.status(400).json({ responseCode: 1, isError: true, message: "Validation Failed", errors: errors }).end();
    }
    // Find coin field name and update status
    CoinListField.findOneAndUpdate({ _id: req.body.coinListdata.id },
      {
        "formfields": req.body.coinListdata.formfields, date_modified: new Date(), created_by: '',
        modified_by: ''
      }, { new: true })
      .then(coinlistfields => {
        if (!coinlistfields) {
          return res.status(400).send({
            responseCode: 1, isError: true, message: "Coin list field not found for you requested.", errors: {},
          });
        }

        res.status(200).json({ responseCode: 0, isError: false, message: 'Coin list field updated successfully.' });
        responseLog({ responseCode: 0, isError: false, message: 'Coin list field updated successfully.', data: coinlistfields }, "editCoinListField");

      }).catch(err => {

        errorLog(err, "editCoinListField");
        return res.status(500).send({
          responseCode: 9, isError: true, errors: { "message": "common.api.internalerror" },
          message: "Coin list field not found for you requested.",
        });
      });

  } catch (err) {
    errorLog(err, "editCoinListField");
    res.status(400).send({ responseCode: 1, isError: true, errors: {}, message: err });
  }
});


// @route   POST api/private/v1/coinListRequest/addCoinListFieldsData
// @desc    Add coin list fields data  
// @access  Public
router.post('/addCoinListFieldsData', function (req, res) {
  var q = urlPath.parse(req.url, true).query;
  var APIRequest = {};
  APIRequest.params = req.params;
  APIRequest.referer = req.headers['referer'];
  APIRequest.query = q;
  APIRequest.body = req.body;
  requestLog(APIRequest, "addCoinListFieldsData");
  try {
    //Check Validation
    CoinListField.find().then(coinlistfields => {//this quesry is to get coin list filds list to check field is checked or not

      //check validations of checked fields only
      const { errors, isValid } = validateCoinListField.validateCoinListRequestFormInput(req.body, coinlistfields[0].formfields);
      if (isValid) {
        return res.status(400).json({ responseCode: 1, isError: true, message: "Validation Failed", errors: errors }).end();
      }
      const coinListfields = new CoinListFieldData({
        userId: req.body.coinListdata.userId,
        coin_name: req.body.coinListdata.coinFields.coin_name,
        coin_ticker: req.body.coinListdata.coinFields.coin_ticker,
        date_of_issuance: req.body.coinListdata.coinFields.date_of_issuance,
        coin_logo: req.body.coinListdata.coinFields.coin_logo,
        coin_website: req.body.coinListdata.coinFields.coin_website,
        website_faq: req.body.coinListdata.coinFields.website_faq,
        coin_forum: req.body.coinListdata.coinFields.coin_forum,
        bitcoin_talk: req.body.coinListdata.coinFields.bitcoin_talk,
        whitepaper_business: req.body.coinListdata.coinFields.whitepaper_business,
        whitepaper_technical: req.body.coinListdata.coinFields.whitepaper_technical,
        stack_channel: req.body.coinListdata.coinFields.stack_channel,
        official_gitHub_repository_link: req.body.coinListdata.coinFields.official_gitHub_repository_link,
        team_contact: req.body.coinListdata.coinFields.team_contact,
        team_bio: req.body.coinListdata.coinFields.team_bio,
        headquarter_address: req.body.coinListdata.coinFields.headquarter_address,
        wallet_source_code: req.body.coinListdata.coinFields.wallet_source_code,
        node_source_code: req.body.coinListdata.coinFields.node_source_code,
        official_blockchain_explorer_link: req.body.coinListdata.coinFields.official_blockchain_explorer_link,
        max_coin_supply: req.body.coinListdata.coinFields.max_coin_supply,
        tx_Fee_for_transaction: req.body.coinListdata.coinFields.tx_Fee_for_transaction,
        social_media_links: req.body.coinListdata.coinFields.social_media_links,
        code_review_audit_trusted_community: req.body.coinListdata.coinFields.code_review_audit_trusted_community,
        deployment_process: req.body.coinListdata.coinFields.deployment_process,
        premined_coin_amount: req.body.coinListdata.coinFields.premined_coin_amount,
        premined_coin_in_escrow: req.body.coinListdata.coinFields.premined_coin_in_escrow,
        number_of_addresses_coins_were_distributed: req.body.coinListdata.coinFields.number_of_addresses_coins_were_distributed,
        segwit_exhibition: req.body.coinListdata.coinFields.segwit_exhibition,
        blockspeed: req.body.coinListdata.coinFields.blockspeed,
        core_algorithm: req.body.coinListdata.coinFields.core_algorithm,
        amount_raised_during_pre_ico: req.body.coinListdata.coinFields.amount_raised_during_pre_ico,
        advisory: req.body.coinListdata.coinFields.advisory,
        number_of_blocks_mined: req.body.coinListdata.coinFields.number_of_blocks_mined,
        dev_language: req.body.coinListdata.coinFields.dev_language,
        erc_20_compliant: req.body.coinListdata.coinFields.erc_20_compliant,
        difficulty: req.body.coinListdata.coinFields.difficulty,
        wallet: req.body.coinListdata.coinFields.wallet,
        usual_cost: req.body.coinListdata.coinFields.usual_cost,
        if_this_coin_is_a_security: req.body.coinListdata.coinFields.if_this_coin_is_a_security,
        coin_type: req.body.coinListdata.coinFields.coin_type,
        coin_description: req.body.coinListdata.coinFields.coin_description,
        coin_short_name: req.body.coinListdata.coinFields.coin_short_name,
        coin_address: req.body.coinListdata.coinFields.coin_address,
        decimal: req.body.coinListdata.coinFields.decimal,
        total_supply: req.body.coinListdata.coinFields.total_supply,
        circulating_supply: req.body.coinListdata.coinFields.circulating_supply,
        first_name: req.body.coinListdata.coinFields.first_name,
        last_name: req.body.coinListdata.coinFields.last_name,
        address: req.body.coinListdata.coinFields.address,
        address_line_2: req.body.coinListdata.coinFields.address_line_2,
        city: req.body.coinListdata.coinFields.city,
        state: req.body.coinListdata.coinFields.state,
        postalCode: req.body.coinListdata.coinFields.postalCode,
        country: req.body.coinListdata.coinFields.country,
        phone: req.body.coinListdata.coinFields.phone,
        email: req.body.coinListdata.coinFields.email,
        project_name: req.body.coinListdata.coinFields.project_name,
        project_website_link: req.body.coinListdata.coinFields.project_website_link,
        do_you_have_an_active_community: req.body.coinListdata.coinFields.do_you_have_an_active_community,
        information_on_how_funds_were_raised: req.body.coinListdata.coinFields.information_on_how_funds_were_raised,
        current_listing_on_other_exchanges: req.body.coinListdata.coinFields.current_listing_on_other_exchanges,

        date_created: new Date(),
        date_modified: new Date(),
        created_by: '',
        modified_by: ''
      });

      // Save coin list fields data in the database
      coinListfields.save()
        .then(data => {
          res.status(200).send({ responseCode: 0, isError: false, message: 'CoinList Fields Data added successfully.' });
          responseLog({ responseCode: 0, isError: false, message: 'CoinList Fields Data added successfully.', data: coinListfields }, "addCoinListFieldsData");
        }).catch(err => {
          res.status(500).send({
            responseCode: 9,
            errors: { "message": "common.api.internalerror" },
            isError: true,
            message: err.message || "Some error occurred while adding the CoinList Fields Data."
          });
          errorLog(err, "addCoinListFieldsData");
        });
    })
      .catch(err => {
        res.status(500);
        res.json({
          responseCode: 9,
          isError: true,
          errors: { "message": "common.api.internalerror" },
          message: err.message || "coinListField.list.fail.msg"
        });
        res.end();
        errorLog(err, "CoinListField");
      });
  } catch (err) {
    errorLog(err, "addCoinListFieldsData");
    res.status(400).send({ responseCode: 1, errors: {}, isError: true, message: err });
  }
});

// @route   GET api/private/v1/CoinListRequest/coinRequestByUser
// @desc    Retrieve all coin list request done by user
// @access  Public 9/1/2019
router.get('/coinRequestByUser', function (req, res) {
  var q = urlPath.parse(req.url, true).query;
  var APIRequest = {};
  APIRequest.params = req.params;
  APIRequest.referer = req.headers['referer'];
  APIRequest.query = q;
  APIRequest.body = req.body;
  requestLog(APIRequest, "CoinListRequest");
  try {
    CoinListFieldData.find()
      .then(CoinListFieldDatas => {
        res.status(200);
        res.json({
          responseCode: 0,
          isError: false,
          message: "Request Success",
          data: CoinListFieldDatas
        });
        res.end();
        responseLog({ responseCode: 0, isError: false, message: '', data: CoinListFieldDatas }, "CoinListRequest");
      })
      .catch(err => {
        res.status(500);
        res.json({
          responseCode: 9,
          isError: true,
          errors: { "message": "common.api.internalerror" },
          message: err.message || "Some error occurred while getting Coin List Request."
        });
        res.end();
        errorLog(err, "CoinListRequest");
      });
  } catch (err) {
    errorLog(err, "CoinListRequest");
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

//Added by Dhara gajera 16/1/2019
// @route   GET api/private/v1/CoinListRequest/coinListCount
// @desc    Retrieve all count for coin list fields and coin list request
// @access  Public
router.get('/coinListCount', function (req, res) {
  var q = urlPath.parse(req.url, true).query;
  var APIRequest = {};
  APIRequest.params = req.params;
  APIRequest.referer = req.headers['referer'];
  APIRequest.query = q;
  APIRequest.body = req.body;
  requestLog(APIRequest, "CoinListRequestCount");
  let count = {}
  try {
    CoinListFieldData.count({}).then(coinListFieldData => {
      count.coinListRequestCount = coinListFieldData;

      if (typeof count.coinListRequestCount != "undefined" && count.coinListRequestCount != null) {
        CoinListField.find().then(coinlistfields => {
          var counted = 0;
          coinlistfields[0].formfields.forEach(function (d) {
            counted++;
          });
          count.CoinListField = counted;
          res.status(200);
          res.json({
            responseCode: 0,
            isError: false,
            message: "Request Success",
            data: count
          });
          res.end();
          responseLog({ responseCode: 0, isError: false, message: '', data: count }, "CoinListCount");
        });
      }
    });

  } catch (err) {
    errorLog(err, "CoinListCount");
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