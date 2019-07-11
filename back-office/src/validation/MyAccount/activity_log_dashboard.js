/* 
    Updated by:Saloni Rathod(18/03/2019)
    File Comment : List Activity Log Dashboard Component
*/
import validator from 'validator';
import { isScriptTag, isHtmlTag } from 'Helpers/helpers';

module.exports = function validateActivityLogReport(data) {
    let errors = {}

    if (data.hasOwnProperty('UserName') && !validator.isEmpty(data.UserName + '')) {
        if (isScriptTag(data.UserName)) {
            errors.UserName = "my_account.err.scriptTag";
        } else if (isHtmlTag(data.UserName)) {
            errors.UserName = "my_account.err.htmlTag";
        }
    }

    if (typeof (data.IpAddress) !== 'undefined' && !validator.isEmpty(data.IpAddress)) {
        if (!validator.isIP(data.IpAddress, 4)) {
            errors.IpAddress = "my_account.err.validIPAddress";
        } else if (isScriptTag(data.IpAddress) || isHtmlTag(data.IpAddress)) {
            errors.IpAddress = "my_account.err.scriptTag";
        }
    }

    return {
        errors,
        isValid: Object.keys(errors).length > 0 ? false : true
    };
};