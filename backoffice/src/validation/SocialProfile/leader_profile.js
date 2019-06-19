/* 
    Developer : Kevin Ladani
    Date : 13-12-2018
    File Comment : Leader Profile Configuration Validation
*/
import validator from 'validator';
import { isScriptTag, isHtmlTag } from 'Helpers/helpers';

module.exports = function validateLeaderProfileForm(data) {
    let errors = {};

    //Check Empty Default_Visibility_of_Profile...
    if (typeof data.Default_Visibility_of_Profile !== 'undefined' && validator.isEmpty(data.Default_Visibility_of_Profile + '')) {
        errors.Default_Visibility_of_Profile = "my_account.err.fieldRequired";
    }

    //Check Empty Max_Number_Followers_can_Follow...
    if (data.hasOwnProperty('Max_Number_Followers_can_Follow') && validator.isEmpty(data.Max_Number_Followers_can_Follow + '', { ignore_whitespace: true })) {
        errors.Max_Number_Followers_can_Follow = "my_account.err.fieldRequired"
    } else if (data.hasOwnProperty('Max_Number_Followers_can_Follow') && !validator.isEmpty(data.Max_Number_Followers_can_Follow + '', { ignore_whitespace: true })) {
        if (isScriptTag(data.Max_Number_Followers_can_Follow)) {
            errors.Max_Number_Followers_can_Follow = "my_account.err.scriptTag";
        } else if (isHtmlTag(data.Max_Number_Followers_can_Follow)) {
            errors.Max_Number_Followers_can_Follow = "my_account.err.htmlTag";
        } else if (!validator.isNumeric(data.Max_Number_Followers_can_Follow + '', { no_symbols: true })) {
            errors.Max_Number_Followers_can_Follow = "my_account.err.requireNumericField";
        } else if (data.Max_Number_Followers_can_Follow <= 0) {
            errors.Max_Number_Followers_can_Follow = "my_account.err.requireGreterThanZero";
        }
    }

    //Check Empty Min_Number_of_Followers_can_Follow...
    if (data.hasOwnProperty('Min_Number_of_Followers_can_Follow') && validator.isEmpty(data.Min_Number_of_Followers_can_Follow + '', { ignore_whitespace: true })) {
        errors.Min_Number_of_Followers_can_Follow = "my_account.err.fieldRequired"
    } else if (data.hasOwnProperty('Min_Number_of_Followers_can_Follow') && !validator.isEmpty(data.Min_Number_of_Followers_can_Follow + '', { ignore_whitespace: true })) {
        if (isScriptTag(data.Min_Number_of_Followers_can_Follow)) {
            errors.Min_Number_of_Followers_can_Follow = "my_account.err.scriptTag";
        } else if (isHtmlTag(data.Min_Number_of_Followers_can_Follow)) {
            errors.Min_Number_of_Followers_can_Follow = "my_account.err.htmlTag";
        } else if (!validator.isNumeric(data.Min_Number_of_Followers_can_Follow + '', { no_symbols: true })) {
            errors.Min_Number_of_Followers_can_Follow = "my_account.err.requireNumericField";
        } else if (data.Min_Number_of_Followers_can_Follow <= 0) {
            errors.Min_Number_of_Followers_can_Follow = "my_account.err.requireGreterThanZero";
        }
    }

    return {
        errors,
        isValid: Object.keys(errors).length > 0 ? false : true
    };
};