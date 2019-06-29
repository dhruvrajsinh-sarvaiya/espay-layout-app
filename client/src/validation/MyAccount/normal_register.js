import validator from 'validator';
import { isValidPhoneNumber } from 'react-phone-number-input';

import { isScriptTag, isHtmlTag } from "Helpers/helpers";
module.exports = function validateNrmlRegister(data) {
    let errors = {};

    //Check Empty Username...
    if (typeof (data.username) !== 'undefined' && validator.isEmpty(data.username)) {
        errors.username = "my_account.err.fieldRequired";
    } else if (typeof (data.username) !== 'undefined' && !validator.isLength(data.username, { min: 2, max: 30 })) {
        errors.username = "my_account.err.length2To30";
    } else if (typeof (data.username) !== 'undefined' && isScriptTag(data.username)) {
        errors.username = "my_account.err.scriptTag";
    } else if (typeof (data.username) !== 'undefined' && isHtmlTag(data.username)) {
        errors.username = "my_account.err.htmlTag";
    }

    //Check Refer Code
    if (typeof (data.ReferralCode) !== 'undefined' && isScriptTag(data.ReferralCode)) {
        errors.ReferralCode = "my_account.err.scriptTag";
    } else if (typeof (data.ReferralCode) !== 'undefined' && isHtmlTag(data.ReferralCode)) {
        errors.ReferralCode = "my_account.err.htmlTag";
    }

    //Check Empty Firstname...
    if (typeof (data.firstname) !== 'undefined' && validator.isEmpty(data.firstname)) {
        errors.firstname = "my_account.err.fieldRequired";
    } else if (typeof (data.firstname) !== 'undefined' && !validator.isAlpha(data.firstname)) {
        errors.firstname = "my_account.err.fieldAlpha";
    } else if (typeof (data.firstname) !== 'undefined' && !validator.isLength(data.firstname, { min: 2, max: 30 })) {
        errors.firstname = "my_account.err.length2To30";
    }

    //Check Empty Lastname...
    if (typeof (data.lastname) !== 'undefined' && validator.isEmpty(data.lastname)) {
        errors.lastname = "my_account.err.fieldRequired";
    } else if (typeof (data.lastname) !== 'undefined' && !validator.isAlpha(data.lastname)) {
        errors.lastname = "my_account.err.fieldAlpha";
    } else if (typeof (data.lastname) !== 'undefined' && !validator.isLength(data.lastname, { min: 2, max: 30 })) {
        errors.lastname = "my_account.err.length2To30";
    }

    //Check Empty CountryCode... 
    if (typeof (data.CountryCode) !== 'undefined' && validator.isEmpty(data.CountryCode)) {
        errors.mobile = "my_account.err.selectCountry";
    }

    //Check Empty MobileNo...
    if (typeof (data.mobile) !== 'undefined' && (data.mobile === 'undefined' || validator.isEmpty(data.mobile))) {
        errors.mobile = "my_account.err.fieldRequired";
    } else if (typeof (data.mobile) !== 'undefined' && !isValidPhoneNumber(data.mobile)) {
        errors.mobile = "my_account.err.validPhoneNo";
    }

    //Check Empty Password...
    if (typeof (data.email) !== 'undefined' && validator.isEmpty(data.email)) {
        errors.email = "my_account.err.fieldRequired";
    } else if (typeof (data.email) !== 'undefined' && !validator.isEmail(data.email)) {
        errors.email = "my_account.err.EmailFormatRequired";
    }

    //Check Empty Password...
    if (typeof (data.password) !== 'undefined' && validator.isEmpty(data.password)) {
        errors.password = "my_account.err.fieldRequired";
    } else if (typeof (data.password) !== 'undefined' && !validator.isLength(data.password, { min: 6, max: 30 })) {
        errors.password = "my_account.err.passwordLength";
    } else if (typeof (data.password) !== 'undefined' && !validator.matches(data.password, "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).*$")) {
        errors.password = "my_account.err.passAlphaNumSpecial";
    } else if (isScriptTag(data.password)) {
        errors.password = "my_account.err.scriptTag";
    } else if (isHtmlTag(data.password)) {
        errors.password = "my_account.err.htmlTag";
    }
    
    //Check Empty ConfirmPassword...
    if (typeof (data.confirmpassword) !== 'undefined' && validator.isEmpty(data.confirmpassword)) {
        errors.confirmpassword = "my_account.err.fieldRequired";
    } else if (typeof (data.confirmpassword) !== 'undefined' && !validator.equals(data.password, data.confirmpassword)) {
        errors.confirmpassword = 'my_account.err.PasswordMatch';
    }

    return {
        errors,
        isValid: Object.keys(errors).length > 0 ? false : true
    };
};