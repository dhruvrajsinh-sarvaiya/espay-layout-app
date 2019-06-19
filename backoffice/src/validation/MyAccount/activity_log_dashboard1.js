import validator from 'validator';
import { isScriptTag } from 'Helpers/helpers';

module.exports = function validateActivityLogReport(data) {
    let errors = {}

    if (!validator.isEmpty(data.UserId)) {
        if (typeof (data.UserId) != 'undefined' && !validator.isNumeric(data.UserId, { no_symbols: true })) {
            errors.UserId = "my_account.err.fieldNum";
        } else if (typeof (data.UserId) !== 'undefined' && isScriptTag(data.UserId)) {
            errors.UserId = "my_account.err.scriptTag";
        }
    }

    if (!validator.isEmpty(data.IpAddress)) {
        if (typeof (data.IpAddress) != 'undefined' && !validator.isIP(data.IpAddress, 4)) {
            errors.IpAddress = "my_account.err.validIPAddress";
        } else if (typeof (data.IpAddress) !== 'undefined' && isScriptTag(data.IpAddress)) {
            errors.IpAddress = "my_account.err.scriptTag";
        }
    }

    if (!validator.isEmpty(data.IpAddress)) {
        if (typeof (data.IpAddress) != 'undefined' && !validator.isIP(data.IpAddress, 4)) {
            errors.IpAddress = "my_account.err.validIPAddress";
        } else if (typeof (data.IpAddress) !== 'undefined' && isScriptTag(data.IpAddress)) {
            errors.IpAddress = "my_account.err.scriptTag";
        }
    }

    if (!validator.isEmpty(data.DeviceId)) {
        if (typeof (data.DeviceId) !== 'undefined' && isScriptTag(data.DeviceId)) {
            errors.DeviceId = "my_account.err.scriptTag";
        }
    }

    if (!validator.isEmpty(data.ActivityAliasName)) {
        if (typeof (data.ActivityAliasName) !== 'undefined' && isScriptTag(data.ActivityAliasName)) {
            errors.ActivityAliasName = "my_account.err.scriptTag";
        }
    }

    return {
        errors,
        isValid: Object.keys(errors).length > 0 ? false : true
    };
};