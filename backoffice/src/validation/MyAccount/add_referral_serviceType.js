import validator from 'validator';
import { isScriptTag, isHtmlTag, isAlphaNumWithSpace } from "Helpers/helpers";

module.exports = function validateServiceTypeForm(data) {
    let errors = {};

    //Check Empty ServiceTypeName...
    if (data.hasOwnProperty('ServiceTypeName') && validator.isEmpty(data.ServiceTypeName + '', { ignore_whitespace: true })) {
        errors.ServiceTypeName = "my_account.err.fieldRequired"
    } else if (data.hasOwnProperty('ServiceTypeName') && !validator.isEmpty(data.ServiceTypeName + '')) {
        if (isScriptTag(data.ServiceTypeName)) {
            errors.ServiceTypeName = "my_account.err.scriptTag";
        } else if (isHtmlTag(data.ServiceTypeName)) {
            errors.ServiceTypeName = "my_account.err.htmlTag";
        } else if (!isAlphaNumWithSpace(data.ServiceTypeName)) {
            errors.ServiceTypeName = "my_account.err.fieldAlphaNum";
        }
    }

    return {
        errors,
        isValid: Object.keys(errors).length > 0 ? false : true
    };
};