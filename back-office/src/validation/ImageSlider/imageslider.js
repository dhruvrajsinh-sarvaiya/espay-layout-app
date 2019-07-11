/**
 * Create BY Sanjay 
 * Created Date 03-06-2019
 * Validation file for Image Slider 
 */

import validator from 'validator';
import { isScriptTag, isHtmlTag } from "Helpers/helpers";

module.exports = function validateImageSliderFormInput(data) {
    let errors = {};

    if (data === undefined) {
        errors.message = 'common.api.invalidrequest';
    } else {

        if (data.slidername !== undefined && validator.isEmpty(data.slidername.trim())) {
            errors.slidername = "my_account.err.fieldRequired";
        } else if (data.slidername !== undefined && isScriptTag(data.slidername)) {
            errors.slidername = "my_account.err.scriptTag";
        }
        else if (data.slidername !== undefined && isHtmlTag(data.slidername)) {
            errors.slidername = "my_account.err.htmlTag";
        }

        (data.imageslist.map((lst) => {
            if (lst.image === undefined || lst.image === '') {
                errors.image = 'my_account.err.fieldRequired';
            } else if (lst.image.name !== undefined && parseInt(lst.image.name.split('.').length) > 2) {
                errors.image = 'sitesetting.form.error.doubleextesionfilename';
            } else if (lst.image.type !== undefined && lst.image.type !== 'image/jpeg' && lst.image.type !== 'image/jpg' && lst.image.type !== 'image/png') {
                errors.image = 'sitesetting.form.error.validatefile';
            } else if (lst.image.size !== undefined && lst.image.size > 5767168) {
                errors.image = 'sitesetting.form.error.filemaxsize';
            }

            if (validator.isEmpty(lst.imagelink)) {
                errors.imagelink = "my_account.err.fieldRequired";
            } else if ((lst.imagelink) !== undefined && isScriptTag(lst.imagelink)) {
                errors.imagelink = "my_account.err.scriptTag";
            } else if ((lst.imagelink) !== undefined && isHtmlTag(lst.imagelink)) {
                errors.imagelink = "my_account.err.htmlTag";
            } else if ((lst.imagelink) !== undefined && (!validator.isURL(lst.imagelink))) {
                errors.imagelink = "sitesetting.form.error.invalidurl";
            }

            if (validator.isEmpty(lst.sortorder.toString())) {
                errors.sortorder = "my_account.err.fieldRequired";
            }
        }))
    }

    return {
        errors,
        isValid: Object.keys(errors).length > 0 ? false : true
    };
};