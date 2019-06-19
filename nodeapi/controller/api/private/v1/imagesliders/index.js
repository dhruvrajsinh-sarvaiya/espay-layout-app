/**
 * Create By Sanjay 
 * Created Date 29-05-2019
 * Node CRUD Api For Image Slider  
*/

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
const ImageSliders = require('../../../../../models/ImageSliders/index');//for Post API Model
const validateImageSlider = require('../../../../../validation/imageSlider');
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

// @route    GET api/private/v1/imageSliders
// @desc     Retrive all Image Slider List
// @access   Public
app.get('/', function (req, res) {

    var q = urlPath.parse(req.url, true).query;
    var APIRequest = {};
    APIRequest.params = req.params;
    APIRequest.query = q;
    requestLog(APIRequest, "ListImageSliders");

    try {
        ImageSliders.find()
            .then(imageSliders => {
                res.status(200);
                res.json({
                    responseCode: 0,
                    isError: false,
                    message: "Request Success",
                    data: imageSliders
                });
                res.end();
                responseLog({ responseCode: 0, isError: false, message: '', data: imageSliders }, "ListImageSliders");
            })
            .catch(err => {
                res.status(500);
                res.json({
                    responseCode: 9,
                    isError: true,
                    errors: { "message": "common.api.internalerror" },
                    message: err.message || "Some error occurred while retriving Image Slider"
                });
                res.end();
                errorLog(err, "ListImageSliders");
            });
    } catch (err) {
        errorLog(err, "ListImageSliders");
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


//@route     GET api/private/v1/imageSliders/imageSlidersCount
//@des       Retrive All Count For Image Sliders
//@access    Public
app.get("/imageSlidersCount", function (req, res) {

    var APIRequest = {};
    var count = {};
    requestLog(APIRequest, "ImageSliderCount");

    try {
        ImageSliders.count({}).then(imageSliderCount => {
            count.imageSliderCount = imageSliderCount;
            res.status(200);
            res.json({
                responseCode: 0,
                isError: false,
                message: "Request Success",
                data: count
            });
            res.end();
            responseLog({ responseCode: 0, isError: false, message: '', data: count }, "ImageSliderCount");
        });
    } catch (err) {
        errorLog(err, "ImageSliderCount");
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

//@route     POST api/private/v1/imageSliders/addImageSlider
//@des       Add New Image Slider
//@params    {slidername: "", status: "", imageslist:[{image: "", imagepreviewurl: "", imagelink: "", sortorder: ""}]}
//@access    Public
app.post('/addImageSlider', function (req, res) {
    var q = urlPath.parse(req.url, true).query;
    var APIRequest = {};
    APIRequest.params = req.params;
    APIRequest.referer = req.headers['referer'];
    APIRequest.query = q;
    APIRequest.body = req.body;
    requestLog(APIRequest, "AddImageSldier")

    const { errors, isValid } = validateImageSlider.validateimageSliderPageInput(JSON.parse(req.body.data), req.files);

    if (!isValid) {
        res.status(400).json({ responseCode: 1, isError: true, message: "Validation Failed", errors: errors }).end();
    }

    let imageSlider = JSON.parse(req.body.data);
    var images = [];
    var imagesoriginalname = [];
    var imagesextention = [];
    var imagesfilename = [];
    var images_name = [];
    try {
        if (typeof req.files !== undefined && req.files !== null) {
            Object.values(req.files).map(function (values, index) {
                if (values !== undefined && values !== "") {
                    images[index] = values;
                    imagesoriginalname[index] = values.name;
                    imagesextention[index] = imagesoriginalname[index].split(".");
                    imagesfilename[index] = imagesoriginalname[index].substr(0, imagesoriginalname[index].lastIndexOf('.'));
                    images_name[index] = imagesfilename[index] + Date.now() + '.' + imagesextention[index][imagesextention[index].length - 1];
                }
            });
        }

        var ListOfImages = imageSlider;
        ListOfImages.imageslist.map((lst, key) => {
            lst.image = images_name[key]
        })

        ImageSliders.countDocuments({}, function (err, totalImageSlider) {
            if (err) {
                errorLog(err, "AddImageSldier");
                return res.status(500).json({
                    responseCode: 1,
                    isError: true,
                    message: '',
                    errors: { "message": "common.api.internalerror" }
                }).end();
            }
            ImageSliders.findOne({}, {}, { sort: { 'sliderid': -1 } }).then(slider_id => {
                if (totalImageSlider == 0) {
                    masterId = 1;
                }
                else
                    masterId = parseInt(slider_id.sliderid) + 1;
                const ImageSlider = new ImageSliders({
                    sliderid: masterId,
                    slidername: imageSlider.slidername,
                    status: imageSlider.status,
                    imageslist: ListOfImages.imageslist,
                    date_created: new Date(),
                    date_modified: new Date(),
                    created_by: '',
                    modified_by: ''
                })
                const output = {
                    sliderid: masterId,
                    slidername: imageSlider.slidername,
                    status: imageSlider.status,
                    imageslist: ListOfImages.imageslist,
                    date_created: new Date(),
                    date_modified: new Date(),
                    created_by: '',
                    modified_by: ''
                }

                ImageSlider.save()
                    .then(data => {
                        res.status(200).send({ responseCode: 0, isError: false, message: 'Image Slider added successfullly.' });
                        responseLog({ responseCode: 0, isError: false, message: 'Image Slider added successfullly.', data: data }, "AddImageSldier");
                        const content = JSON.stringify(output);
                        fs.writeFileSync(filepath + setting.siteid + '.json', content);
                    }).catch(err => {
                        res.status(500).send({
                            responseCode: 9,
                            errors: { "message": "common.api.internalerror" },
                            isError: true,
                            message: err.message || "Some error occurred while creating the Image Slider."
                        });
                        errorLog(err, "AddImageSldier");
                    });
            }).catch(err => {
                res.status(500).send({
                    responseCode: 9,
                    errors: { "message": "common.api.internalerror" },
                    isError: true,
                    message: err.message || "Some error occurred while retrieving Image Slider."
                });
                errorLog(err, "AddImageSldier");
            });
        });
    } catch (err) {
        errorLog(err, "AddImageSldier");
        res.status(400).send({ responseCode: 1, isError: true, errors: { "message": "common.api.internalerror" }, message: err, data: "" })
    }
});

// @route   PUT api/private/v1/imageSliders/editImageSlider
// @desc    Update a Image Slider with sliderid 
// @body   {slidername: "", status: "", imageslist:[{image: "", imagepreviewurl: "", imagelink: "", sortorder: ""}]}
// @access  Public
app.put('/editImageSlider', function (req, res) {
    var q = urlPath.parse(req.url, true).query;
    var APIRequest = {};
    APIRequest.params = req.params;
    APIRequest.referer = req.headers['referer'];
    APIRequest.query = q;
    APIRequest.body = req.body;
    requestLog(APIRequest, "EditImageSlider");

    let imageSlider = JSON.parse(req.body.data);
    var images = [];
    var imagesoriginalname = [];
    var imagesextention = [];
    var imagesfilename = [];
    var images_name = [];

    try {
        const { errors, isValid } = validateImageSlider.validateimageSliderPageInput(JSON.parse(req.body.data), req.files);
        if (!isValid) {
            res.status(400).json({ responseCode: 1, isError: true, message: "Validation Failed", errors: errors }).end();
        }

        if (typeof req.files !== undefined && req.files !== null) {
            Object.values(req.files).map(function (values, index) {
                if (values !== undefined && values !== "") {
                    images[index] = values;
                    imagesoriginalname[index] = values.name;
                    imagesextention[index] = imagesoriginalname[index].split(".");
                    imagesfilename[index] = imagesoriginalname[index].substr(0, imagesoriginalname[index].lastIndexOf('.'));
                    images_name[index] = imagesfilename[index] + Date.now() + '.' + imagesextention[index][imagesextention[index].length - 1];
                }
            });
        }

        var ListOfImages = imageSlider;
        ListOfImages.imageslist.map((lst, key) => {
            if (images_name[key] !== null && images_name[key] !== undefined) {
                lst.image = images_name[key]
            }
            else {
                lst.image = lst.image
            }
        })

        const output = {
            sliderid: imageSlider.sliderid,
            slidername: imageSlider.slidername,
            status: imageSlider.status,
            imageslist: ListOfImages.imageslist,
            date_created: new Date(),
            date_modified: new Date(),
            created_by: '',
            modified_by: ''
        }

        ImageSliders.findOneAndUpdate({ sliderid: imageSlider.sliderid }, {
            slidername: imageSlider.slidername,
            status: imageSlider.status,
            imageslist: ListOfImages.imageslist,
            date_modified: new Date(),
            modified_by: ''
        }, {
                upsert: true,
                new: true
            })
            .then(imageSlider => {
                if (!imageSlider) {
                    return res.status(400).send({
                        responseCode: 1, isError: true, message: "Image Slider not found with id " + req.body.data.sliderid, errors: {},
                    });
                }

                res.status(200).json({ responseCode: 0, isError: false, message: 'Image Slider Edit successfullly.' });
                responseLog({ responseCode: 0, isError: false, message: 'Image Slider Edit successfullly.', data: imageSlider }, "EditImageSlider");
                const content = JSON.stringify(output);
                fs.writeFileSync(filepath + setting.siteid + '.json', content);
            }).catch(err => {

                errorLog(err, "EditImageSlider");
                return res.status(500).send({
                    responseCode: 9, isError: true, errors: { "message": "common.api.internalerror" },
                    message: "Error updating Image Slider with id " + req.body.data.sliderid
                });
            });

    } catch (err) {
        errorLog(err, "EditImageSlider");
        res.status(400).send({ responseCode: 1, isError: true, errors: {}, message: err });
    }
});

module.exports = app;