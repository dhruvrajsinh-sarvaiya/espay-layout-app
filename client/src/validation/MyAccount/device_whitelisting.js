/** Author: Saloni Rathod
* Created on:08th APril 2019
*/
import validator from 'validator';
import { isScriptTag, isHtmlTag } from "Helpers/helpers";

module.exports = function validateDeviceWhitelistingReport(data) {
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
    if (data.hasOwnProperty('Device')) {
        if (typeof (data.Device) !== 'undefined' && isScriptTag(data.Device)) {
            errors.Device = "my_account.err.scriptTag";
        }
        else if (typeof (data.Device) !== 'undefined' && isHtmlTag(data.Device)) {
            errors.Device = "my_account.err.htmlTag";
        }
    }
    return {
        errors,
        isValid: Object.keys(errors).length > 0 ? false : true
    };
};