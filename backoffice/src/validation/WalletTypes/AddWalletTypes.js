import validator from "validator";
import { isScriptTag,isHtmlTag } from 'Helpers/helpers';

module.exports = function validateAddWalletTypeMasterRequest(data) {
    let errors = {};
    //Check Required Field...
    if (validator.isEmpty(data.addNewWalletTypeMasterDetail.WalletTypeName)) {
        errors.WalletTypeName = "wallet.errRequired";
    }
    if (validator.isEmpty(data.addNewWalletTypeMasterDetail.Description, { ignore_whitespace: true })) {
        errors.Description = "wallet.errRequired";
    } else if (isScriptTag(data.addNewWalletTypeMasterDetail.Description)) {
        errors.Description = "my_account.err.scriptTag";
    } else if (isHtmlTag(data.addNewWalletTypeMasterDetail.Description)) {
        errors.Description = "my_account.err.htmlTag";
    }
    return {
        errors,
        isValid: Object.keys(errors).length > 0 ? false : true
    };
};
