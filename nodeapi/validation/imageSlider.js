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
    } else {

        if (data.slidername === undefined || data.slidername === null || validator.isEmpty(data.slidername + " ")) {
            errors.slidername = 'Name field is required';
        }

        if (data.status === undefined || data.status === null || validator.isEmpty(data.status + " ")) {
            errors.status = 'Status field is required';
        }

        if (filedata !== undefined && filedata != null) {
            Object.values(filedata).map(function (values, index) {
                if (typeof values === 'undefined' || values === '') {
                    errors.image = 'sitesetting.form.error.requireimage';
                }
                else if (values.name != undefined && parseInt(values.name.split('.').length) > 2) {
                    errors.image = 'sitesetting.form.error.doubleextesionfilename';
                }
                else if (values.type != undefined && values.mimetype != 'image/jpeg' && values.mimetype != 'image/jpg' && values.mimetype != 'image/png') {
                    errors.image = 'sitesetting.form.error.validatefile';
                }
                return [];
            })
        }
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };
}