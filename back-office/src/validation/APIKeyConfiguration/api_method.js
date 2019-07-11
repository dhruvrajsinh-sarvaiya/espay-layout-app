import validator from 'validator';
import { isScriptTag } from "Helpers/helpers";

module.exports = function validateServiceTypeForm(data) {
    let errors = {};

    //Check Empty MethodName...
    if (typeof (data.MethodName) !== 'undefined' && validator.isEmpty(data.MethodName)) {
        errors.MethodName = "my_account.err.fieldRequired";
    } else if (typeof (data.MethodName) !== 'undefined' && isScriptTag(data.MethodName)) {
        errors.MethodName = "my_account.err.scriptTag";
    }

    return {
        errors,
        isValid: Object.keys(errors).length > 0 ? false : true
    };
};