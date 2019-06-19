/* 
    Developer : Nishant Vadgam
    Date : 02-10-2018
    File Comment : Add new limit & fee pattern deposit tab validator
*/

import validator from 'validator';

module.exports = function validateTradeTab(data) {
    let tradeErrors = {};
    let limitsError = [];
    let feesError = [];
    let limitsflag = false;
    let feesflag = false;

    //Check Main Form details...
    if (validator.isEmpty(data.tradeFeeType)) {
        tradeErrors.tradeFeeType = "wallet.errFeeType";
    }
    if (validator.isEmpty(data.tradeFeeRange)) {
        tradeErrors.tradeFeeRange = "wallet.errFeeRange";
    }

    if (data.tradeFeeRange == 'No') {
        if (validator.isEmpty(data.tradeFeeAmount)) {
            tradeErrors.tradeFeeAmount = "wallet.errFeeAmount";
        } else if (data.tradeFeeAmount == "0") {
            tradeErrors.tradeFeeAmount = "wallet.errInvalidFeeAmount";
        }
    } else if (data.tradeFeeRange == 'Yes') {
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
            tradeErrors.fees = feesError;
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
            newElement.minTraAmount = "wallet.errFeeRange";
            limitsflag = true;
        }
        if (validator.isEmpty(limit.max_amount)) {
            newElement.maxTraAmount = "wallet.errFeeAmount";
            limitsflag = true;
        }
        limitsError.splice(index, 0, newElement);
    });
    if (limitsflag){
        tradeErrors.limits = limitsError;
    }
   
    return {
        tradeErrors,
        isValidTrade: Object.keys(tradeErrors).length > 0 ? false : true
    };
};