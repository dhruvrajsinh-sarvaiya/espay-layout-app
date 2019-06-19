/**
 *   Developer : Parth Andhariya
 *   Date: 29-05-2019
 *   Component: Block Unblock User Address Form Validation
 */
import validator from "validator";
import { isScriptTag,isHtmlTag } from 'Helpers/helpers';
module.exports = function validateAddBlockUnblock(data) {
    let errors = {};
    // //Check Required Field...
    if (validator.isEmpty('' + data.AddAddress)) {
        errors.AddAddress = "wallet.errRequired";
    }
    if (validator.isEmpty('' + data.AddStatus)) {
        errors.AddStatus = "wallet.errRequired";
    }
    if (validator.isEmpty('' + data.AddRemarks)) {
        errors.AddRemarks = "wallet.errRequired";
    }    else if (isScriptTag('' + data.AddRemarks)) {
        errors.AddRemarks = "my_account.err.scriptTag";
    }
  else   if (isHtmlTag('' + data.AddRemarks)) {
        errors.AddRemarks = "my_account.err.htmlTag";
    }
    if (validator.isEmpty('' + data.WalletType)) {
        errors.WalletType = "wallet.errRequired";
    }
    return {
        errors,
        isValid: Object.keys(errors).length > 0 ? false : true
    };
};
