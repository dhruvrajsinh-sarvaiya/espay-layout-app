/**
 * Auther : Saloni Rathod
 * Created : 05th APril 2019
 * Complain Report
 */
import validator from 'validator';
import { isScriptTag, isHtmlTag } from "Helpers/helpers";

module.exports = function validateComplainReport(data) {
    let errors = {};
    // Check empty Fromdate
    if (validator.isEmpty(data.FromDate)) {
        errors.FromDate = "my_account.err.fieldRequired";
    }
    //check empty todate
    if (validator.isEmpty(data.ToDate)) {
        errors.ToDate = "my_account.err.fieldRequired";
    }
    //Check Empty Subject...
    if (data.hasOwnProperty('Subject') && !validator.isEmpty(data.Subject)) {
        if (typeof (data.Subject) !== 'undefined' && isScriptTag(data.Subject)) {
            errors.Subject = "my_account.err.scriptTag";
        }
        else if (typeof (data.Subject) !== 'undefined' && isHtmlTag(data.Subject)) {
            errors.Subject = "my_account.err.htmlTag";
        }
        else if (typeof (data.Subject) !== 'undefined' && !validator.isAlphanumeric(data.Subject)) {
            errors.Subject = "my_account.err.fieldAlphaNum";
        }
    }


    return {
        errors,
        isValid: Object.keys(errors).length > 0 ? false : true
    };
};