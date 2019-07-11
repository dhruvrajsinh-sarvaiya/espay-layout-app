/* 
    Developer : Saloni Rathod
    Date : 27th May 2019
    Updated By :
    File Comment : MyAccount Add/Edit Referral Scheme type Component
*/
import validator from 'validator';
import { isScriptTag, isHtmlTag} from 'Helpers/helpers';

module.exports = function validateReferraSchemeTypeMapping(data) {
    let errors = {};

    //Check ServiceTypeMstId
    if (data.hasOwnProperty('ServiceTypeMstId') && validator.isEmpty(data.ServiceTypeMstId + '')) {
        errors.ServiceTypeMstId = "my_account.err.fieldRequired";
    }
    //Check PayTypeId
    if (data.hasOwnProperty('PayTypeId') && validator.isEmpty(data.PayTypeId + '')) {
        errors.PayTypeId = "my_account.err.fieldRequired";
    }

    //Check MinimumDepositionRequired
    if (data.hasOwnProperty('MinimumDepositionRequired') && validator.isEmpty(data.MinimumDepositionRequired + "", { ignore_whitespace: true })) {
        errors.MinimumDepositionRequired = "my_account.err.fieldRequired";
    } else if (data.hasOwnProperty('MinimumDepositionRequired') && !validator.isEmpty(data.MinimumDepositionRequired + "")) {
        if (isScriptTag(data.MinimumDepositionRequired)) {
            errors.MinimumDepositionRequired = "my_account.err.scriptTag";
        } else if (isHtmlTag(data.MinimumDepositionRequired)) {
            errors.MinimumDepositionRequired = "my_account.err.htmlTag";
        } else if (!validator.isNumeric(data.MinimumDepositionRequired + '', { no_symbols: true })) {
            errors.MinimumDepositionRequired = "my_account.err.requireNumericField";
        } else if (!data.MinimumDepositionRequired + '' >= 0) {
            errors.MinimumDepositionRequired = "my_account.err.requireGreterThanZeroOrEqualToZero";
        }
    }

    //Check Description
    if (data.hasOwnProperty('Description') && validator.isEmpty(data.Description + "", { ignore_whitespace: true })) {
        errors.Description = "my_account.err.fieldRequired";
    } else if (data.hasOwnProperty('Description') && !validator.isEmpty(data.Description + "")) {
        if (isScriptTag(data.Description)) {
            errors.Description = "my_account.err.scriptTag";
        } else if (isHtmlTag(data.Description)) {
            errors.Description = "my_account.err.htmlTag";
         } else if (data.Description + '' <= 0) {
            errors.Description = "my_account.err.requireGreterThanZero";
        }
    }
    if (data.hasOwnProperty('FromDate') && validator.isEmpty(data.FromDate)) {
        errors.FromDate = "my_account.err.fieldRequired";
    }

    if (data.hasOwnProperty('ToDate') && validator.isEmpty(data.ToDate)) {
        errors.ToDate = "my_account.err.fieldRequired";
    }
    return {
        errors,
        isValid: Object.keys(errors).length > 0 ? false : true
    };
};