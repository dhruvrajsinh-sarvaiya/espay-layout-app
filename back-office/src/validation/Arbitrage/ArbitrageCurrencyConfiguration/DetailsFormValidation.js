/**
 *   Developer : Parth Andhariya
 *   Date: 20-03-2019
 *   Component: Arbitrage Detail Form Validation
 */
import validator from "validator";
import { isScriptTag, isHtmlTag } from 'Helpers/helpers';

module.exports = function validateFormArbitrageCurrencyConfigurationForm(data) {
    let errors = {};
    // //Check Required Field...
    if (validator.isEmpty('' + data.addRecord.DeductionWalletTypeId)) {
        errors.DeductionWalletTypeId = "wallet.errRequired";
    }
    if (validator.isEmpty('' + data.addRecord.ChargeValue)) {
        errors.ChargeValue = "wallet.errRequired";
    }
    if (validator.isEmpty('' + data.addRecord.MakerCharge)) {
        errors.MakerCharge = "wallet.errRequired";
    }
    if (validator.isEmpty('' + data.addRecord.TakerCharge)) {
        errors.TakerCharge = "wallet.errRequired";
    }
    if (validator.isEmpty('' + data.addRecord.MinAmount)) {
        errors.MinAmount = "wallet.errRequired";
    }
    // else if (parseInt(data.addRecord.MinAmount) > parseInt(data.addRecord.MaxAmount)) {
    // errors.MinAmount = "wallet.errMax";
    // }
    if (validator.isEmpty('' + data.addRecord.MaxAmount)) {
        errors.MaxAmount = "wallet.errRequired";
    }
    if (validator.isEmpty('' + data.addRecord.Remarks.trim())) {
        errors.Remarks = "wallet.errRequired";
    } else if (isScriptTag('' + data.addRecord.Remarks)) {
        errors.Remarks = "my_account.err.scriptTag";
    } else if (isHtmlTag('' + data.addRecord.Remarks)) {
        errors.Remarks = "my_account.err.htmlTag";
    }

    return {
        errors,
        isValid: Object.keys(errors).length > 0 ? false : true
    };
};
