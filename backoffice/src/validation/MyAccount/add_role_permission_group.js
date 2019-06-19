/*
    Developer : Salim Deraiya
    Date : 22-02-2019
    Update by : 
    File Comment : Role Permissoin Group Validation
*/
import validator from 'validator';
import { isScriptTag, isHtmlTag, isAlphaNumWithSpace } from 'Helpers/helpers';

module.exports = function validateRolePermissionGroup(data, isEdit) {
    let errors = {};

    //Check Empty GroupName...
    if (data.hasOwnProperty('GroupName') && validator.isEmpty(data.GroupName + '', { ignore_whitespace: true })) {
        errors.GroupName = "my_account.err.fieldRequired"
    } else if (data.hasOwnProperty('GroupName') && !validator.isEmpty(data.GroupName + '')) {
        if (isScriptTag(data.GroupName)) {
            errors.GroupName = "my_account.err.scriptTag";
        } else if (isHtmlTag(data.GroupName)) {
            errors.GroupName = "my_account.err.htmlTag";
        } else if (!isAlphaNumWithSpace(data.GroupName)) {
            errors.GroupName = "my_account.err.fieldAlphaNum";
        }
    }

    //Check Empty Description...
    if (data.hasOwnProperty('Description') && validator.isEmpty(data.Description, { ignore_whitespace: true })) {
        errors.Description = "my_account.err.fieldRequired"
    } else if (data.hasOwnProperty('Description') && !validator.isEmpty(data.Description)) {
        if (isScriptTag(data.Description)) {
            errors.Description = "my_account.err.scriptTag";
        } else if (isHtmlTag(data.Description)) {
            errors.Description = "my_account.err.htmlTag";
        }
    }

    //Check Empty LinkedRoleId...
    if (isEdit) {
        if (data.hasOwnProperty('LinkedRoleId') && validator.isEmpty(data.LinkedRoleId + '', { ignore_whitespace: true })) {
            errors.LinkedRoleId = "my_account.err.fieldRequired"
        } else if (data.hasOwnProperty('LinkedRoleId') && !validator.isEmpty(data.LinkedRoleId + '')) {
            if (isScriptTag(data.LinkedRoleId)) {
                errors.LinkedRoleId = "my_account.err.scriptTag";
            } else if (isHtmlTag(data.LinkedRoleId)) {
                errors.LinkedRoleId = "my_account.err.htmlTag";
            } else if (data.hasOwnProperty('LinkedRoleId') && !validator.isNumeric(data.LinkedRoleId + '')) {
                errors.LinkedRoleId = "my_account.err.fieldRequired";
            } else if (data.hasOwnProperty('LinkedRoleId') && data.LinkedRoleId + '' <= 0) {
                errors.LinkedRoleId = "my_account.err.fieldRequired"
            }
        }
    }

    return {
        errors,
        isValid: Object.keys(errors).length > 0 ? false : true
    };
}