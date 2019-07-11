import validator from 'validator';
import { isScriptTag, isHtmlTag } from 'Helpers/helpers';
module.exports = function validateChangePassword(data) {
    let errors = {};

    //Check Empty Old Password...    
    if (typeof (data.oldPassword) != 'undefined' && validator.isEmpty(data.oldPassword)) {
        errors.oldPassword = "my_account.err.fieldRequired";
    } else if (typeof (data.oldPassword) != 'undefined' && !validator.isLength(data.oldPassword, { min: 6, max: 30 })) {
        errors.oldPassword = "my_account.err.passwordLength";
    } else if (isScriptTag(data.oldPassword)) {
        errors.oldPassword = "my_account.err.scriptTag";
    }
    else if (isHtmlTag(data.oldPassword)) {
        errors.oldPassword = "my_account.err.htmlTag";
    }
    else if (typeof (data.oldPassword) != 'undefined' && !validator.matches(data.oldPassword, "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).*$")) {
        errors.oldPassword = "my_account.err.passAlphaNumSpecial";
    }

    //Check Empty New Password...
    if (typeof (data.newPassword) != 'undefined' && validator.isEmpty(data.newPassword)) {
        errors.newPassword = "my_account.err.fieldRequired";
    } else if (typeof (data.newPassword) != 'undefined' && !validator.isLength(data.newPassword, { min: 6, max: 30 })) {
        errors.newPassword = "my_account.err.passwordLength";
    }
  else  if (isScriptTag(data.newPassword)) {
        errors.newPassword = "my_account.err.scriptTag";
    }
    else if (isHtmlTag(data.newPassword)) {
        errors.newPassword = "my_account.err.htmlTag";
    } else if (typeof (data.newPassword) != 'undefined' && !validator.matches(data.newPassword, "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).*$")) {
        errors.newPassword = "my_account.err.passAlphaNumSpecial";
    }

    //Check Empty Confirm Password...
    if (typeof (data.confirmPassword) != 'undefined' && validator.isEmpty(data.confirmPassword)) {
        errors.confirmPassword = "my_account.err.fieldRequired";
    }
    if (isScriptTag(data.confirmPassword)) {
        errors.confirmPassword = "my_account.err.scriptTag";
    }
    else if (isHtmlTag(data.confirmPassword)) {
        errors.confirmPassword = "my_account.err.htmlTag";
    } else if (typeof (data.confirmPassword) != 'undefined' && !validator.isLength(data.confirmPassword, { min: 6, max: 30 })) {
        errors.confirmPassword = "my_account.err.passwordLength";
    } else if (typeof (data.confirmPassword) != 'undefined' && !validator.matches(data.confirmPassword, "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).*$")) {
        errors.confirmPassword = "my_account.err.passAlphaNumSpecial";
    } else if (typeof (data.confirmPassword) != 'undefined' && !validator.equals(data.newPassword, data.confirmPassword)) {
        errors.confirmPassword = 'my_account.err.PasswordMatch';
    }

    return {
        errors,
        isValid: Object.keys(errors).length > 0 ? false : true
    };
};