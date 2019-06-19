import validator from 'validator';
import { isScriptTag, isHtmlTag } from 'Helpers/helpers';

module.exports = function validateIPProfilingDashboard(data) {
    let errors = {};

    //Check Empty Start IP Profiling Dashboard...
    if (data.hasOwnProperty('StartIp') && validator.isEmpty(data.StartIp + '', { ignore_whitespace: true })) {
        errors.StartIp = "my_account.err.fieldRequired"
    } else if (data.hasOwnProperty('StartIp') && !validator.isEmpty(data.StartIp + '')) {
        if (isScriptTag(data.StartIp)) {
            errors.StartIp = "my_account.err.scriptTag";
        } else if (isHtmlTag(data.StartIp)) {
            errors.StartIp = "my_account.err.htmlTag";
        } else if (!validator.isIP(data.StartIp, 4)) {
            errors.StartIp = "my_account.err.validIPAddress";
        }
    }

    //Check Empty End IP Profiling Dashboard...
    if (data.hasOwnProperty('EndIp') && validator.isEmpty(data.EndIp + '', { ignore_whitespace: true })) {
        errors.EndIp = "my_account.err.fieldRequired"
    } else if (data.hasOwnProperty('EndIp') && !validator.isEmpty(data.EndIp + '')) {
        if (isScriptTag(data.EndIp)) {
            errors.EndIp = "my_account.err.scriptTag";
        } else if (isHtmlTag(data.EndIp)) {
            errors.EndIp = "my_account.err.htmlTag";
        } else if (!validator.isInt(data.EndIp, { no_symbols: true })) {
            errors.EndIp = "my_account.err.requireNumericField";
        }
    }

    return {
        errors,
        isValid: Object.keys(errors).length > 0 ? false : true
    };
};