import validator from 'validator';
import { isScriptTag, isHtmlTag } from "Helpers/helpers";

module.exports = function validateIpWhitelistingReport(data) {
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
    if (data.hasOwnProperty('IPAddress')) {
        if (typeof (data.IPAddress) !== 'undefined' && isScriptTag(data.IPAddress)) {
            errors.IPAddress = "my_account.err.scriptTag";
        } else  if (typeof (data.IPAddress) !== 'undefined' && isHtmlTag(data.IPAddress)) {
            errors.IPAddress = "my_account.err.htmlTag";
        } 
        else if (typeof (data.IPAddress) !== 'undefined' && !validator.isEmpty(data.IPAddress) && !validator.isIP(data.IPAddress)) {
            errors.IPAddress = "my_account.err.validIPAddress";
        }
    }

    return {
        errors,
        isValid: Object.keys(errors).length > 0 ? false : true
    };
};