/* 
    Developer : Salim Deraiya
    Date : 20-02-2019
    File Comment : MyAccount Rule Sub Module Validation
*/
import validator from 'validator';
import { isScriptTag, isHtmlTag, isAlphaNumWithSpace } from 'Helpers/helpers';

module.exports = function validateRuleSubModule(data) {
    let errors = {};

    //Check ParentID
    if (data.hasOwnProperty('ParentID') && validator.isEmpty(data.ParentID + '')) {
        errors.ParentID = "my_account.err.fieldRequired";
    }

    //Check Empty ModuleID...
    if (data.hasOwnProperty('ModuleID') && validator.isEmpty(data.ModuleID + '')) {
        errors.ModuleID = "my_account.err.fieldRequired";
    }

    //Check Empty SubModuleName...
    if (data.hasOwnProperty('SubModuleName') && validator.isEmpty(data.SubModuleName + '', { ignore_whitespace: true })) {
        errors.SubModuleName = "my_account.err.fieldRequired";
    } else if (data.hasOwnProperty('SubModuleName') && !validator.isEmpty(data.SubModuleName + '')) {
        if (isScriptTag(data.SubModuleName)) {
            errors.SubModuleName = "my_account.err.scriptTag";
        } else if (isHtmlTag(data.SubModuleName)) {
            errors.SubModuleName = "my_account.err.htmlTag";
        } else if (!isAlphaNumWithSpace(data.SubModuleName)) {
            errors.SubModuleName = "my_account.err.fieldAlphaNum";
        }
    }

    //Check Empty Status...
    if (data.hasOwnProperty('Status') && validator.isEmpty(data.Status + '')) {
        errors.Status = "my_account.err.fieldRequired";
    }

    return {
        errors,
        isValid: Object.keys(errors).length > 0 ? false : true
    };
};