/**
 *   Developer : Parth Andhariya
 *   Date: 20-03-2019
 *   Component: Arbitrage fee Detail Form Validation
 */
import validator from "validator";
module.exports = function validateArbitrageFeeConfigurationForm(data) {
    let errors = {};
    // //Check Required Field...
    if (validator.isEmpty('' + data.addRecord.MarkupValue)) {
        errors.MarkupValue = "wallet.errRequired";
    }
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
    return {
        errors,
        isValid: Object.keys(errors).length > 0 ? false : true
    };
};
