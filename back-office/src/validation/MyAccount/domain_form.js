import validator from 'validator';
import { isScriptTag } from "Helpers/helpers";

module.exports = function validateDomain(data) {
    let errors = {};

    //AliasName...
    if (typeof (data.AliasName) != 'undefined' && validator.isEmpty(data.AliasName.trim())) {
        errors.AliasName = "my_account.err.fieldRequired";
    } else if (typeof (data.AliasName) != 'undefined' && isScriptTag(data.AliasName)) {
        errors.AliasName = "my_account.err.scriptTag";
    }

    //DomainName...
    if (typeof (data.AliasName) != 'undefined' && validator.isEmpty(data.DomainName.trim())) {
        errors.DomainName = "my_account.err.fieldRequired";
    } else if (typeof (data.DomainName) != 'undefined' && isScriptTag(data.DomainName)) {
        errors.DomainName = "my_account.err.scriptTag";
    }


    return {
        errors,
        isValid: Object.keys(errors).length > 0 ? false : true
    };
};