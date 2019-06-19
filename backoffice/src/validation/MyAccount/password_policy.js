import validator from 'validator';
import { isScriptTag, isHtmlTag } from "Helpers/helpers";

module.exports = function validatePasswordPolicy(data) {
    let errors = {};

    //PwdExpiretime...
    if (data.hasOwnProperty('PwdExpiretime') && typeof data.PwdExpiretime + "" !== '' && validator.isEmpty(data.PwdExpiretime + "", { ignore_whitespace: true })) {
        errors.PwdExpiretime = "my_account.err.fieldRequired"
    } else if (data.hasOwnProperty('PwdExpiretime') && typeof data.PwdExpiretime + "" !== '' && !validator.isEmpty(data.PwdExpiretime + "")) {
        if (isScriptTag(data.PwdExpiretime)) {
            errors.PwdExpiretime = "my_account.err.scriptTag";
        } else if (isHtmlTag(data.PwdExpiretime)) {
            errors.PwdExpiretime = "my_account.err.htmlTag";
        } else if (!validator.isNumeric(data.PwdExpiretime + "", { no_symbols: true })) {
            errors.PwdExpiretime = "my_account.err.requireNumericField";
        }
    }

    //MaxfppwdDay...
    if (data.hasOwnProperty('MaxfppwdDay') && typeof data.MaxfppwdDay + "" !== '' && validator.isEmpty(data.MaxfppwdDay + "", { ignore_whitespace: true })) {
        errors.MaxfppwdDay = "my_account.err.fieldRequired"
    } else if (data.hasOwnProperty('MaxfppwdDay') && typeof data.MaxfppwdDay + "" !== '' && !validator.isEmpty(data.MaxfppwdDay + "")) {
        if (isScriptTag(data.MaxfppwdDay)) {
            errors.MaxfppwdDay = "my_account.err.scriptTag";
        } else if (isHtmlTag(data.MaxfppwdDay)) {
            errors.MaxfppwdDay = "my_account.err.htmlTag";
        } else if (!validator.isNumeric(data.MaxfppwdDay + "", { no_symbols: true })) {
            errors.MaxfppwdDay = "my_account.err.requireNumericField";
        }
    }

    //MaxfppwdMonth...
    if (data.hasOwnProperty('MaxfppwdMonth') && typeof data.MaxfppwdMonth + "" !== '' && validator.isEmpty(data.MaxfppwdMonth + "", { ignore_whitespace: true })) {
        errors.MaxfppwdMonth = "my_account.err.fieldRequired"
    } else if (data.hasOwnProperty('MaxfppwdMonth') && typeof data.MaxfppwdMonth + "" !== '' && !validator.isEmpty(data.MaxfppwdMonth + "")) {
        if (isScriptTag(data.MaxfppwdMonth)) {
            errors.MaxfppwdMonth = "my_account.err.scriptTag";
        } else if (isHtmlTag(data.MaxfppwdMonth)) {
            errors.MaxfppwdMonth = "my_account.err.htmlTag";
        } else if (!validator.isNumeric(data.MaxfppwdMonth + "", { no_symbols: true })) {
            errors.MaxfppwdMonth = "my_account.err.requireNumericField";
        }
    }

    //LinkExpiryTime...
    if (data.hasOwnProperty('LinkExpiryTime') && typeof data.LinkExpiryTime + "" !== '' && validator.isEmpty(data.LinkExpiryTime + "", { ignore_whitespace: true })) {
        errors.LinkExpiryTime = "my_account.err.fieldRequired"
    } else if (data.hasOwnProperty('LinkExpiryTime') && typeof data.LinkExpiryTime + "" !== '' && !validator.isEmpty(data.LinkExpiryTime + "")) {
        if (isScriptTag(data.LinkExpiryTime)) {
            errors.LinkExpiryTime = "my_account.err.scriptTag";
        } else if (isHtmlTag(data.LinkExpiryTime)) {
            errors.LinkExpiryTime = "my_account.err.htmlTag";
        } else if (!validator.isNumeric(data.LinkExpiryTime + "", { no_symbols: true })) {
            errors.LinkExpiryTime = "my_account.err.requireNumericField";
        }
    }

    //OTPExpiryTime...
    if (data.hasOwnProperty('OTPExpiryTime') && typeof data.OTPExpiryTime + "" !== '' && validator.isEmpty(data.OTPExpiryTime + "", { ignore_whitespace: true })) {
        errors.OTPExpiryTime = "my_account.err.fieldRequired"
    } else if (data.hasOwnProperty('OTPExpiryTime') && typeof data.OTPExpiryTime + "" !== '' && !validator.isEmpty(data.OTPExpiryTime + "")) {
        if (isScriptTag(data.OTPExpiryTime)) {
            errors.OTPExpiryTime = "my_account.err.scriptTag";
        } else if (isHtmlTag(data.OTPExpiryTime)) {
            errors.OTPExpiryTime = "my_account.err.htmlTag";
        } else if (!validator.isNumeric(data.OTPExpiryTime + "", { no_symbols: true })) {
            errors.OTPExpiryTime = "my_account.err.requireNumericField";
        }
    }

    return {
        errors,
        isValid: Object.keys(errors).length > 0 ? false : true
    };
};