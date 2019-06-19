/* 
    Developer : Saloni Rathod
    Date : 26-02-2019
    File Comment : MyAccount Rule Field Validation
*/
import validator from 'validator';
import { isScriptTag, isHtmlTag, isAlphaNumWithSpace } from 'Helpers/helpers';

module.exports = function validateRuleField(data) {
    let errors = {};

    //Check Empty FieldName...
    if (data.hasOwnProperty('FieldName') && validator.isEmpty(data.FieldName + '', { ignore_whitespace: true })) {
        errors.FieldName = "my_account.err.fieldRequired"
    } else if (data.hasOwnProperty('FieldName') && !validator.isEmpty(data.FieldName + '')) {
        if (isScriptTag(data.FieldName)) {
            errors.FieldName = "my_account.err.scriptTag";
        } else if (isHtmlTag(data.FieldName)) {
            errors.FieldName = "my_account.err.htmlTag";
        } else if (!isAlphaNumWithSpace(data.FieldName)) {
            errors.FieldName = "my_account.err.fieldAlphaNum";
        } else if (!validator.isLength(data.FieldName, { min: 2, max: 30 })) {
            errors.FieldName = "my_account.err.length2To30";
        }
    }

    //Check Empty SubModuleID...
    if (data.hasOwnProperty('SubModuleID') && validator.isEmpty(data.SubModuleID + '', { ignore_whitespace: true })) {
        errors.SubModuleID = "my_account.err.fieldRequired";
    } else if (data.hasOwnProperty('SubModuleID') && data.SubModuleID + '' <= 0) {
        errors.SubModuleID = "my_account.err.fieldRequired";
    }

    //Check Empty Status...
    if (data.hasOwnProperty('Status') && validator.isEmpty(data.Status + '', { ignore_whitespace: true })) {
        errors.Status = "my_account.err.fieldRequired";
    }

    //Check Empty Visibility...
    if (data.hasOwnProperty('Visibility') && validator.isEmpty(data.Visibility + '', { ignore_whitespace: true })) {
        errors.Visibility = "my_account.err.fieldRequired";
    } else if (data.hasOwnProperty('Visibility') && data.Visibility + '' <= 0) {
        errors.Visibility = "my_account.err.fieldRequired";
    }

    return {
        errors,
        isValid: Object.keys(errors).length > 0 ? false : true
    };
};