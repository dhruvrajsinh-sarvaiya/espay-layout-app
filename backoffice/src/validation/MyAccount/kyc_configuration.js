import validator from 'validator';
import { isAlphaWithSpace, isScriptTag } from 'Helpers/helpers';

module.exports = function kycConfiguration(data) { 
    let errors = {};

    //Check Empty Document Type...
    if (data.hasOwnProperty('Name') && validator.isEmpty(data.Name,{ ignore_whitespace : true })) {
        errors.Name = "my_account.err.fieldRequired";
    } else if (data.hasOwnProperty('Name') && !isAlphaWithSpace(data.Name)) {
        errors.Name = "my_account.err.fieldAlpha";
    } else if (data.hasOwnProperty('Name') && isScriptTag(data.Name)) {
        errors.Name = "my_account.err.scriptTag";
    }

    return {
        errors,
        isValid: Object.keys(errors).length > 0 ? false : true
    };
};