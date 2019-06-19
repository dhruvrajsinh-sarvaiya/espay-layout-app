/**
 *   Developer : Parth Andhariya
 *   Date: 10-06-2019
 *   Component: Topup Request Form Validation
 */
import validator from "validator";

module.exports = function TopupRequestFormValidator(data) {
    let errors = {};

    // //Check Required Field...
    if (validator.isEmpty('' + data.WalletTypeName)) {
        errors.WalletTypeName = "wallet.errRequired";
    }
    if (validator.isEmpty('' + data.Amount)) {
        errors.Amount = "wallet.errRequired";
    }
    if (validator.isEmpty('' + data.address)) {
        errors.address = "wallet.errRequired";
    }
    if (validator.isEmpty('' + data.Toprovider)) {
        errors.Toprovider = "wallet.errRequired";
    } else if (data.Toprovider === data.FromProvider) {
        errors.Toprovider = "error.FromProviderToProvider";
    }
    if (validator.isEmpty('' + data.FromProvider)) {
        errors.FromProvider = "wallet.errRequired";
    } else if (data.FromProvider === data.Toprovider) {
        errors.Toprovider = "error.FromProviderToProvider";
    }
    return {
        errors,
        isValid: Object.keys(errors).length > 0 ? false : true
    };
};
