/**
 * Create By Sanjay 
 * Created Date 03-06-2019
 * Validation File Fore Add Image Slider 
*/

const validator = require('validator');
const isEmpty = require('./is-empty');

exports.validateimageSliderPageInput = function (data, filedata) {
    let errors = {};

    if (typeof data == 'undefined') {
        errors.message = 'common.api.invalidrequest';
    }

    if (validator.isEmpty(data.slidername.toString())) {
        errors.slidername = 'Name field is required';
    }

    if (validator.isEmpty((data.status).toString())) {
        errors.status = 'Status field is required';
    }

    if (typeof filedata != undefined && filedata != null) {
        Object.values(filedata).map(function (values, index) {
            if (typeof values === 'undefined' || values === '') {
                errors.image = 'sitesetting.form.error.requireimage';
            }
            else if (typeof values != 'undefined' && typeof values.name != 'undefined' && parseInt(values.name.split('.').length) > 2) {
                errors.image = 'sitesetting.form.error.doubleextesionfilename';
            }
            else if (typeof values != 'undefined' && typeof values.type != 'undefined' && values.mimetype != 'image/jpeg' && values.mimetype != 'image/jpg' && values.mimetype != 'image/png') {
                errors.image = 'sitesetting.form.error.validatefile';
            }
        })
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };
}