import validator from 'validator';
import { isScriptTag, isHtmlTag } from 'Helpers/helpers';

module.exports = function validateChangePasswordDashboard(data) {
    let errors = {};

    if (data.hasOwnProperty('currentPassword') && validator.isEmpty(data.currentPassword + '', { ignore_whitespace: true })) {
        errors.currentPassword = "my_account.err.fieldRequired"
    } else if (data.hasOwnProperty('currentPassword') && !validator.isEmpty(data.currentPassword + '')) {
        if (isScriptTag(data.currentPassword)) {
            errors.currentPassword = "my_account.err.scriptTag";
        } else if (isHtmlTag(data.currentPassword)) {
            errors.currentPassword = "my_account.err.htmlTag";
        } else if (!validator.isLength(data.currentPassword, { min: 6, max: 30 })) {
            errors.currentPassword = "my_account.err.passwordLength";
        } else if (!validator.matches(data.currentPassword, "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).*$")) {
            errors.currentPassword = "my_account.err.passAlphaNumSpecial";
        }
    }

    //Check Empty New Password...
    if (data.hasOwnProperty('newPassword') && validator.isEmpty(data.newPassword + '', { ignore_whitespace: true })) {
        errors.newPassword = "my_account.err.fieldRequired"
    } else if (data.hasOwnProperty('newPassword') && !validator.isEmpty(data.newPassword + '')) {
        if (isScriptTag(data.newPassword)) {
            errors.newPassword = "my_account.err.scriptTag";
        } else if (isHtmlTag(data.newPassword)) {
            errors.newPassword = "my_account.err.htmlTag";
        } else if (!validator.isLength(data.newPassword, { min: 6, max: 30 })) {
            errors.newPassword = "my_account.err.passwordLength";
        } else if (!validator.matches(data.newPassword, "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).*$")) {
            errors.newPassword = "my_account.err.passAlphaNumSpecial";
        }
    }

    //Check Empty Confirm Password...
    if (data.hasOwnProperty('confirmPassword') && validator.isEmpty(data.confirmPassword + '', { ignore_whitespace: true })) {
        errors.confirmPassword = "my_account.err.fieldRequired"
    } else if (data.hasOwnProperty('confirmPassword') && !validator.isEmpty(data.confirmPassword + '')) {
        if (isScriptTag(data.confirmPassword)) {
            errors.confirmPassword = "my_account.err.scriptTag";
        } else if (isHtmlTag(data.confirmPassword)) {
            errors.confirmPassword = "my_account.err.htmlTag";
        } else if (!validator.isLength(data.confirmPassword, { min: 6, max: 30 })) {
            errors.confirmPassword = "my_account.err.passwordLength";
        } else if (!validator.matches(data.confirmPassword, data.newPassword)) {
            errors.confirmPassword = "my_account.err.displayUsersPasswordMatch";
        }
    }

    return {
        errors,
        isValid: Object.keys(errors).length > 0 ? false : true
    };
};