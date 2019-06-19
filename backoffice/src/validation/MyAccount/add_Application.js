import validator from 'validator';
import { isScriptTag } from "Helpers/helpers";

module.exports = function validateApplication(data) {
    let errors = {};

    //Application Name...
    if (validator.isEmpty(data.ApplicationName.trim())) {
        errors.ApplicationName = "my_account.err.fieldRequired";
    } else if (typeof (data.ApplicationName) !== 'undefined' && isScriptTag(data.ApplicationName)) {
        errors.ApplicationName = "my_account.err.scriptTag";
    }

    //Description...
    if (validator.isEmpty(data.Description.trim())) {
        errors.Description = "my_account.err.fieldRequired";
    }else if (typeof (data.Description) !== 'undefined' && isScriptTag(data.Description)) {
        errors.Description = "my_account.err.scriptTag";
    }

    return {
        errors,
        isValid: Object.keys(errors).length > 0 ? false : true
    };
};