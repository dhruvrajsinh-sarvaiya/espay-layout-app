import validator from 'validator';
import { isScriptTag } from "Helpers/helpers";

module.exports = function validateApplicationConfig(data) {
    let errors = {};

    //Application Name...
    if (validator.isEmpty(data.AppName.trim())) {
        errors.AppName = "my_account.err.fieldRequired";
    } else if (typeof (data.AppName) !== 'undefined' && isScriptTag(data.AppName)) {
        errors.AppName = "my_account.err.scriptTag";
    }

    //DomainId...
    if (typeof (data.DomainId) !== 'undefined' && validator.isEmpty(data.DomainId)) {
        errors.DomainId = "my_account.err.fieldRequired";
    }

    //App ID
    if (typeof (data.AppId) !== 'undefined' && validator.isEmpty(data.AppId)) {
        errors.AppId = "my_account.err.fieldRequired";
    }


    return {
        errors,
        isValid: Object.keys(errors).length > 0 ? false : true
    };
};