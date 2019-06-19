/**
 * Updated by:Saloni Rathod(18/03/2019)
 * List Device WhiteListing
 */
import validator from 'validator';
import { isScriptTag, isHtmlTag } from 'Helpers/helpers';

module.exports = function validateDeviceWhiteListReport(data) {
    let errors = {}

    if (data.hasOwnProperty('UserName') && !validator.isEmpty(data.UserName + '', { ignore_whitespace: true })) {
        if (isScriptTag(data.UserName)) {
            errors.UserName = "my_account.err.scriptTag";
        } else if (isHtmlTag(data.UserName)) {
            errors.UserName = "my_account.err.htmlTag";
        }
    }

    if (data.hasOwnProperty('DeviceOS') && !validator.isEmpty(data.DeviceOS + '', { ignore_whitespace: true })) {
        if (isScriptTag(data.DeviceOS)) {
            errors.DeviceOS = "my_account.err.scriptTag";
        } else if (isHtmlTag(data.DeviceOS)) {
            errors.DeviceOS = "my_account.err.htmlTag";
        }
    }

    return {
        errors,
        isValid: Object.keys(errors).length > 0 ? false : true
    };
};