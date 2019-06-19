import validator from 'validator';
import { isScriptTag, isHtmlTag, isAlphaNumWithSpace } from "Helpers/helpers";

module.exports = function validatePayTypeForm(data) {
    let errors = {};

    //Check Empty PayType...
    if (data.hasOwnProperty('PayTypeName') && validator.isEmpty(data.PayTypeName + '', { ignore_whitespace: true })) {
        errors.PayTypeName = "my_account.err.fieldRequired"
    } else if (data.hasOwnProperty('PayTypeName') && !validator.isEmpty(data.PayTypeName + '')) {
        if (isScriptTag(data.PayTypeName)) {
            errors.PayTypeName = "my_account.err.scriptTag";
        } else if (isHtmlTag(data.PayTypeName)) {
            errors.PayTypeName = "my_account.err.htmlTag";
        } else if (!isAlphaNumWithSpace(data.PayTypeName)) {
            errors.PayTypeName = "my_account.err.fieldAlphaNum";
        }
    }

    return {
        errors,
        isValid: Object.keys(errors).length > 0 ? false : true
    };
};