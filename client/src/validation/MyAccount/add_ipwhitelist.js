import validator from 'validator';
import { isAlphaWithSpace } from "Helpers/helpers";

module.exports = function validateAddIPWhiteList(data) {
    let errors = {};

    //Check Empty IP Address...
    if (typeof(data.SelectedIPAddress) != 'undefined' && validator.isEmpty(data.SelectedIPAddress, { ignore_whitespace: true })) {
        errors.SelectedIPAddress = "my_account.err.fieldRequired";
    } else if(typeof(data.SelectedIPAddress) != 'undefined' && !validator.isIP(data.SelectedIPAddress,4)) {
        errors.SelectedIPAddress = "my_account.err.validIPAddress";
    }

    //Check Empty Alias Name...
    if (typeof(data.IpAliasName) != 'undefined' && validator.isEmpty(data.IpAliasName, { ignore_whitespace: true })) {
        errors.IpAliasName = "my_account.err.fieldRequired";
    } else if (typeof(data.IpAliasName) != 'undefined' && !isAlphaWithSpace(data.IpAliasName)) {
        errors.IpAliasName = "my_account.err.fieldAlphaSpace";
    }

    return {
        errors,
        isValid: Object.keys(errors).length > 0 ? false : true
    };
};