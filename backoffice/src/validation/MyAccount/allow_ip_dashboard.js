import validator from 'validator';
import { isScriptTag, isHtmlTag, isAlphaWithSpace } from 'Helpers/helpers';

module.exports = function validateAllowIPDashboard(data) {
    let errors = {};

    //Check Empty aliasName...
    if (data.hasOwnProperty('IpAliasName') && validator.isEmpty(data.IpAliasName + '', { ignore_whitespace: true })) {
        errors.IpAliasName = "my_account.err.fieldRequired"
    } else if (data.hasOwnProperty('IpAliasName') && !validator.isEmpty(data.IpAliasName + '')) {
        if (isScriptTag(data.IpAliasName)) {
            errors.IpAliasName = "my_account.err.scriptTag";
        } else if (isHtmlTag(data.IpAliasName)) {
            errors.IpAliasName = "my_account.err.htmlTag";
        } else if (!isAlphaWithSpace(data.IpAliasName)) {
            errors.IpAliasName = "my_account.err.fieldAlpha";
        }
    }

    //Check Empty IP Address...
    if (data.hasOwnProperty('SelectedIPAddress') && validator.isEmpty(data.SelectedIPAddress + '', { ignore_whitespace: true })) {
        errors.SelectedIPAddress = "my_account.err.fieldRequired"
    } else if (data.hasOwnProperty('SelectedIPAddress') && !validator.isEmpty(data.SelectedIPAddress + '')) {
        if (isScriptTag(data.SelectedIPAddress)) {
            errors.SelectedIPAddress = "my_account.err.scriptTag";
        } else if (isHtmlTag(data.SelectedIPAddress)) {
            errors.SelectedIPAddress = "my_account.err.htmlTag";
        } else if (!validator.isIP(data.SelectedIPAddress, 4)) {
            errors.SelectedIPAddress = "my_account.err.validIPAddress";
        }
    }

    return {
        errors,
        isValid: Object.keys(errors).length > 0 ? false : true
    };
};