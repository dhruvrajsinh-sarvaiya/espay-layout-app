import validator from 'validator';
import { isScriptTag } from "Helpers/helpers";

module.exports = function validateUpdateApplicationConfig(data) {
    let errors = {};

    //Application Name...
    if (validator.isEmpty(data.AppName.trim())) {
        errors.AppName = "my_account.err.fieldRequired";
    } else if (typeof (data.AppName) != 'undefined' && isScriptTag(data.AppName)) {
        errors.AppName = "my_account.err.scriptTag";
    }

    //DomainId...
    if (typeof (data.DomainId) != 'undefined' && validator.isEmpty(data.DomainId)) {
        errors.DomainId = "my_account.err.fieldRequired";
    }

    if (!validator.isEmpty(data.Description)) {
        if (typeof (data.Description) != 'undefined' && isScriptTag(data.Description)) {
            errors.Description = "my_account.err.scriptTag";
        }
    }

    if (!validator.isEmpty(data.ApplicationLogo)) {
        if (typeof (data.ApplicationLogo) != 'undefined' && isScriptTag(data.ApplicationLogo)) {
            errors.ApplicationLogo = "my_account.err.scriptTag";
        }
    }

    //AppId...
    if (typeof (data.AppId) !== 'undefined' && validator.isEmpty(data.AppId)) {
        errors.AppId = "my_account.err.fieldRequired";
    }

    if (!validator.isEmpty(data.AllowedCallBackURLS)) {
        if (typeof (data.AllowedCallBackURLS) != 'undefined' && isScriptTag(data.AllowedCallBackURLS)) {
            errors.AllowedCallBackURLS = "my_account.err.scriptTag";
        }
    }

    if (!validator.isEmpty(data.AllowedWebOrigins)) {
        if (typeof (data.AllowedWebOrigins) != 'undefined' && isScriptTag(data.AllowedWebOrigins)) {
            errors.AllowedWebOrigins = "my_account.err.scriptTag";
        }
    }

    if (!validator.isEmpty(data.AllowedLogoutURLS)) {
        if (typeof (data.AllowedLogoutURLS) != 'undefined' && isScriptTag(data.AllowedLogoutURLS)) {
            errors.AllowedLogoutURLS = "my_account.err.scriptTag";
        }
    }

    if (!validator.isEmpty(data.AllowedOriginsCORS)) {
        if (typeof (data.AllowedOriginsCORS) != 'undefined' && isScriptTag(data.AllowedOriginsCORS)) {
            errors.AllowedOriginsCORS = "my_account.err.scriptTag";
        }
    }

    if (!validator.isEmpty(data.JWTExpiration)) {
        if (typeof (data.JWTExpiration) != 'undefined' && isScriptTag(data.JWTExpiration)) {
            errors.JWTExpiration = "my_account.err.scriptTag";
        } else if (typeof (data.JWTExpiration) != 'undefined' && !validator.isNumeric(data.JWTExpiration, { no_symbols: true })) {
            errors.JWTExpiration = "my_account.err.fieldNum";
        }
    }

    return {
        errors,
        isValid: Object.keys(errors).length > 0 ? false : true
    };
};