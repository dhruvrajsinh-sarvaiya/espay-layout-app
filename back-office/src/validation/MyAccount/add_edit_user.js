//Developer : Saloni Rathod
//Date : 26-02-2019
//File Comment : MyAccount User Validation
import validator from 'validator';
import { isScriptTag, isHtmlTag } from "Helpers/helpers";

module.exports = function validateUser(data) {
    let errors = {};

    //check FirstName...    
    if (data.hasOwnProperty('FirstName') && validator.isEmpty(data.FirstName + '', { ignore_whitespace: true })) {
        errors.FirstName = "my_account.err.fieldRequired"
    } else if (data.hasOwnProperty('FirstName') && !validator.isEmpty(data.FirstName + '')) {
        if (isScriptTag(data.FirstName)) {
            errors.FirstName = "my_account.err.scriptTag";
        } else if (isHtmlTag(data.FirstName)) {
            errors.FirstName = "my_account.err.htmlTag";
        } else if (!validator.isAlpha(data.FirstName)) {
            errors.FirstName = "my_account.err.fieldAlpha";
        } else if (!validator.isLength(data.FirstName, { min: 2, max: 30 })) {
            errors.FirstName = "my_account.err.length2To30";
        }
    }

    //Check UserName...
    if (data.hasOwnProperty('UserName') && validator.isEmpty(data.UserName + '', { ignore_whitespace: true })) {
        errors.UserName = "my_account.err.fieldRequired"
    } else if (data.hasOwnProperty('UserName') && !validator.isEmpty(data.UserName + '')) {
        if (isScriptTag(data.UserName)) {
            errors.UserName = "my_account.err.scriptTag";
        } else if (isHtmlTag(data.UserName)) {
            errors.UserName = "my_account.err.htmlTag";
        } else if (!validator.isLength(data.UserName, { min: 2, max: 30 })) {
            errors.UserName = "my_account.err.length2To30";
        }
    }

    //Check LastName...
    if (data.hasOwnProperty('LastName') && validator.isEmpty(data.LastName + '', { ignore_whitespace: true })) {
        errors.LastName = "my_account.err.fieldRequired"
    } else if (data.hasOwnProperty('LastName') && !validator.isEmpty(data.LastName + '')) {
        if (isScriptTag(data.LastName)) {
            errors.LastName = "my_account.err.scriptTag";
        } else if (isHtmlTag(data.LastName)) {
            errors.LastName = "my_account.err.htmlTag";
        } else if (!validator.isAlpha(data.LastName)) {
            errors.LastName = "my_account.err.fieldAlpha";
        } else if (!validator.isLength(data.LastName, { min: 2, max: 30 })) {
            errors.LastName = "my_account.err.length2To30";
        }
    }

    //Check Status
    if (data.hasOwnProperty('Status') && validator.isEmpty(data.Status + '')) {
        errors.Status = "my_account.err.fieldRequired";
    }

    //Check RoleName
    if (data.hasOwnProperty('RoleId') && validator.isEmpty(data.RoleId + '')) {
        errors.RoleId = "my_account.err.fieldRequired";
    }

    //Check Empty Mobile...
    if (data.hasOwnProperty('Mobile') && validator.isEmpty(data.Mobile + '', { ignore_whitespace: true })) {
        errors.Mobile = "my_account.err.fieldRequired"
    } else if (data.hasOwnProperty('Mobile') && !validator.isEmpty(data.Mobile + '')) {
        if (isScriptTag(data.Mobile)) {
            errors.Mobile = "my_account.err.scriptTag";
        } else if (isHtmlTag(data.Mobile)) {
            errors.Mobile = "my_account.err.htmlTag";
        } else if (!validator.isLength(data.Mobile, { min: 10, max: 10 })) {
            errors.Mobile = "my_account.err.mobileLength";
        } else if (!validator.isNumeric(data.Mobile) || data.Mobile + '' === '0') {
            errors.Mobile = "my_account.err.validPhoneNo";
        }
    }

    if (data.hasOwnProperty('Email') && validator.isEmpty(data.Email + '', { ignore_whitespace: true })) {
        errors.Email = "my_account.err.fieldRequired"
    } else if (data.hasOwnProperty('Email') && !validator.isEmpty(data.Email + '')) {
        if (isScriptTag(data.Email)) {
            errors.Email = "my_account.err.scriptTag";
        } else if (isHtmlTag(data.Email)) {
            errors.Email = "my_account.err.htmlTag";
        } else if (!validator.isEmail(data.Email)) {
            errors.Email = "my_account.err.forgotEmailFormatRequired";
        }
    }

    //Check Empty New Password...
    if (data.hasOwnProperty('Password') && validator.isEmpty(data.Password + '', { ignore_whitespace: true })) {
        errors.Password = "my_account.err.fieldRequired"
    } else if (data.hasOwnProperty('Password') && !validator.isEmpty(data.Password + '')) {
        if (isScriptTag(data.Password)) {
            errors.Password = "my_account.err.scriptTag";
        } else if (isHtmlTag(data.Password)) {
            errors.Password = "my_account.err.htmlTag";
        } else if (!validator.isLength(data.Password, { min: 6, max: 30 })) {
            errors.Password = "my_account.err.passwordLength";
        } else if (!validator.matches(data.Password, "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).*$")) {
            errors.Password = "my_account.err.passAlphaNumSpecial";
        }
    }

    //Check Empty Confirm Password...
    if (data.hasOwnProperty('confirmPassword') && !validator.equals(data.Password, data.confirmPassword)) {
        errors.confirmPassword = "my_account.err.resetPasswordMatch"
    }

    return {
        errors,
        isValid: Object.keys(errors).length > 0 ? false : true
    };
};