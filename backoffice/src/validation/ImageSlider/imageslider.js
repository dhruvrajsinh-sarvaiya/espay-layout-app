/**
 * Create BY Sanjay 
 * Created Date 03-06-2019
 * Validation file for Image Slider 
 */

import validator from 'validator';
import { isScriptTag,isHtmlTag } from "Helpers/helpers";

module.exports = function validateImageSliderFormInput(data) {
    let errors = {};

    if (typeof data === 'undefined') {
        errors.message = 'common.api.invalidrequest';
    }

    if (validator.isEmpty(data.slidername.trim())) {
        errors.slidername = "my_account.err.fieldRequired";
    } else if (typeof (data.slidername) !== 'undefined' && isScriptTag(data.slidername)) {
        errors.slidername = "my_account.err.scriptTag";
    }
    else if (typeof (data.slidername) !== 'undefined' && isHtmlTag(data.slidername)) {
        errors.slidername = "my_account.err.htmlTag";
    }
    (data.imageslist.map((lst, key) => {
        if (typeof lst.image === 'undefined' || lst.image === '') {
            errors.image = 'my_account.err.fieldRequired';
        }
        else if (typeof lst.image.name !== 'undefined' && parseInt(lst.image.name.split('.').length) > 2) {
            errors.image = 'sitesetting.form.error.doubleextesionfilename';
        }
        else if (typeof lst.image.type !== 'undefined' && lst.image.type !== 'image/jpeg' && lst.image.type !== 'image/jpg' && lst.image.type !== 'image/png') {
            errors.image = 'sitesetting.form.error.validatefile';
        }
        else if (typeof lst.image.size !== 'undefined' && lst.image.size > 5767168) {
            errors.image = 'sitesetting.form.error.filemaxsize';
        }
        if (validator.isEmpty(lst.imagelink)) {
            errors.imagelink = "my_account.err.fieldRequired";
        } else if (typeof (lst.imagelink) !== 'undefined' && isScriptTag(lst.imagelink)) {
            errors.imagelink = "my_account.err.scriptTag";
        }
            else if (typeof (lst.imagelink) !== 'undefined' && isHtmlTag(lst.imagelink)) {
                errors.imagelink = "my_account.err.htmlTag";
        } else if (typeof (lst.imagelink) !== 'undefined' && (!validator.isURL(lst.imagelink))) {
            errors.imagelink = "sitesetting.form.error.invalidurl";
        }
        if (validator.isEmpty(lst.sortorder.toString())) {
            errors.sortorder = "my_account.err.fieldRequired";
        }
    }))

    return {
        errors,
        isValid: Object.keys(errors).length > 0 ? false : true
    };
};