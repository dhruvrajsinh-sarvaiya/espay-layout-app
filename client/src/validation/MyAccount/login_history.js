/**
 * Auther : Saloni Rathod
 * Created : 05th APril 2019
 * Login History Report
 */
import validator from 'validator';
import { isScriptTag, isHtmlTag } from "Helpers/helpers";

module.exports = function validateLoginHistoryReport(data) {
    let errors = {};
    // Check empty Fromdate
    if (validator.isEmpty(data.FromDate)) {
        errors.FromDate = "my_account.err.fieldRequired";
    }
    //check empty todate
    if (validator.isEmpty(data.ToDate)) {
        errors.ToDate = "my_account.err.fieldRequired";
    }
    //Check Empty Ipaddress...
    if (data.hasOwnProperty('IPAddress')) {
         if (typeof (data.IPAddress) !== 'undefined' && isScriptTag(data.IPAddress)) {
            errors.IPAddress = "my_account.err.scriptTag";
        }
      else  if (typeof (data.IPAddress) !== 'undefined' && isHtmlTag(data.IPAddress)) {
            errors.IPAddress = "my_account.err.htmlTag";
        }
        else if (typeof (data.IPAddress) !== 'undefined' && !validator.isEmpty(data.IPAddress) && !validator.isIP(data.IPAddress)) {
            errors.IPAddress = "my_account.err.validIPAddress";
        }
    }
    //Check Empty Device...
    if (data.hasOwnProperty('Device')) {
        if (typeof (data.Device) !== 'undefined' && isScriptTag(data.Device)) {
            errors.Device = "my_account.err.scriptTag";
        }
        else if (typeof (data.Device) !== 'undefined' && isHtmlTag(data.Device)) {
            errors.Device = "my_account.err.htmlTag";
        }

    }
    //Check Empty Location...
    if (data.hasOwnProperty('Location')) {
        if (typeof (data.Location) !== 'undefined' && isScriptTag(data.Location)) {
            errors.Location = "my_account.err.scriptTag";
        }
        else if (typeof (data.Location) !== 'undefined' && isHtmlTag(data.Location)) {
            errors.Location = "my_account.err.htmlTag";
        }
    }
    return {
        errors,
        isValid: Object.keys(errors).length > 0 ? false : true
    };
};