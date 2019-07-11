/**
 *   Developer : Parth Andhariya
 *   Date: 20-03-2019
 *   Component: Deposition Interval Validation
 */
import validator from "validator";
module.exports = function validateForm(data) {
    let errors = {};
    // //Check Required Field...
    if (validator.isEmpty('' + data.addRecord.DepositHistoryFetchListInterval)) {
        errors.DepositHistoryFetchListInterval = "wallet.errRequired";
    }
    if (validator.isEmpty('' + data.addRecord.DepositStatusCheckInterval)) {
        errors.DepositStatusCheckInterval = "wallet.errRequired";
    }
    return {
        errors,
        isValid: Object.keys(errors).length > 0 ? false : true
    };
};
