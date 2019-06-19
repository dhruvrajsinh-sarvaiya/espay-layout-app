/*
    Developer : Bharat Jograna
    Date : 12-02-2019
    update by :
    File Comment : Users and Control validation
*/
import validator from 'validator';
import { isScriptTag, isHtmlTag } from 'Helpers/helpers';

module.exports = function validateReferaals(data) {

    let errors = {};

    //Check Empty Username...
    if (data.hasOwnProperty('Username') && !validator.isEmpty(data.Username + '', { ignore_whitespace: true })) {
        if (isScriptTag(data.Username)) {
            errors.Username = "my_account.err.scriptTag";
        } else if (isHtmlTag(data.Username)) {
            errors.Username = "my_account.err.htmlTag";
        }
    }

    //Check Empty ReferUsername...
    if (data.hasOwnProperty('ReferUsername') && !validator.isEmpty(data.ReferUsername + '', { ignore_whitespace: true })) {
        if (isScriptTag(data.ReferUsername)) {
            errors.ReferUsername = "my_account.err.scriptTag";
        } else if (isHtmlTag(data.ReferUsername)) {
            errors.ReferUsername = "my_account.err.htmlTag";
        }
    }

    //Check Empty Email...
    if (data.hasOwnProperty('email') && !validator.isEmpty(data.email + '', { ignore_whitespace: true })) {
        if (isScriptTag(data.email)) {
            errors.email = "my_account.err.scriptTag";
        } else if (isHtmlTag(data.email)) {
            errors.email = "my_account.err.htmlTag";
        } else if (!validator.isEmail(data.email)) {
            errors.email = "my_account.err.EmailFormatRequired"
        }
    }

    //Check Empty mobile...
    if (data.hasOwnProperty('mobile') && !validator.isEmpty(data.mobile + '', { ignore_whitespace: true })) {
        if (isScriptTag(data.mobile)) {
            errors.mobile = "my_account.err.scriptTag";
        } else if (isHtmlTag(data.mobile)) {
            errors.mobile = "my_account.err.htmlTag";
        } else if (!validator.isNumeric(data.mobile) && !validator.isLength(data.mobile, { min: 10, max: 11 })) {
            errors.mobile = "my_account.err.mobileFormat"
        }
    }

    return {
        errors,
        isValid: Object.keys(errors).length > 0 ? false : true
    };
}