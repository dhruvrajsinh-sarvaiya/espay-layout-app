/* 
    Developer : Vishva Shah
    Date : 19-012-2019
    File Comment : Leverage Configuration validator
*/
import validator from "validator";

module.exports = function LeverageConfigtValidator(data) {
    let errors = {};
    
    if (validator.isEmpty(data.WalletTypeId + '')) {
        errors.WalletTypeId = "wallet.errRequired";
    }
    if (validator.isEmpty(data.LeveragePer + '')) {
        errors.LeveragePer = "wallet.errRequired";
    }
   
    if (validator.isEmpty(data.SafetyMarginPer + "")) {
        errors.SafetyMarginPer = "wallet.errRequired";
    }
    if (validator.isEmpty(data.MarginChargePer + "")) {
        errors.MarginChargePer = "wallet.errRequired";
    }
    if (validator.isEmpty(data.LeverageChargeDeductionType + "")) {
        errors.LeverageChargeDeductionType = "wallet.errRequired";
    }
    return {
        errors,
        isValid: Object.keys(errors).length > 0 ? false : true
    };
};
