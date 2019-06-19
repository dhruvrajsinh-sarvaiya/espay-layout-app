/*
    Developer : Bharat Jograna
    Date : 19-02-2019
    Update by : Salim Deraiya 22/02/2019
    File Comment : Role Validation
*/
import validator from 'validator';
import { isScriptTag, isHtmlTag, isAlphaNumWithSpace } from 'Helpers/helpers';

module.exports = function validateRoles(data) {
    let errors = {};

    //Check Empty RoleName...
    if (data.hasOwnProperty('RoleName') && validator.isEmpty(data.RoleName, { ignore_whitespace: true })) {
        errors.RoleName = "my_account.err.fieldRequired"
    } else if (data.hasOwnProperty('RoleName') && !validator.isEmpty(data.RoleName)) {
        if (data.hasOwnProperty('RoleName') && isScriptTag(data.RoleName)) {
            errors.RoleName = "my_account.err.scriptTag"
        } else if (isHtmlTag(data.RoleName)) {
            errors.RoleName = "my_account.err.htmlTag";
        } else if (!isAlphaNumWithSpace(data.RoleName)) {
            errors.RoleName = "my_account.err.fieldAlphaNum";
        }
    }

    //Check Empty RoleDescription...
    if (data.hasOwnProperty('RoleDescription') && validator.isEmpty(data.RoleDescription, { ignore_whitespace: true })) {
        errors.RoleDescription = "my_account.err.fieldRequired"
    } else if (data.hasOwnProperty('RoleDescription') && !validator.isEmpty(data.RoleDescription)) {
        if (data.hasOwnProperty('RoleDescription') && isScriptTag(data.RoleDescription)) {
            errors.RoleDescription = "my_account.err.scriptTag"
        } else if (isHtmlTag(data.RoleDescription)) {
            errors.RoleDescription = "my_account.err.htmlTag";
        }
    }

    //Check Empty Status...
    if (data.hasOwnProperty('Status') && validator.isEmpty(data.Status + '')) {
        errors.Status = "my_account.err.fieldRequired";
    }

    //Check Empty UserID...
    if (data.hasOwnProperty('UserId') && validator.isEmpty(data.UserId + '') && data.UserId + '' <= 0) {
        errors.UserId = "my_account.err.fieldRequired";
    }

    return {
        errors,
        isValid: Object.keys(errors).length > 0 ? false : true
    };
}