import validator from 'validator';
import { isScriptTag, isHtmlTag } from 'Helpers/helpers';

module.exports = function validateKYCVerifyList(data) {
    let errors = {};

    //Check Empty Mobile Status...
    if (data.hasOwnProperty('Mobile') && !validator.isEmpty(data.Mobile, { ignore_whitespace: true })) {
        if (isScriptTag(data.Mobile)) {
            errors.Mobile = "my_account.err.scriptTag";
        } else if (isHtmlTag(data.Mobile)) {
            errors.Mobile = "my_account.err.htmlTag";
        } else if (!validator.isInt(data.Mobile)) {
            errors.Mobile = "my_account.err.fieldNum";
        } else if (!validator.isLength(data.Mobile, { min: 10, max: 10 })) {
            errors.Mobile = "my_account.err.mobileFormat";
        }
    }

    //Check Empty EmailAddress Status...
    if (data.hasOwnProperty('EmailAddress') && !validator.isEmpty(data.EmailAddress, { ignore_whitespace: true })) {
        if (isScriptTag(data.EmailAddress)) {
            errors.EmailAddress = "my_account.err.scriptTag";
        } else if (isHtmlTag(data.EmailAddress)) {
            errors.EmailAddress = "my_account.err.htmlTag";
        } else if (!validator.isEmail(data.EmailAddress)) {
            errors.EmailAddress = "my_account.err.emailFormat";
        }
    }

    return {
        errors,
        isValid: Object.keys(errors).length > 0 ? false : true
    };
};