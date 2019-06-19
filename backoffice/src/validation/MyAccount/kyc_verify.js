import validator from 'validator';
import { isScriptTag, isHtmlTag, isAlphaNumWithSpace } from 'Helpers/helpers';

module.exports = function validateKYC(data) {
    let errors = {};

    //Check Empty VerifyStatus Status...
    if (data.hasOwnProperty('VerifyStatus') && validator.isEmpty(data.VerifyStatus + '')) {
        errors.VerifyStatus = "my_account.err.fieldRequired";
    }

    //Check Empty Remark Status...
    if (data.hasOwnProperty('Remark') && validator.isEmpty(data.Remark, { ignore_whitespace: true })) {
        errors.Remark = "my_account.err.fieldRequired";
    } else if (data.hasOwnProperty('Remark') && !validator.isEmpty(data.Remark)) {
        if (isScriptTag(data.Remark)) {
            errors.Remark = "my_account.err.scriptTag";
        } else if (isHtmlTag(data.Remark)) {
            errors.Remark = "my_account.err.htmlTag";
        }
    }

    return {
        errors,
        isValid: Object.keys(errors).length > 0 ? false : true
    };
};