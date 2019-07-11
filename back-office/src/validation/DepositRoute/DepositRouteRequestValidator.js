/* 
    Developer : Nishant Vadgam
    Date : 29-01-2019
    File Comment : Master staking request validator
*/
import validator from "validator";

/* validate master staking request */
module.exports = function DepositRouteRequestValidator(data) {
    let errors = {};
    // validate currency is empty
    if (validator.isEmpty(data.WalletTypeID + "")) {
        errors.WalletTypeID = "wallet.errRequired";
    }
    if (validator.isEmpty(data.SerProId + "")) {
        errors.SerProId = "wallet.errRequired";
    }
    if (validator.isEmpty(data.RecordCount + "")) {
        errors.RecordCount = "wallet.errRequired";
    }
    if (validator.isEmpty(data.Limit + "")) {
        errors.Limit = "wallet.errRequired";
    }
    if (validator.isEmpty(data.MaxLimit + "")) {
        errors.MaxLimit = "wallet.errRequired";
    }
    return {
        errors,
        isValid: Object.keys(errors).length > 0 ? false : true
    };
};
