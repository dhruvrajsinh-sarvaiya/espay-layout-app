import validator from "validator";
import { isScriptTag,isHtmlTag } from 'Helpers/helpers';
module.exports = function validateEditWalletTypeMasterRequest(data) {
    let errors = {};
    //Check Required Field...
    if (validator.isEmpty(data.editWalletTypeMastereDetail.CoinName)) {
        errors.CoinName = "wallet.errRequired";
    }

    if (validator.isEmpty(data.editWalletTypeMastereDetail.Description, { ignore_whitespace: true })) {
        errors.Description = "wallet.errRequired";
    } else if (isScriptTag(data.editWalletTypeMastereDetail.Description)) {
        errors.Description = "my_account.err.scriptTag";
    } else if (isHtmlTag(data.editWalletTypeMastereDetail.Description)) {
        errors.Description =  "my_account.err.htmlTag";
    }
    
    return {
        errors,
        isValid: Object.keys(errors).length > 0 ? false : true
    };
};
