/* 
    Developer : Bharat Jograna
    Date : 20-02-2019
    File Comment : MyAccount affiliate scemetype Validation
*/
import validator from 'validator';
import { isScriptTag, isHtmlTag, isAlphaWithSpace } from 'Helpers/helpers';

module.exports = function validateRuleModule(data) {
    let errors = {};

    //Check Empty SchemeTypeName...
    if (data.hasOwnProperty('SchemeTypeName') && validator.isEmpty(data.SchemeTypeName + '', { ignore_whitespace: true })) {
        errors.SchemeTypeName = "my_account.err.fieldRequired"
    } else if (data.hasOwnProperty('SchemeTypeName') && !validator.isEmpty(data.SchemeTypeName + '')) {
        if (isScriptTag(data.SchemeTypeName)) {
            errors.SchemeTypeName = "my_account.err.scriptTag";
        } else if (isHtmlTag(data.SchemeTypeName)) {
            errors.SchemeTypeName = "my_account.err.htmlTag";
        } else if (!isAlphaWithSpace(data.SchemeTypeName)) {
            errors.SchemeTypeName = "my_account.err.fieldAlpha";
        }
    }

    //Check Empty Description...
    if (data.hasOwnProperty('Description') && validator.isEmpty(data.Description + '', { ignore_whitespace: true })) {
        errors.Description = "my_account.err.fieldRequired"
    } else if (data.hasOwnProperty('Description') && !validator.isEmpty(data.Description + '')) {
        if (isScriptTag(data.Description)) {
            errors.Description = "my_account.err.scriptTag";
        } else if (isHtmlTag(data.Description)) {
            errors.Description = "my_account.err.htmlTag";
        }
    }

    //Check Empty Status...
    if (typeof (data.Status) !== 'undefined' && validator.isEmpty(data.Status + '')) {
        errors.Status = "my_account.err.fieldRequired";
    }

    return {
        errors,
        isValid: Object.keys(errors).length > 0 ? false : true
    };
};