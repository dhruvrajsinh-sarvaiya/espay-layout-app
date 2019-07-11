/**
 *   Developer : Parth Andhariya
 *   Date: 07-06-2019
 *   Component: Arbitrage Master Form Validation
 */
import validator from "validator";
import { isScriptTag, isHtmlTag } from 'Helpers/helpers';

module.exports = function validateFormMasterArbitrageCurrencyConfigurationForm(data) {
    let errors = {};
    //Check Required Field...
    if (validator.isEmpty('' + data.addRecord.WalletTypeId)) {
        errors.WalletTypeId = "wallet.errRequired";
    }
    if (validator.isEmpty('' + data.addRecord.TrnType)) {
        errors.TrnType = "wallet.errRequired";
    }
    if (validator.isEmpty('' + data.addRecord.Remarks.trim())) {
        errors.Remarks = "wallet.errRequired";
    } else if (isScriptTag('' + data.addRecord.Remarks)) {
        errors.Remarks = "my_account.err.scriptTag";
    }
    else if (isHtmlTag('' + data.addRecord.Remarks)) {
        errors.Remarks = "my_account.err.htmlTag";
    }
    return {
        errors,
        isValid: Object.keys(errors).length > 0 ? false : true
    };
};
