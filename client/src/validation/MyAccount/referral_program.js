import validator from 'validator';
import { isScriptTag, isHtmlTag } from "Helpers/helpers";

module.exports = function validateReferralProgram(data) {
    let errors = {};
    // Check empty Fromdate
    if (validator.isEmpty(data.FromDate)) {
        errors.FromDate = "my_account.err.fieldRequired";
    }
    //check empty todate
    if (validator.isEmpty(data.ToDate)) {
        errors.ToDate = "my_account.err.fieldRequired";
    }
    //Check Empty Device...
    if (data.hasOwnProperty('ReferUsername')) {
         if (typeof (data.ReferUsername) !== 'undefined' && isScriptTag(data.ReferUsername)) {
            errors.ReferUsername = "my_account.err.scriptTag";
        }
        else if (typeof (data.ReferUsername) !== 'undefined' && isHtmlTag(data.ReferUsername)) {
            errors.ReferUsername = "my_account.err.htmlTag" ;
        }
    }

    return {
        errors,
        isValid: Object.keys(errors).length > 0 ? false : true
    };
};