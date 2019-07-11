import validator from 'validator';
import { isScriptTag, isHtmlTag } from 'Helpers/helpers';

module.exports = function validateSignupReport(data) {
    let errors = {}

    //Check Email...
    if (data.hasOwnProperty('EmailAddress') && !validator.isEmpty(data.EmailAddress, { ignore_whitespace: true })) {
        if (isScriptTag(data.EmailAddress)) {
            errors.EmailAddress = "my_account.err.scriptTag";
        } else if (isHtmlTag(data.EmailAddress)) {
            errors.EmailAddress = "my_account.err.htmlTag";
        } else if (!validator.isEmail(data.EmailAddress)) {
            errors.EmailAddress = "my_account.err.forgotEmailFormatRequired";
        }
    }

    //Check Mobile...
    if (data.hasOwnProperty('Mobile') && !validator.isEmpty(data.Mobile, { ignore_whitespace: true })) {
        if (isScriptTag(data.Mobile)) {
            errors.Mobile = "my_account.err.scriptTag";
        } else if (isHtmlTag(data.Mobile)) {
            errors.Mobile = "my_account.err.htmlTag";
        } else if (!validator.isNumeric(data.Mobile)) {
            errors.Mobile = "my_account.err.fieldNum";
        }
    }

    //Check Username...
    if (data.hasOwnProperty('Username') && !validator.isEmpty(data.Username + '', { ignore_whitespace: true })) {
        if (isScriptTag(data.Username)) {
            errors.Username = "my_account.err.scriptTag";
        } else if (isHtmlTag(data.Username)) {
            errors.Username = "my_account.err.htmlTag";
        }
    }

    return {
        errors,
        isValid: Object.keys(errors).length > 0 ? false : true
    };
};