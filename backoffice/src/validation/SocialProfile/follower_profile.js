/* 
    Developer : Kevin Ladani
    Date : 13-12-2018
    File Comment : Leader Profile Configuration Validation
*/
import validator from 'validator';
import { isScriptTag, isHtmlTag } from 'Helpers/helpers';

module.exports = function validateFollowerProfileForm(data) {
    let errors = {};

    //Check Empty Can_Copy_Trade...
    if (typeof (data.Can_Copy_Trade) !== 'undefined' && validator.isEmpty(data.Can_Copy_Trade + '', { ignore_whitespace: false })) {
        errors.Can_Copy_Trade = "my_account.err.fieldRequired";
    }
    //Check Empty Can_Mirror_Trade...
    if (typeof (data.Can_Mirror_Trade) !== 'undefined' && validator.isEmpty(data.Can_Mirror_Trade + '', { ignore_whitespace: false })) {
        errors.Can_Mirror_Trade = "my_account.err.fieldRequired";
    }

    //Check Empty Can_Add_Leader_to_Watchlist...
    if (typeof data.Can_Add_Leader_to_Watchlist !== 'undefined' && validator.isEmpty(data.Can_Add_Leader_to_Watchlist + '', { ignore_whitespace: true })) {
        errors.Can_Add_Leader_to_Watchlist = "my_account.err.fieldRequired";
    }

    //Check Empty Maximum_Number_of_Leaders_to_Allow_Follow...
    if (data.hasOwnProperty('Maximum_Number_of_Leaders_to_Allow_Follow') && validator.isEmpty(data.Maximum_Number_of_Leaders_to_Allow_Follow + '', { ignore_whitespace: true })) {
        errors.Maximum_Number_of_Leaders_to_Allow_Follow = "my_account.err.fieldRequired"
    } else if (data.hasOwnProperty('Maximum_Number_of_Leaders_to_Allow_Follow') && !validator.isEmpty(data.Maximum_Number_of_Leaders_to_Allow_Follow + '', { ignore_whitespace: true })) {
        if (isScriptTag(data.Maximum_Number_of_Leaders_to_Allow_Follow)) {
            errors.Maximum_Number_of_Leaders_to_Allow_Follow = "my_account.err.scriptTag";
        } else if (isHtmlTag(data.Maximum_Number_of_Leaders_to_Allow_Follow)) {
            errors.Maximum_Number_of_Leaders_to_Allow_Follow = "my_account.err.htmlTag";
        } else if (!validator.isNumeric(data.Maximum_Number_of_Leaders_to_Allow_Follow + '', { no_symbols: true })) {
            errors.Maximum_Number_of_Leaders_to_Allow_Follow = "my_account.err.requireNumericField";
        } else if (data.Maximum_Number_of_Leaders_to_Allow_Follow <= 0) {
            errors.Maximum_Number_of_Leaders_to_Allow_Follow = "my_account.err.requireGreterThanZero";
        }
    }

    //Check Empty Max_Number_of_Leader_to_Allow_in_Watchlist...
    if (data.hasOwnProperty('Max_Number_of_Leader_to_Allow_in_Watchlist') && validator.isEmpty(data.Max_Number_of_Leader_to_Allow_in_Watchlist + '', { ignore_whitespace: true })) {
        errors.Max_Number_of_Leader_to_Allow_in_Watchlist = "my_account.err.fieldRequired"
    } else if (data.hasOwnProperty('Max_Number_of_Leader_to_Allow_in_Watchlist') && !validator.isEmpty(data.Max_Number_of_Leader_to_Allow_in_Watchlist + '', { ignore_whitespace: true })) {
        if (isScriptTag(data.Max_Number_of_Leader_to_Allow_in_Watchlist)) {
            errors.Max_Number_of_Leader_to_Allow_in_Watchlist = "my_account.err.scriptTag";
        } else if (isHtmlTag(data.Max_Number_of_Leader_to_Allow_in_Watchlist)) {
            errors.Max_Number_of_Leader_to_Allow_in_Watchlist = "my_account.err.htmlTag";
        } else if (!validator.isNumeric(data.Max_Number_of_Leader_to_Allow_in_Watchlist + '', { no_symbols: true })) {
            errors.Max_Number_of_Leader_to_Allow_in_Watchlist = "my_account.err.requireNumericField";
        } else if (data.Max_Number_of_Leader_to_Allow_in_Watchlist <= 0) {
            errors.Max_Number_of_Leader_to_Allow_in_Watchlist = "my_account.err.requireGreterThanZero";
        }
    }

    return {
        errors,
        isValid: Object.keys(errors).length > 0 ? false : true
    };
};