/**
 * Create BY Sanjay 
 * Created Date 25/03/2019
 * Validate Service Provider
 */

import validator from 'validator';
import { isScriptTag } from "Helpers/helpers";

module.exports = function validateServiceProvider(data) {
    let errors = {};

    //Check Empty ProviderName...
    if (typeof (data.ProviderName) !== 'undefined' && validator.isEmpty(data.ProviderName)) {
        errors.ProviderName = "my_account.err.fieldRequired";
    } else if (typeof (data.ProviderName) !== 'undefined' && isScriptTag(data.ProviderName)) {
        errors.ProviderName = "my_account.err.scriptTag";
    }

    return {
        errors,
        isValid: Object.keys(errors).length > 0 ? false : true
    };
};