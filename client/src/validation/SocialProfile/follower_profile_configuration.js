/* 
    Developer : Kevin Ladani
    Date : 13-12-2018
    UpdatedBy : Salim Deraiya 26-12-2018
    File Comment : Follower Profile Configuration Validation
*/

import validator from 'validator';
import { isScriptTag, isHtmlTag } from "Helpers/helpers";
module.exports = function validateFollowerProfileConfigForm(data) {
    let errors = {};

    //Check Empty Trade_Type...
    if (typeof data.Trade_Type !== 'undefined' && validator.isEmpty(data.Trade_Type)) {
        errors.Trade_Type = "my_account.err.fieldRequired";
    }

    //Check Empty Trade_Percentage...
    if (typeof data.Trade_Type !== 'undefined' && data.Trade_Type === '1') {
        if (typeof data.Trade_Percentage !== 'undefined' && validator.isEmpty(data.Trade_Percentage+'',{ ignore_whitespace : true})) {
            errors.Trade_Percentage = "my_account.err.fieldRequired";
        } 
        if (typeof (data.Trade_Percentage) !== 'undefined' && isScriptTag(data.Trade_Percentage)) {
            errors.Trade_Percentage = "my_account.err.scriptTag";
        }
        else if (typeof (data.Trade_Percentage) !== 'undefined' && isHtmlTag(data.Trade_Percentage)) {
            errors.Trade_Percentage = "my_account.err.htmlTag";
        }else if (typeof data.Trade_Percentage !== 'undefined' && !validator.isDecimal(data.Trade_Percentage+'')) {
            errors.Trade_Percentage = "my_account.err.requireDecimalField";
        } else if(parseFloat(data.Trade_Percentage) >= 100) {
            errors.Trade_Percentage = "my_account.err.validTradeLimit";
        } else if(parseFloat(data.Trade_Percentage) <= 0) {
            errors.Trade_Percentage = "my_account.err.validTradeLimit";
        }
    }
    if (typeof (data.Trade_Percentage) !== 'undefined' && isScriptTag(data.Trade_Percentage)) {
        errors.Trade_Percentage = "my_account.err.scriptTag";
    }
    else if (typeof (data.Trade_Percentage) !== 'undefined' && isHtmlTag(data.Trade_Percentage)) {
        errors.Trade_Percentage = "my_account.err.htmlTag";
    }
    return {
        errors,
        isValid: Object.keys(errors).length > 0 ? false : true
    };
};