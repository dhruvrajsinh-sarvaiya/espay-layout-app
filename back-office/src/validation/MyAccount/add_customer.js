import validator from 'validator';
import { isValidPhoneNumber } from 'react-phone-number-input';
import { isScriptTag, isHtmlTag, isAlphaWithSpace } from 'Helpers/helpers';

module.exports = function validateAddCustomer(data) {
    let errors = {};

    //Check Firstname...
    if (data.hasOwnProperty('firstname') && validator.isEmpty(data.firstname + '', { ignore_whitespace: true })) {
        errors.firstname = "my_account.err.fieldRequired"
    } else if (data.hasOwnProperty('firstname') && !validator.isEmpty(data.firstname + '')) {
        if (isScriptTag(data.firstname)) {
            errors.firstname = "my_account.err.scriptTag";
        } else if (isHtmlTag(data.firstname)) {
            errors.firstname = "my_account.err.htmlTag";
        } else if (!isAlphaWithSpace(data.firstname)) {
            errors.firstname = "my_account.err.fieldAlpha";
        }
    }

    //Check Lastname...
    if (data.hasOwnProperty('lastname') && validator.isEmpty(data.lastname + '', { ignore_whitespace: true })) {
        errors.lastname = "my_account.err.fieldRequired"
    } else if (data.hasOwnProperty('lastname') && !validator.isEmpty(data.lastname + '')) {
        if (isScriptTag(data.lastname)) {
            errors.lastname = "my_account.err.scriptTag";
        } else if (isHtmlTag(data.lastname)) {
            errors.lastname = "my_account.err.htmlTag";
        } else if (!isAlphaWithSpace(data.lastname)) {
            errors.lastname = "my_account.err.fieldAlpha";
        }
    }

    //Check Username...
    if (data.hasOwnProperty('username') && validator.isEmpty(data.username + '', { ignore_whitespace: true })) {
        errors.username = "my_account.err.fieldRequired"
    } else if (data.hasOwnProperty('username') && !validator.isEmpty(data.username + '')) {
        if (isScriptTag(data.username)) {
            errors.username = "my_account.err.scriptTag";
        } else if (isHtmlTag(data.username)) {
            errors.username = "my_account.err.htmlTag";
        }
    }

    //Check Email...
    if (data.hasOwnProperty('email') && validator.isEmpty(data.email + '', { ignore_whitespace: true })) {
        errors.email = "my_account.err.fieldRequired"
    } else if (data.hasOwnProperty('email') && !validator.isEmpty(data.email) && !validator.isEmail(data.email)) {
        errors.email = "my_account.err.EmailFormatRequired";
    }

    //Check MobileNo...
    if (data.hasOwnProperty('mobile') && validator.isEmpty(data.mobile + '')) {
        errors.mobile = "my_account.err.fieldRequired"
    } else if (data.hasOwnProperty('mobile') && !validator.isEmpty(data.mobile) && !isValidPhoneNumber(data.mobile)) {
        errors.mobile = "my_account.err.validPhoneNo";
    }

    return {
        errors,
        isValid: Object.keys(errors).length > 0 ? false : true
    };
};