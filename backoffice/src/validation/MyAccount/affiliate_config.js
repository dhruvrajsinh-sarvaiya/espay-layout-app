/* 
    Developer : Salim Deraiya
    Date : 04-03-2019
    File Comment : MyAccount Affiliate Setup Configuration Validation
*/
import validator from 'validator';
import { isScriptTag } from 'Helpers/helpers';

module.exports = function validateRuleModule(data) {
    let errors = {};

    //Check Empty ModuleName...
    if (typeof (data.ModuleName) !== 'undefined' && validator.isEmpty(data.ModuleName+'')) {
        errors.ModuleName = "my_account.err.fieldRequired";
    } /* else if (typeof (data.ModuleName) !== 'undefined' && !validator.isAlphanumeric(data.ModuleName+'')) {
        errors.ModuleName = "my_account.err.scriptTag";
    } */ else if (typeof (data.ModuleName) !== 'undefined' && isScriptTag(data.ModuleName)) {
        errors.ModuleName = "my_account.err.scriptTag";
    }

    //Check Empty Status...
    if (typeof (data.Status) !== 'undefined' && validator.isEmpty(data.Status+'')) {
        errors.Status = "my_account.err.fieldRequired";
    } /* else if (typeof (data.Status) !== 'undefined' && !validator.isIn(data.Status+'',[0,1])) {
        errors.Status = "my_account.err.fieldRequired";
    }  */else if (typeof (data.Status) !== 'undefined' && isScriptTag(data.Status)) {
        errors.Status = "my_account.err.scriptTag";
    }

    return {
        errors,
        isValid: Object.keys(errors).length > 0 ? false : true
    };
};