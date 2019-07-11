import validator from 'validator';
import { isScriptTag, isHtmlTag } from "Helpers/helpers";

module.exports = function validateSecurityQuestionDashboard(data) {
    let errors = {};

    //Check Empty SecurityQuestion...
    if (data.hasOwnProperty('SecurityQuestion') && validator.isEmpty(data.SecurityQuestion + '', { ignore_whitespace: true })) {
        errors.SecurityQuestion = "my_account.err.fieldRequired"
    } else if (data.hasOwnProperty('SecurityQuestion') && !validator.isEmpty(data.SecurityQuestion + '')) {
        if (isScriptTag(data.SecurityQuestion)) {
            errors.SecurityQuestion = "my_account.err.scriptTag";
        } else if (isHtmlTag(data.SecurityQuestion)) {
            errors.SecurityQuestion = "my_account.err.htmlTag";
        }
    }

    //Check Empty Answer...
    if (data.hasOwnProperty('Answer') && validator.isEmpty(data.Answer + '', { ignore_whitespace: true })) {
        errors.Answer = "my_account.err.fieldRequired"
    } else if (data.hasOwnProperty('Answer') && !validator.isEmpty(data.Answer + '')) {
        if (isScriptTag(data.Answer)) {
            errors.Answer = "my_account.err.scriptTag";
        } else if (isHtmlTag(data.Answer)) {
            errors.Answer = "my_account.err.htmlTag";
        }
    }

    return {
        errors,
        isValid: Object.keys(errors).length > 0 ? false : true
    };
};