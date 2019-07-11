/**
 *   Developer : Parth Andhariya
 *   Date: 11-06-2019
 *   Component: Conflict Recon Validation
 */
import validator from "validator";
module.exports = function validateForm(data) {
    let errors = {};
    // //Check Required Field...
    if (validator.isEmpty('' + data.ProviderBalance)) {
        errors.ProviderBalance = "wallet.errRequired";
    }
    if (validator.isEmpty('' + data.remarks)) {
        errors.remarks = "wallet.errRequired";
    }
    return {
        errors,
        isValid: Object.keys(errors).length > 0 ? false : true
    };
};
