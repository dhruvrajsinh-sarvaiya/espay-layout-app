/* 
    Developer : Nishant Vadgam
    Date : 02-10-2018
    File Comment : Add new limit & fee pattern deposit tab validator
*/

import validator from 'validator';

module.exports = function validateDepositTab(data) {
    let depositErrors = {};
    let limitsError = [];
    let feesError = [];
    let limitsflag = false;
    let feesflag = false;

    //Check Main Form details...
    if (validator.isEmpty(data.depositFeeType)) {
        depositErrors.depositFeeType = "wallet.errFeeType";
    }
    if (validator.isEmpty(data.depositFeeRange)) {
        depositErrors.depositFeeRange = "wallet.errFeeRange";
    }
    if (data.depositFeeRange == 'No') {
        if (validator.isEmpty(data.depositFeeAmount)) {
            depositErrors.depositFeeAmount = "wallet.errFeeAmount";
        } else if (data.depositFeeAmount == "0") {
            depositErrors.depositFeeAmount = "wallet.errInvalidFeeAmount";
        }
    } else if (data.depositFeeRange == 'Yes') {
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
            depositErrors.fees = feesError;
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
            newElement.minDepAmount = "wallet.errFeeRange";
            limitsflag = true;
        }
        if (validator.isEmpty(limit.max_amount)) {
            newElement.maxDepAmount = "wallet.errFeeAmount";
            limitsflag = true;
        }
        limitsError.splice(index, 0, newElement);
    });
    if (limitsflag){
        depositErrors.limits = limitsError;
    }
    
    return {
        depositErrors,
        isValidDeposit: Object.keys(depositErrors).length > 0 ? false : true
    };
};