/* 
    Developer : Nishant Vadgama
    File Comment : wallet block transaction type list request validator
    Date : 19-12-2018
*/

import validator from "validator";
import { isScriptTag,isHtmlTag } from 'Helpers/helpers';

module.exports = function validateWalletBlockTrnRequest(data) {
    let errors = {};

    //Check Required Field...
    if (validator.isEmpty(data.WalletId.trim() + "")) {
        errors.WalletId = "wallet.errRequired";
    }
    if (validator.isEmpty(data.WTrnTypeMasterID + "")) {
        errors.WTrnTypeMasterID = "wallet.errRequired";
    }
    if (isScriptTag(data.Remarks)) {
        errors.Remarks = "my_account.err.scriptTag";
    }   else if (isHtmlTag(data.Remarks)) {
        errors.Remarks = "my_account.err.htmlTag";
    }


    return {
        errors,
        isValid: Object.keys(errors).length > 0 ? false : true
    };
};
