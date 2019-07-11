/* 
    Developer : Bharat Jograna
    Date : 23 May 2019
    File Comment : MyAccount Referral Service Detail Validation
*/
import validator from 'validator';
import { isScriptTag, isHtmlTag } from 'Helpers/helpers';

module.exports = function validateReferralServiceDetail(data) {
    let errors = {};

    //Check SchemeTypeMappingId
    if (data.hasOwnProperty('SchemeTypeMappingId') && validator.isEmpty(data.SchemeTypeMappingId + '')) {
        errors.SchemeTypeMappingId = "my_account.err.fieldRequired";
    }

    //Check MaximumLevel
    if (data.hasOwnProperty('MaximumLevel') && validator.isEmpty(data.MaximumLevel + "", { ignore_whitespace: true })) {
        errors.MaximumLevel = "my_account.err.fieldRequired";
    } else if (data.hasOwnProperty('MaximumLevel') && !validator.isEmpty(data.MaximumLevel + "")) {
        if (isScriptTag(data.MaximumLevel)) {
            errors.MaximumLevel = "my_account.err.scriptTag";
        } else if (isHtmlTag(data.MaximumLevel)) {
            errors.MaximumLevel = "my_account.err.htmlTag";
        } else if (!validator.isDecimal(data.MaximumLevel + '', { no_symbols: true })) {
            errors.MaximumLevel = "my_account.err.requireDecimalField";
        } else if (data.MaximumLevel + '' < 0) {
            errors.MaximumLevel = "my_account.err.requireGreterThanZero";
        }
    }

    //Check MaximumCoin
    if (data.hasOwnProperty('MaximumCoin') && validator.isEmpty(data.MaximumCoin + "", { ignore_whitespace: true })) {
        errors.MaximumCoin = "my_account.err.fieldRequired";
    } else if (data.hasOwnProperty('MaximumCoin') && !validator.isEmpty(data.MaximumCoin + "")) {
        if (isScriptTag(data.MaximumCoin)) {
            errors.MaximumCoin = "my_account.err.scriptTag";
        } else if (isHtmlTag(data.MaximumCoin)) {
            errors.MaximumCoin = "my_account.err.htmlTag";
        } else if (!validator.isDecimal(data.MaximumCoin + '', { no_symbols: true })) {
            errors.MaximumCoin = "my_account.err.requireDecimalField";
        } else if (data.MaximumCoin + '' < 0) {
            errors.MaximumCoin = "my_account.err.requireGreterThanZero";
        }
    }

    //Check MinimumValue
    if (data.hasOwnProperty('MinimumValue') && validator.isEmpty(data.MinimumValue + "", { ignore_whitespace: true })) {
        errors.MinimumValue = "my_account.err.fieldRequired";
    } else if (data.hasOwnProperty('MinimumValue') && !validator.isEmpty(data.MinimumValue + "")) {
        if (isScriptTag(data.MinimumValue)) {
            errors.MinimumValue = "my_account.err.scriptTag";
        } else if (isHtmlTag(data.MinimumValue)) {
            errors.MinimumValue = "my_account.err.htmlTag";
        } else if (!validator.isDecimal(data.MinimumValue + '', { no_symbols: true })) {
            errors.MinimumValue = "my_account.err.requireDecimalField";
        } else if (data.MinimumValue + '' < 0) {
            errors.MinimumValue = "my_account.err.requireGreterThanZero";
        }
    }

    //Check MaximumValue
    if (data.hasOwnProperty('MaximumValue') && validator.isEmpty(data.MaximumValue + "", { ignore_whitespace: true })) {
        errors.MaximumValue = "my_account.err.fieldRequired";
    } else if (data.hasOwnProperty('MaximumValue') && !validator.isEmpty(data.MaximumValue + "")) {
        if (isScriptTag(data.MaximumValue)) {
            errors.MaximumValue = "my_account.err.scriptTag";
        } else if (isHtmlTag(data.MaximumValue)) {
            errors.MaximumValue = "my_account.err.htmlTag";
        } else if (!validator.isDecimal(data.MaximumValue + '', { no_symbols: true })) {
            errors.MaximumValue = "my_account.err.requireDecimalField";
        } else if (data.MaximumValue + '' < 0) {
            errors.MaximumValue = "my_account.err.requireGreterThanZero";
        }
    }

    //Check Empty CreditWalletTypeId...
    if (data.hasOwnProperty('CreditWalletTypeId') && validator.isEmpty(data.CreditWalletTypeId + '')) {
        errors.CreditWalletTypeId = "my_account.err.fieldRequired";
    }

    //Check Empty CommissionType...
    if (data.hasOwnProperty('CommissionType') && validator.isEmpty(data.CommissionType + '')) {
        errors.CommissionType = "my_account.err.fieldRequired";
    }

    //Check CommissionValue
    if (data.hasOwnProperty('CommissionValue') && validator.isEmpty(data.CommissionValue + "", { ignore_whitespace: true })) {
        errors.CommissionValue = "my_account.err.fieldRequired";
    } else if (data.hasOwnProperty('CommissionValue') && !validator.isEmpty(data.CommissionValue + "")) {
        if (isScriptTag(data.CommissionValue)) {
            errors.CommissionValue = "my_account.err.scriptTag";
        } else if (isHtmlTag(data.CommissionValue)) {
            errors.CommissionValue = "my_account.err.htmlTag";
        } else if (!validator.isDecimal(data.CommissionValue + '', { no_symbols: true })) {
            errors.CommissionValue = "my_account.err.requireDecimalField";
        } else if (data.CommissionValue + '' < 0) {
            errors.CommissionValue = "my_account.err.requireGreterThanZero";
        }
    }

    //Check Empty Status...
    if (data.hasOwnProperty('Status') && validator.isEmpty(data.Status + '')) {
        errors.Status = "my_account.err.fieldRequired";
    }

    return {
        errors,
        isValid: Object.keys(errors).length > 0 ? false : true
    };
};