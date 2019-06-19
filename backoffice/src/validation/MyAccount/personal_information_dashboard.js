import validator from 'validator';
import { isScriptTag, isHtmlTag, isAlphaWithSpace } from "Helpers/helpers";

module.exports = function validateEditProfile(data) {
    let errors = {};

    //Check Empty Username...
    if (data.hasOwnProperty('Username') && validator.isEmpty(data.username + '', { ignore_whitespace: true })) {
        errors.username = "my_account.err.fieldRequired"
    } else if (data.hasOwnProperty('Username') && !validator.isEmpty(data.Username + '')) {
        if (isScriptTag(data.Username)) {
            errors.Username = "my_account.err.scriptTag";
        } else if (isHtmlTag(data.Username)) {
            errors.Username = "my_account.err.htmlTag";
        } else if (!validator.isLength(data.Username, { min: 2, max: 30 })) {
            errors.Username = "my_account.err.length2To30";
        }
    }

    //Check Empty Firstname...
    if (data.hasOwnProperty('FirstName') && validator.isEmpty(data.FirstName + '', { ignore_whitespace: true })) {
        errors.FirstName = "my_account.err.fieldRequired"
    } else if (data.hasOwnProperty('FirstName') && !validator.isEmpty(data.FirstName + '')) {
        if (isScriptTag(data.FirstName)) {
            errors.FirstName = "my_account.err.scriptTag";
        } else if (isHtmlTag(data.FirstName)) {
            errors.FirstName = "my_account.err.htmlTag";
        } else if (!validator.isLength(data.FirstName, { min: 2, max: 30 })) {
            errors.FirstName = "my_account.err.length2To30";
        } else if (!isAlphaWithSpace(data.FirstName)) {
            errors.FirstName = "my_account.err.fieldAlpha";
        }
    }

    //Check Empty Lastname...
    if (data.hasOwnProperty('LastName') && validator.isEmpty(data.LastName + '', { ignore_whitespace: true })) {
        errors.LastName = "my_account.err.fieldRequired"
    } else if (data.hasOwnProperty('LastName') && !validator.isEmpty(data.LastName + '')) {
        if (isScriptTag(data.LastName)) {
            errors.LastName = "my_account.err.scriptTag";
        } else if (isHtmlTag(data.LastName)) {
            errors.LastName = "my_account.err.htmlTag";
        } else if (!validator.isLength(data.LastName, { min: 2, max: 30 })) {
            errors.LastName = "my_account.err.length2To30";
        } else if (!isAlphaWithSpace(data.LastName)) {
            errors.LastName = "my_account.err.fieldAlpha";
        }
    }

    //Check Empty PhoneNumber...
    if (data.hasOwnProperty('PhoneNumber') && validator.isEmpty(data.PhoneNumber + '', { ignore_whitespace: true })) {
        errors.PhoneNumber = "my_account.err.fieldRequired"
    } else if (data.hasOwnProperty('PhoneNumber') && !validator.isEmpty(data.PhoneNumber + '')) {
        if (isScriptTag(data.PhoneNumber)) {
            errors.PhoneNumber = "my_account.err.scriptTag";
        } else if (isHtmlTag(data.PhoneNumber)) {
            errors.PhoneNumber = "my_account.err.htmlTag";
        } else if (!validator.isLength(data.PhoneNumber, { min: 10, max: 10 })) {
            errors.PhoneNumber = "my_account.err.mobileLength";
        } else if (!validator.isNumeric(data.PhoneNumber) || data.PhoneNumber + '' === 0) {
            errors.PhoneNumber = "my_account.err.validPhoneNo";
        }
    }

    //Check Empty MobileNo...
    if (data.hasOwnProperty('MobileNo') && validator.isEmpty(data.MobileNo + '', { ignore_whitespace: true })) {
        errors.MobileNo = "my_account.err.fieldRequired"
    } else if (data.hasOwnProperty('MobileNo') && !validator.isEmpty(data.MobileNo + '')) {
        if (isScriptTag(data.MobileNo)) {
            errors.MobileNo = "my_account.err.scriptTag";
        } else if (isHtmlTag(data.MobileNo)) {
            errors.MobileNo = "my_account.err.htmlTag";
        } else if (!validator.isLength(data.MobileNo, { min: 10, max: 10 })) {
            errors.MobileNo = "my_account.err.mobileLength";
        } else if (!validator.isNumeric(data.MobileNo) || data.MobileNo + '' === 0) {
            errors.MobileNo = "my_account.err.validPhoneNo";
        }
    }

    //Check Empty email...
    if (data.hasOwnProperty('Email') && validator.isEmpty(data.Email + '', { ignore_whitespace: true })) {
        errors.Email = "my_account.err.fieldRequired"
    } else if (data.hasOwnProperty('Email') && !validator.isEmpty(data.Email + '')) {
        if (isScriptTag(data.Email)) {
            errors.Email = "my_account.err.scriptTag";
        } else if (isHtmlTag(data.Email)) {
            errors.Email = "my_account.err.htmlTag";
        } else if (!validator.isEmail(data.Email)) {
            errors.Email = "my_account.err.emailFormat";
        }
    }

    return {
        errors,
        isValid: Object.keys(errors).length > 0 ? false : true
    };
};