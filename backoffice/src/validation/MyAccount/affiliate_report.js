/**
 * Author : Saloni Rathod
 * Created : 12/2/2019
 * Affiliate Validation Report 
 */
import validator from 'validator';
import { isScriptTag, isHtmlTag } from 'Helpers/helpers';

module.exports = function validateAffiliateReport(data) {
    let errors = {};

    if (data.hasOwnProperty('username') && !validator.isEmpty(data.username + '', { ignore_whitespace: true })) {
        if (isScriptTag(data.username)) {
            errors.username = "my_account.err.scriptTag";
        } else if (isHtmlTag(data.username)) {
            errors.username = "my_account.err.htmlTag";
        }
    }

    if (data.hasOwnProperty('email') && !validator.isEmpty(data.email + '', { ignore_whitespace: true })) {
        if (isScriptTag(data.email)) {
            errors.email = "my_account.err.scriptTag";
        } else if (isHtmlTag(data.email)) {
            errors.email = "my_account.err.htmlTag";
        } else if (!validator.isEmail(data.email)) {
            errors.email = "my_account.err.forgotEmailFormatRequired";
        }
    }

    if (data.hasOwnProperty('TrnRefNo') && !validator.isEmpty(data.TrnRefNo + '', { ignore_whitespace: true })) {
        if (isScriptTag(data.TrnRefNo)) {
            errors.TrnRefNo = "my_account.err.scriptTag";
        } else if (isHtmlTag(data.TrnRefNo)) {
            errors.TrnRefNo = "my_account.err.htmlTag";
        } else if (!validator.isNumeric(data.TrnRefNo) || data.TrnRefNo + '' < 0) {
            errors.TrnRefNo = "my_account.err.fieldNum";
        }
    }

    return {
        errors,
        isValid: Object.keys(errors).length > 0 ? false : true
    };
};