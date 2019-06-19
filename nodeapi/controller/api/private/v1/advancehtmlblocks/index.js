/**
 * Create By Sanjay 
 * Created Date 04-06-2019
 * CRUD API For Advance HTML Blocks
*/

const express = require('express');
const router = express.Router();
const urlPath = require('url');
var logHelper = require('../../../../../helper/logHelper');//import log helper for create log file
var errorLog = logHelper.errorLog;//for create error log file 
var responseLog = logHelper.responseLog;//for create response log file
var requestLog = logHelper.requestLog;//for create request log file 
const AdvanceHTMLBlocks = require('../../../../../models/AdvanceHTMLBlocks/index');//import Model

// @route    GET api/private/v1/advancehtmlblocks
// @desc     Retrive all Advance Html Blocks List
// @access   Public
router.get('/', function (req, res) {

    var q = urlPath.parse(req.url, true).query;
    var APIRequest = {};
    APIRequest.params = req.params;
    APIRequest.query = q;
    requestLog(APIRequest, "ListAdvanceHTMLBlocks");

    try {

        AdvanceHTMLBlocks.find()
            .then(advancehtmlblocks => {
                res.status(200);
                res.json({
                    responseCode: 0,
                    isError: false,
                    message: "Request Success",
                    data: advancehtmlblocks
                });
                res.end();
                responseLog({ responseCode: 0, isError: false, message: '', data: advancehtmlblocks }, "ListAdvanceHTMLBlocks");
            })
            .catch(err => {
                res.status(500);
                res.json({
                    responseCode: 9,
                    isError: true,
                    errors: { "message": "common.api.internalerror" },
                    message: err.message || "Some error occurred while retriving Advance HTML Blocks"
                });
                res.end();
                errorLog(err, "ListAdvanceHTMLBlocks");
            });

    } catch (err) {

        errorLog(err, "ListAdvanceHTMLBlocks");
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

//@route     GET api/private/v1/advancehtmlblocks/advancehtmlblocksCount
//@des       Retrive All Count For Advance HTML Blocks
//@access    Public
router.get("/advancehtmlblocksCount", function (req, res) {

    var q = urlPath.parse(req.url, true).query;
    var APIRequest = {};
    APIRequest.params = req.params;
    APIRequest.query = q;
    var count = {};
    requestLog(APIRequest, "AdvanceHTMLBlocksCount");

    try {

        AdvanceHTMLBlocks.count({}).then(AdvanceHtmlBlocksCount => {
            count.AdvanceHtmlBlocksCount = AdvanceHtmlBlocksCount;
            res.status(200);
            res.json({
                responseCode: 0,
                isError: false,
                message: "Request Success",
                data: count
            });
            res.end();
            responseLog({ responseCode: 0, isError: false, message: '', data: count }, "AdvanceHTMLBlocksCount");
        });

    } catch (err) {

        errorLog(err, "AdvanceHTMLBlocksCount");
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

//@route     POST api/private/v1/advancehtmlblocks/addAdvanceHtmlBlock
//@des       Add New Advance HTML Block
//@body      {"name": "", "status": "", type: "", content: { tabs:[], panles:[], modals:[] }}
//@access    Public
router.post('/addAdvanceHtmlBlock', function (req, res) {
    var APIRequest = {};
    APIRequest.body = req.body;
    requestLog(APIRequest, "AddAdvanceHTMLBlocks")

    try {

        AdvanceHTMLBlocks.countDocuments({}, function (err, totalAdvanceHTMLBlocks) {
            if (err) {
                errorLog(err, "AddAdvanceHTMLBlocks");
                return res.status(500).json({
                    responseCode: 1,
                    isError: true,
                    message: '',
                    errors: { "message": "common.api.internalerror" }
                }).end();
            }
            AdvanceHTMLBlocks.findOne({}, {}, { sort: { 'advancehtmlblockid': -1 } }).then(advancehtmlblock_id => {
                if (totalAdvanceHTMLBlocks == 0) {
                    masterId = 1;
                }
                else
                    masterId = parseInt(advancehtmlblock_id.advancehtmlblockid) + 1;
                const AdvanceHTMLBlock = new AdvanceHTMLBlocks({
                    advancehtmlblockid: masterId,
                    name: req.body.advancehtmlBlocksdata.name,
                    status: req.body.advancehtmlBlocksdata.status,
                    type: req.body.advancehtmlBlocksdata.type,
                    content: req.body.advancehtmlBlocksdata.content,
                    date_created: new Date(),
                    date_modified: new Date(),
                    created_by: '',
                    modified_by: ''
                })

                AdvanceHTMLBlock.save()
                    .then(data => {
                        res.status(200).send({ responseCode: 0, isError: false, message: 'Advance HTML Block added successfullly.' });
                        responseLog({ responseCode: 0, isError: false, message: 'Advcance HTML Block added successfullly.', data: data }, "AddAdvanceHTMLBlocks");
                    }).catch(err => {
                        res.status(500).send({
                            responseCode: 9,
                            errors: { "message": "common.api.internalerror" },
                            isError: true,
                            message: err.message || "Some error occurred while creating the HTML Block."
                        });
                        errorLog(err, "AddAdvanceHTMLBlocks");
                    });
            }).catch(err => {
                res.status(500).send({
                    responseCode: 9,
                    errors: { "message": "common.api.internalerror" },
                    isError: true,
                    message: err.message || "Some error occurred while retrieving HTML Block."
                });
                errorLog(err, "AddAdvanceHTMLBlocks");
            });
        });
    } catch (err) {
        errorLog(err, "AddAdvanceHTMLBlocks");
        res.status(400).send({ responseCode: 1, errors: {}, isError: true, message: err });
    }
});

// @route   PUT api/private/v1/advancehtmlblocks/editAdvanceHtmlBlock
// @desc    Update a Advance HTML Blocks with advancehtmlblockid 
// @body    {"name": "", "status": "", type: "", content: { tabs:[], panles:[], modals:[] }}
// @access  Public
router.put('/editAdvanceHtmlBlock', function (req, res) {

    var q = urlPath.parse(req.url, true).query;
    var APIRequest = {};
    APIRequest.params = req.params;
    APIRequest.query = q;
    requestLog(APIRequest, "editAdvanceHtmlBlock");

    try {

        // Find news and update it with the requested advancehtmlblockid
        AdvanceHTMLBlocks.findOneAndUpdate({ advancehtmlblockid: req.body.advancehtmlBlocksdata.advancehtmlblockid }, {
            name: req.body.advancehtmlBlocksdata.name,
            status: req.body.advancehtmlBlocksdata.status,
            type: req.body.advancehtmlBlocksdata.type,
            content: req.body.advancehtmlBlocksdata.content,
            date_modified: new Date(),
            modified_by: ''
        }, { new: true })
            .then(advancehtmlBlock => {
                if (!advancehtmlBlock) {
                    return res.status(400).send({
                        responseCode: 1, isError: true, message: "Advance HTML Block not found with id " + req.body.advancehtmlBlocksdata.advancehtmlblockid, errors: {},
                    });
                }

                res.status(200).json({ responseCode: 0, isError: false, message: 'Advance HTML Block Edit successfullly.' });
                responseLog({ responseCode: 0, isError: false, message: 'Advance HTML Block Edit successfullly.', data: advancehtmlBlock }, "editAdvanceHtmlBlock");

            }).catch(err => {

                errorLog(err, "editAdvanceHtmlBlock");
                return res.status(500).send({
                    responseCode: 9, isError: true, errors: { "message": "common.api.internalerror" },
                    message: "Error updating Advance HTML Block with id " + req.body.advancehtmlBlocksdata.advancehtmlblockid
                });
            });

    } catch (err) {

        errorLog(err, "editAdvanceHtmlBlock");
        res.status(400).send({ responseCode: 1, isError: true, errors: {}, message: err });

    }
});

module.exports = router;