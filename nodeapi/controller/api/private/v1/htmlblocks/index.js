/**
 * Create By Sanjay 
 * Created Date 27-05-2019
 * Node  API For List, Add, Update, Count HTML Blocks
*/

const express = require('express');
const router = express.Router();
const urlPath = require('url');
var logHelper = require('../../../../../helper/logHelper');
var errorLog = logHelper.errorLog;
var responseLog = logHelper.responseLog;
var requestLog = logHelper.requestLog;
const HTMLBlocks = require('../../../../../models/HTMLBlocks/index');//for Post API Model
const validateHTMLBlocks = require('../../../../../validation/htmlblocks');//Validation
var DdosValidator = require('../../../../setupHelper'); // Added by Bharat Jograna on 20 Jun 2019

router.use(DdosValidator.validateDenialofService());// Added by Bharat Jograna on 20 Jun 2019

// @route    GET api/private/v1/htmlblocks
// @desc     Retrive all Html Blocks List
// @access   Public
router.get('/', function (req, res) {

    var q = urlPath.parse(req.url, true).query;
    var APIRequest = {};
    APIRequest.params = req.params;
    APIRequest.query = q;
    requestLog(APIRequest, "ListHTMLBlocks");

    try {
        HTMLBlocks.find()
            .then(htmlblocks => {
                res.status(200);
                res.json({
                    responseCode: 0,
                    isError: false,
                    message: "Request Success",
                    data: htmlblocks
                });
                res.end();
                responseLog({ responseCode: 0, isError: false, message: '', data: htmlblocks }, "ListHTMLBlocks");
            })
            .catch(err => {
                res.status(500);
                res.json({
                    responseCode: 9,
                    isError: true,
                    errors: { "message": "common.api.internalerror" },
                    message: err.message || "Some error occurred while retriving HTML Blocks"
                });
                res.end();
                errorLog(err, "ListHTMLBlocks");
            });
    } catch (err) {
        errorLog(err, "ListHTMLBlocks");
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


//@route     GET api/private/v1/htmlblocks/htmlblocksCount
//@des       Retrive All Count For HTML Blocks
//@access    Public
router.get("/htmlblocksCount", function (req, res) {

    var APIRequest = {};
    var count = {};
    requestLog(APIRequest, "HTMLBlocksCount");

    try {
        HTMLBlocks.countDocuments({}).then(htmlBlocksCount => {
            count.htmlBlocksCount = htmlBlocksCount;
            res.status(200);
            res.json({
                responseCode: 0,
                isError: false,
                message: "Request Success",
                data: count
            });
            res.end();
            responseLog({ responseCode: 0, isError: false, message: '', data: count }, "HTMLBlocksCount");
        });
    } catch (err) {
        errorLog(err, "HTMLBlocksCount");
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

//@route     POST api/private/v1/htmlblocks/addHTMLBlocks
//@des       Add New HTML Blocks
//@body      {"name": "", "status": "", content: ""}
//@access    Public
router.post('/addHTMLBlocks', function (req, res) {
    var APIRequest = {};
    APIRequest.body = req.body;
    requestLog(APIRequest, "AddHTMLBlocks")

    try {
        //Check Validation
        const { errors, isValid } = validateHTMLBlocks.validateHTMLBlocksInput(req.body.htmlBlocksdata);
        if (!isValid) {
            return res.status(400).json({ responseCode: 1, isError: true, message: "Validation Failed", errors: errors }).end();
        }

        HTMLBlocks.countDocuments({}, function (err, totalHTMLBlocks) {
            if (err) {
                errorLog(err, "AddHTMLBlocks");
                return res.status(500).json({
                    responseCode: 1,
                    isError: true,
                    message: '',
                    errors: { "message": "common.api.internalerror" }
                }).end();
            }
            HTMLBlocks.findOne({}, {}, { sort: { 'htmlblockid': -1 } }).then(htmlblock_id => {
                let masterId;
                if (totalHTMLBlocks == 0) {
                    masterId = 1;
                }
                else
                    masterId = parseInt(htmlblock_id.htmlblockid) + 1;
                const HTMLBlock = new HTMLBlocks({
                    htmlblockid: masterId,
                    name: req.body.htmlBlocksdata.name,
                    status: req.body.htmlBlocksdata.status,
                    content: req.body.htmlBlocksdata.content,
                    date_created: new Date(),
                    date_modified: new Date(),
                    created_by: '',
                    modified_by: ''
                })

                HTMLBlock.save()
                    .then(data => {
                        res.status(200).send({ responseCode: 0, isError: false, message: 'HTML Block added successfullly.' });
                        responseLog({ responseCode: 0, isError: false, message: 'HTML Block added successfullly.', data: HTMLBlock }, "AddHTMLBlocks");
                    }).catch(error => {
                        res.status(500).send({
                            responseCode: 9,
                            errors: { "message": "common.api.internalerror" },
                            isError: true,
                            message: error.message || "Some error occurred while creating the HTML Block."
                        });
                        errorLog(error, "AddHTMLBlocks");
                    });
            }).catch(error => {
                res.status(500).send({
                    responseCode: 9,
                    error: { "message": "common.api.internalerror" },
                    isError: true,
                    message: error.message || "Some error occurred while retrieving HTML Block."
                });
                errorLog(error, "AddHTMLBlocks");
            });
        });
    } catch (err) {
        errorLog(err, "AddHTMLBlocks");
        res.status(400).send({ responseCode: 1, errors: {}, isError: true, message: err });
    }
});

// @route   GET api/private/v1/htmlblocks/getHTMLBLOCKById/:htmlblockid
// @desc    Retrieve a single HTML Block with htmlblockid 
// @access  Public
router.get('/getHTMLBLOCKById/:htmlblockid', function (req, res) {

    var q = urlPath.parse(req.url, true).query;
    var APIRequest = {};
    APIRequest.params = req.params;
    APIRequest.query = q;
    requestLog(APIRequest, "GETHTMLBlockById");

    try {
        HTMLBlocks.findOne({ htmlblockid: req.params.htmlblockid })
            .then(htmlblock => {

                if (!htmlblock) {
                    return res.status(404).send({
                        responseCode: 1, isError: true,
                        message: "HTML Block not found with id " + req.params.htmlblockid
                    });
                }
                res.status(200).send({ responseCode: 0, isError: false, message: 'HTML Block Get successfullly.', data: htmlblock });
                responseLog({ responseCode: 0, isError: false, message: '', data: htmlblock }, "GETHTMLBlockById");
            }).catch(err => {
                if (err.kind === 'ObjectId') {
                    return res.status(404).send({
                        responseCode: 1, errors: {}, isError: true,
                        message: "HTML Block not found with id " + req.params.htmlblockid
                    });
                }
                errorLog(err, "GETHTMLBlockById");
                return res.status(500).send({
                    responseCode: 9, isError: true, errors: { "message": "common.api.internalerror" },
                    message: "Error retrieving HTML Block with id " + req.params.htmlblockid
                });
            });
    } catch (err) {
        errorLog(err, "GETHTMLBlockById");
        res.status(400).send({ responseCode: 1, errors: {}, isError: true, message: err });
    }
});

// @route   PUT api/private/v1/htmlblocks/editHTMLBlock
// @desc    Update a news with htmlblockid 
// @body   { "htmlblockid":"", "name": "", "status": "", content: ""}
// @access  Public
router.put('/editHTMLBlock', function (req, res) {

    var q = urlPath.parse(req.url, true).query;
    var APIRequest = {};
    APIRequest.params = req.params;
    APIRequest.query = q;
    requestLog(APIRequest, "editHTMLBlock");

    try {
        const { errors, isValid } = validateHTMLBlocks.validateHTMLBlocksInput(req.body.htmlBlocksdata);
        if (!isValid) {
            return res.status(400).json({ responseCode: 1, isError: true, message: "Validation Failed", errors: errors }).end();
        }
        // Find news and update it with the requested htmlblockid
        HTMLBlocks.findOneAndUpdate({ htmlblockid: req.body.htmlBlocksdata.htmlblockid }, {
            name: req.body.htmlBlocksdata.name,
            status: req.body.htmlBlocksdata.status,
            content: req.body.htmlBlocksdata.content,
            date_modified: new Date(),
            modified_by: ''
        }, { new: true })
            .then(htmlBlock => {
                if (!htmlBlock) {
                    return res.status(400).send({
                        responseCode: 1, isError: true, message: "HTML Block not found with id " + req.body.htmlBlocksdata.htmlblockid, errors: {},
                    });
                }

                res.status(200).json({ responseCode: 0, isError: false, message: 'HTML Block Edit successfullly.' });
                responseLog({ responseCode: 0, isError: false, message: 'HTML Block Edit successfullly.', data: htmlBlock }, "editHTMLBlock");

            }).catch(err => {

                errorLog(err, "editHTMLBlock");
                return res.status(500).send({
                    responseCode: 9, isError: true, errors: { "message": "common.api.internalerror" },
                    message: "Error updating HTML Block with id " + req.body.htmlBlocksdata.htmlblockid
                });
            });

    } catch (err) {
        errorLog(err, "editHTMLBlock");
        res.status(400).send({ responseCode: 1, isError: true, errors: {}, message: err });
    }
});

module.exports = router;