/**
 * Author : Saloni Rathod
 * Created : 27/03/2019
 * Affiliate Validation Report 
 */
import validator from 'validator';
import { isScriptTag, isHtmlTag } from 'Helpers/helpers';

module.exports = function validateAffiliateSchemeDetail(data) {
    let errors = {};

    //Check MiimumValue...
    if (data.hasOwnProperty('MinimumValue') && validator.isEmpty(data.MinimumValue + '', { ignore_whitespace: true })) {
        errors.MinimumValue = "my_account.err.fieldRequired"
    } else if (data.hasOwnProperty('MinimumValue') && !validator.isEmpty(data.MinimumValue + '')) {
        if (isScriptTag(data.MinimumValue)) {
            errors.MinimumValue = "my_account.err.scriptTag";
        } else if (isHtmlTag(data.MinimumValue)) {
            errors.MinimumValue = "my_account.err.htmlTag";
        } else if (!validator.isNumeric(data.MinimumValue, { no_symbols: true })) {
            errors.MinimumValue = "my_account.err.requireNumericField";
        } else if (data.MinimumValue + '' <= 0) {
            errors.MinimumValue = "my_account.err.requireGreterThanZero";
        }
    }

    //Check  MaximumValue...
    if (data.hasOwnProperty('MaximumValue') && validator.isEmpty(data.MaximumValue + '', { ignore_whitespace: true })) {
        errors.MaximumValue = "my_account.err.fieldRequired"
    } else if (data.hasOwnProperty('MaximumValue') && !validator.isEmpty(data.MaximumValue + '')) {
        if (isScriptTag(data.MaximumValue)) {
            errors.MaximumValue = "my_account.err.scriptTag";
        } else if (isHtmlTag(data.MaximumValue)) {
            errors.MaximumValue = "my_account.err.htmlTag";
        } else if (!validator.isNumeric(data.MaximumValue, { no_symbols: true })) {
            errors.MaximumValue = "my_account.err.requireNumericField";
        } else if (data.MaximumValue + '' <= 0) {
            errors.MaximumValue = "my_account.err.requireGreterThanZero";
        }
    }

    //Check Empty Level...
    if (data.hasOwnProperty('Level') && validator.isEmpty(data.Level + '', { ignore_whitespace: true })) {
        errors.Level = "my_account.err.fieldRequired"
    } else if (data.hasOwnProperty('Level') && !validator.isEmpty(data.Level + '')) {
        if (isScriptTag(data.Level)) {
            errors.Level = "my_account.err.scriptTag";
        } else if (isHtmlTag(data.Level)) {
            errors.Level = "my_account.err.htmlTag";
        } else if (!validator.matches(data.Level + '', '^[0-9]*$') || !validator.isLength(data.Level + '', { min: 1, max: 3 })) {
            errors.Level = "my_account.err.level";
        }
    }

    //Check SchemeMappingId...
    if (validator.isEmpty(data.SchemeMappingId + '')) {
        errors.SchemeMappingId = "my_account.err.fieldRequired";
    }

    //Check  CommissionValue...
    if (data.hasOwnProperty('CommissionValue') && validator.isEmpty(data.CommissionValue + '', { ignore_whitespace: true })) {
        errors.CommissionValue = "my_account.err.fieldRequired"
    } else if (data.hasOwnProperty('CommissionValue') && !validator.isEmpty(data.CommissionValue + '')) {
        if (isScriptTag(data.CommissionValue)) {
            errors.CommissionValue = "my_account.err.scriptTag";
        } else if (isHtmlTag(data.CommissionValue)) {
            errors.CommissionValue = "my_account.err.htmlTag";
        } else if (!validator.isInt(data.CommissionValue, { no_symbols: true })) {
            errors.CommissionValue = "my_account.err.requireNumericField";
        } else if (data.CommissionValue + '' <= 0) {
            errors.CommissionValue = "my_account.err.requireGreterThanZero";
        }
    }

    //Check CreditWalletTypeId...
    if (validator.isEmpty(data.CreditWalletTypeId + '')) {
        errors.CreditWalletTypeId = "my_account.err.fieldRequired";
    }

    //Check TrnWalletTypeId...
    if (validator.isEmpty(data.TrnWalletTypeId + '')) {
        errors.TrnWalletTypeId = "my_account.err.fieldRequired";
    }

    //Check DistributionType...
    if (validator.isEmpty(data.DistributionType + '')) {
        errors.DistributionType = "my_account.err.fieldRequired";
    }

    //Check CommissionType...
    if (validator.isEmpty(data.CommissionType + '')) {
        errors.CommissionType = "my_account.err.fieldRequired";
    }

    //Check Status
    if (validator.isEmpty(data.Status + '')) {
        errors.Status = "my_account.err.fieldRequired";
    }

    return {
        errors,
        isValid: Object.keys(errors).length > 0 ? false : true
    };
};