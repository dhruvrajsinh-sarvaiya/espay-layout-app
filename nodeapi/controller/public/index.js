const express = require('express');
const router = express.Router();
const urlPath = require('url');
var generateToken = require('../generateToken');
var logHelper = require('../../helper/logHelper');
var errorLog = logHelper.errorLog;
var responseLog = logHelper.responseLog;
var requestLog = logHelper.requestLog;
var DdosValidator = require('../setupHelper'); // Added by Bharat Jograna on 20 Jun 2019

router.use(DdosValidator.validateDenialofService());// Added by Bharat Jograna on 20 Jun 2019

// @route   post public/generateToken
// @desc    Return jwt token
// @access  Public
router.post(
    '/generateToken', (req, res) => {
        var q = urlPath.parse(req.url, true).query;
        var APIRequest = {};
        APIRequest.params = req.params;
        APIRequest.referer = req.headers['referer']
        APIRequest.query = q;
        requestLog(APIRequest, "generateToken");
        try {

            var data = req.body.data;

            if (data.ua) {
                var resData = {};
                var ip;
                if (req.headers['x-forwarded-for']) {
                    ip = req.headers['x-forwarded-for'].split(",")[0].split(":")[0];
                } else if (req.connection && req.connection.remoteAddress) {
                    ip = req.connection.remoteAddress.split(":")[3].split(":")[0];
                } else {
                    ip = req.ip.split(":")[0];
                }
                resData.ipAddress = ip;
                resData.tokenData = generateToken.generateToken(data);
            }
            res.json(resData);
            responseLog({ data: resData }, "generateToken");
        }
        catch (err) {
            errorLog(err, "generateToken");
            res.status(400).send({ status: 1, message: err, errors: { message: 'Invalid Request' } });
        }
    }
);

router.get('/test', (req, res) => res.json({ msg: 'Yo Works' }));

module.exports = router;