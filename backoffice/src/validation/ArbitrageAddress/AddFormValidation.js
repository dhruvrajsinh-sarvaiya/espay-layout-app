/* 
    Developer : Vishva shah
    File Comment : Arbitrage Address validation
    Date : 13-06-2019
*/

import validator from "validator";
import { isScriptTag,isHtmlTag } from 'Helpers/helpers';

module.exports = function AddFormValidation(data) {
    let errors = {};

    //Check Required Field...
    if (validator.isEmpty(data.WalletTypeId + "")) {
        errors.WalletTypeId = "wallet.errRequired";
    }
    if (validator.isEmpty(data.SerProId + "")) {
        errors.SerProId = "wallet.errRequired";
    }
    if (validator.isEmpty(data.Address + "")) {
        errors.Address = "wallet.errRequired";
    }
    if (isScriptTag(data.Address)) {
        errors.Address = "my_account.err.scriptTag";
    }   else if (isHtmlTag(data.Address)) {
        errors.Address = "my_account.err.htmlTag";
    }
    return {
        errors,
        isValid: Object.keys(errors).length > 0 ? false : true
    };
};
