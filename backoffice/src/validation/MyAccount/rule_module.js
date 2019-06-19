/* 
    Developer : Salim Deraiya
    Date : 20-02-2019
    File Comment : MyAccount Rule Module Validation
*/
import validator from 'validator';
import { isScriptTag, isHtmlTag, isAlphaNumWithSpace } from 'Helpers/helpers';

module.exports = function validateRuleModule(data) {
    let errors = {};

    //Check ParentID...
    if (data.hasOwnProperty('ParentID') && validator.isEmpty(data.ParentID + '')) {
        errors.ParentID = "my_account.err.fieldRequired";
    }

    //Check Empty ModuleName...
    if (data.hasOwnProperty('ModuleName') && validator.isEmpty(data.ModuleName + '', { ignore_whitespace: true })) {
        errors.ModuleName = "my_account.err.fieldRequired";
    } else if (data.hasOwnProperty('ModuleName') && !validator.isEmpty(data.ModuleName + '')) {
        if (isScriptTag(data.ModuleName)) {
            errors.ModuleName = "my_account.err.scriptTag";
        } else if (isHtmlTag(data.ModuleName)) {
            errors.ModuleName = "my_account.err.htmlTag";
        } else if (!isAlphaNumWithSpace(data.ModuleName)) {
            errors.ModuleName = "my_account.err.fieldAlphaNum";
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