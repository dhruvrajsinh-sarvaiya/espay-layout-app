import validator from 'validator';
import { isScriptTag, isHtmlTag, isAlphaWithSpace } from "Helpers/helpers";

module.exports = function validateSLAForm(data) {
    let errors = {};

    //Check Empty Priority...
    if (data.hasOwnProperty('Priority') && validator.isEmpty(data.Priority + '', { ignore_whitespace: true })) {
        errors.Priority = "my_account.err.fieldRequired"
    } else if (data.hasOwnProperty('Priority') && !validator.isEmpty(data.Priority + '')) {
        if (isScriptTag(data.Priority)) {
            errors.Priority = "my_account.err.scriptTag";
        } else if (isHtmlTag(data.Priority)) {
            errors.Priority = "my_account.err.htmlTag";
        } else if (!isAlphaWithSpace(data.Priority)) {
            errors.Priority = "my_account.err.fieldAlpha";
        }
    }

    //Check Empty PriorityTime...
    if (data.hasOwnProperty('PriorityTime') && validator.isEmpty(data.PriorityTime + '', { ignore_whitespace: true })) {
        errors.PriorityTime = "my_account.err.fieldRequired"
    } else if (data.hasOwnProperty('PriorityTime') && !validator.isEmpty(data.PriorityTime + '')) {
        if (isScriptTag(data.PriorityTime)) {
            errors.PriorityTime = "my_account.err.scriptTag";
        } else if (isHtmlTag(data.PriorityTime)) {
            errors.PriorityTime = "my_account.err.htmlTag";
        } else if (!validator.isInt(data.PriorityTime)) {
            errors.PriorityTime = "my_account.err.fieldNum";
        }
    }

    //Check Empty Timewith...
    if (data.hasOwnProperty('Timewith') && validator.isEmpty(data.Timewith)) {
        errors.Timewith = "my_account.err.fieldRequired";
    }

    return {
        errors,
        isValid: Object.keys(errors).length > 0 ? false : true
    };
};