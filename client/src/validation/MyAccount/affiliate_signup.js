/**
 * Auther : Salim Deraiya
 * Created : 11/02/2019
 * Affiliate Signup Validation
 */
import { isScriptTag, isHtmlTag } from "Helpers/helpers";
import validator from 'validator';
import { isValidPhoneNumber } from 'react-phone-number-input';

module.exports = function validateNrmlRegister(data) {
    let errors = {};

    //Check Empty Username...
    if (typeof(data.Username) !== 'undefined' && validator.isEmpty(data.Username)) {
        errors.Username = "my_account.err.fieldRequired";
    } else if(typeof(data.Username) !== 'undefined' && !validator.isLength(data.Username, { min: 2, max: 30 })) {
        errors.Username = "my_account.err.length2To30";
    } else if (typeof (data.Username) !== 'undefined' && isScriptTag(data.Username)) {
        errors.Username = "my_account.err.scriptTag";
    } else if (typeof (data.Username) !== 'undefined' && isHtmlTag(data.Username)) {
        errors.Username = "my_account.err.htmlTag";
    }

    //Check Empty Firstname...
    if (typeof(data.Firstname) !== 'undefined' && validator.isEmpty(data.Firstname)) {
        errors.Firstname = "my_account.err.fieldRequired";
    } else if(typeof(data.Firstname) !== 'undefined' && !validator.isAlpha(data.Firstname)) {
        errors.Firstname = "my_account.err.fieldAlpha";
    } else if(typeof(data.Firstname) !== 'undefined' && !validator.isLength(data.Firstname, { min: 2, max: 30 })) {
        errors.Firstname = "my_account.err.length2To30";
    } else if (typeof (data.Firstname) !== 'undefined' && isScriptTag(data.Firstname)) {
        errors.Firstname = "my_account.err.scriptTag";
    } else if (typeof (data.Firstname) !== 'undefined' && isHtmlTag(data.Firstname)) {
        errors.Firstname = "my_account.err.htmlTag";
    }

    //Check Refer Code
    if (typeof (data.ReferCode) !== 'undefined' && isScriptTag(data.ReferCode)) {
        errors.ReferCode = "my_account.err.scriptTag";
    } else if (typeof (data.ReferCode) !== 'undefined' && isHtmlTag(data.ReferCode)) {
        errors.ReferCode = "my_account.err.htmlTag";
    }

    //Check Empty Lastname...
    if (typeof(data.Lastname) !== 'undefined' && validator.isEmpty(data.Lastname)) {
        errors.Lastname = "my_account.err.fieldRequired";
    } else if(typeof(data.Lastname) !== 'undefined' && !validator.isAlpha(data.Lastname)) {
        errors.Lastname = "my_account.err.fieldAlpha";
    } else if(typeof(data.Lastname) !== 'undefined' && !validator.isLength(data.Lastname, { min: 2, max: 30 })) {
        errors.Lastname = "my_account.err.length2To30";
    } else if (typeof (data.Lastname) !== 'undefined' && isScriptTag(data.Lastname)) {
        errors.Lastname = "my_account.err.scriptTag";
    } else if (typeof (data.Lastname) !== 'undefined' && isHtmlTag(data.Lastname)) {
        errors.Lastname = "my_account.err.htmlTag";
    }

    //Check Empty CountryCode... 
    if (typeof(data.CountryCode) !== 'undefined' && validator.isEmpty(data.CountryCode)) {
        errors.Mobile = "my_account.err.selectCountry";
    }

    //Check Empty MobileNo...
    if (typeof(data.Mobile) !== 'undefined' &&  validator.isEmpty(data.Mobile)) {
        errors.Mobile = "my_account.err.fieldRequired";
    } else if(typeof(data.Mobile) !== 'undefined' && !isValidPhoneNumber(data.Mobile)) {
        errors.Mobile = "my_account.err.validPhoneNo";
    }

    //Check Empty Password...
    if (typeof(data.Email) !== 'undefined' && validator.isEmpty(data.Email)) {
        errors.Email = "my_account.err.fieldRequired";
    } else if (typeof(data.Email) !== 'undefined' && !validator.isEmail(data.Email)) {
        errors.Email = "my_account.err.EmailFormatRequired";
    }

    //Check Empty Password...
    if (typeof(data.Password) !== 'undefined' && validator.isEmpty(data.Password)) {
        errors.Password = "my_account.err.fieldRequired";
    } else if(typeof(data.Password) !== 'undefined' && !validator.isLength(data.Password, { min: 6, max: 30 })) {
        errors.Password = "my_account.err.passwordLength";
    } else if(typeof(data.Password) !== 'undefined' && !validator.matches(data.Password,"^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).*$")){
        errors.Password = "my_account.err.passAlphaNumSpecial";
    } else if (isScriptTag(data.Password)) {
        errors.Password= "my_account.err.scriptTag";
    } else if (isHtmlTag(data.Password)) {
        errors.Password= "my_account.err.htmlTag";
    }

    //Check Empty ConfirmPassword...
    if (typeof(data.confirmPassword) !== 'undefined' && validator.isEmpty(data.confirmPassword)) {
        errors.confirmPassword = "my_account.err.fieldRequired";
    } else if (typeof(data.confirmPassword) !== 'undefined' && !validator.equals(data.Password, data.confirmPassword)) {
        errors.confirmPassword = 'my_account.err.PasswordMatch';
    }

    //Check Empty Scheme Type...
    if (typeof(data.SchemeType) !== 'undefined' && validator.isEmpty(data.SchemeType)) {
        errors.SchemeType = "my_account.err.fieldRequired";
    }
    
    return {
        errors,
        isValid: Object.keys(errors).length > 0 ? false : true
    };
};