/* 
    Developer : Bharat Jograna
    Date : 28 March 2019
    File Comment : MyAccount affiliate scemetype Mapping Validation
*/
import validator from 'validator';
import { isScriptTag, isHtmlTag } from 'Helpers/helpers';

module.exports = function validateAffiliateSchemeTypeMapping(data) {
    let errors = {};

    //Check SchemeMasterId...
    if (data.hasOwnProperty('SchemeMasterId') && validator.isEmpty(data.SchemeMasterId + '')) {
        errors.SchemeMasterId = "my_account.err.fieldRequired";
    }

    // Check Empty SchemeTypeMasterId...
    if (data.hasOwnProperty('SchemeTypeMasterId') && validator.isEmpty(data.SchemeTypeMasterId + '')) {
        errors.SchemeTypeMasterId = "my_account.err.fieldRequired";
    }

    //Check Empty MinimumDepositionRequired...
    if (data.hasOwnProperty('MinimumDepositionRequired') && validator.isEmpty(data.MinimumDepositionRequired + '', { ignore_whitespace: true })) {
        errors.MinimumDepositionRequired = "my_account.err.fieldRequired"
    } else if (data.hasOwnProperty('MinimumDepositionRequired') && !validator.isEmpty(data.MinimumDepositionRequired + '')) {
        if (isScriptTag(data.MinimumDepositionRequired)) {
            errors.MinimumDepositionRequired = "my_account.err.scriptTag";
        } else if (isHtmlTag(data.MinimumDepositionRequired)) {
            errors.MinimumDepositionRequired = "my_account.err.htmlTag";
        } else if (!validator.isNumeric(data.MinimumDepositionRequired)) {
            errors.MinimumDepositionRequired = "my_account.err.fieldNum";
        } else if (data.MinimumDepositionRequired + '' <= 0) {
            errors.MinimumDepositionRequired = "my_account.err.requireGreterThanZero";
        }
    }

    // Check Empaty DepositWalletTypeId...
    if (data.hasOwnProperty('DepositWalletTypeId') && validator.isEmpty(data.DepositWalletTypeId + '', { ignore_whitespace: true })) {
        errors.DepositWalletTypeId = "my_account.err.fieldRequired";
    }

    // Check Empaty CommissionTypeInterval
    if (data.hasOwnProperty('CommissionTypeInterval') && validator.isEmpty(data.CommissionTypeInterval + '')) {
        errors.CommissionTypeInterval = "my_account.err.fieldRequired";
    }

    // Check Empty Description...
    if (data.hasOwnProperty('Description') && validator.isEmpty(data.Description + '', { ignore_whitespace: true })) {
        errors.Description = "my_account.err.fieldRequired"
    } else if (data.hasOwnProperty('Description') && !validator.isEmpty(data.Description + '')) {
        if (isScriptTag(data.Description)) {
            errors.Description = "my_account.err.scriptTag";
        } else if (isHtmlTag(data.Description)) {
            errors.Description = "my_account.err.htmlTag";
        }
    }

    // Check Empty CommissionHour
    if (data.hasOwnProperty('CommissionHour') && validator.isEmpty(data.CommissionHour + '')) {
        errors.CommissionHour = "my_account.err.fieldRequired";
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