/* 
    Developer : Nishant Vadgam
    Date : 02-10-2018
    File Comment : Add new limit & fee pattern deposit tab validator
*/

import validator from 'validator';

module.exports = function validateWithdrawTab(data) {
    let withdrawErrors = {};
    let limitsError = [];
    let feesError = [];
    let limitsflag = false;
    let feesflag = false;

    //Check Main Form details...
    if (validator.isEmpty(data.withdrawFeeType)) {
        withdrawErrors.withdrawFeeType = "wallet.errFeeType";
    }
    if (validator.isEmpty(data.withdrawFeeRange)) {
        withdrawErrors.withdrawFeeRange = "wallet.errFeeRange";
    }

    if (data.withdrawFeeRange == 'No') {
        if (validator.isEmpty(data.withdrawFeeAmount)) {
            withdrawErrors.withdrawFeeAmount = "wallet.errFeeAmount";
        } else if (data.withdrawFeeAmount == "0") {
            withdrawErrors.withdrawFeeAmount = "wallet.errInvalidFeeAmount";
        }
    } else if (data.withdrawFeeRange == 'Yes') {
        //fees
        data.fees.forEach((fee, index) => {
            let newElement = {};
            if (validator.isEmpty(fee.from)) {
                newElement.from = "wallet.errFromAmount";
                feesflag = true;
            }
            if (validator.isEmpty(fee.to)) {
                newElement.to = "wallet.errToAmount";
                feesflag = true;
            }
            if (validator.isEmpty(fee.amount)) {
                newElement.amount = "wallet.errFeeAmount";
                feesflag = true;
            }
            feesError.splice(index, 0, newElement);
        });
        if (feesflag){
            withdrawErrors.fees = feesError;
        }
    }

    //limits
    data.limits.forEach((limit, index) => {
        let newElement = {};
        if (validator.isEmpty(limit.type)) {
            newElement.limitType = "wallet.errFeeType";
            limitsflag = true;
        }
        if (validator.isEmpty(limit.min_amount)) {
            newElement.minWitAmount = "wallet.errFeeRange";
            limitsflag = true;
        }
        if (validator.isEmpty(limit.max_amount)) {
            newElement.maxWitAmount = "wallet.errFeeAmount";
            limitsflag = true;
        }
        limitsError.splice(index, 0, newElement);
    });
    if (limitsflag){
        withdrawErrors.limits = limitsError;
    }

    return {
        withdrawErrors,
        isValidWithdraw: Object.keys(withdrawErrors).length > 0 ? false : true
    };
};