import validator from "validator";

module.exports = function validateWithdrawLimitRequest(data) {
    let errors = {};
    //check limit per hour...
    if (validator.isEmpty(data.LimitPerHour)) {
        errors.withdrawLimitHour = "apiWalletErrCode.4211";
    } else if (
        !validator.isDecimal(data.LimitPerHour, {
            force_decimal: false,
            decimal_digits: "0,8"
        }) &&
        !validator.isNumeric(data.LimitPerHour)
    ) {
        errors.withdrawLimitHour = "wallet.errLCInvalidLimit";
    }
    //check limit per day...
    if (validator.isEmpty(data.LimitPerDay)) {
        errors.withdrawLimitDay = "apiWalletErrCode.4212";
    } else if (
        !validator.isDecimal(data.LimitPerDay, {
            force_decimal: false,
            decimal_digits: "0,8"
        }) &&
        !validator.isNumeric(data.LimitPerDay)
    ) {
        errors.withdrawLimitDay = "wallet.errLCInvalidLimit";
    }
    //check limit per transaction...
    if (validator.isEmpty(data.LimitPerTransaction)) {
        errors.withdrawLimitTrn = "apiWalletErrCode.4213";
    } else if (
        !validator.isDecimal(data.LimitPerTransaction, {
            force_decimal: false,
            decimal_digits: "0,8"
        }) &&
        !validator.isNumeric(data.LimitPerTransaction)
    ) {
        errors.withdrawLimitTrn = "wallet.errLCInvalidLimit";
    }
    //check lifetime limits...
    if (validator.isEmpty(data.LifeTime)) {
        errors.withdrawLifeTimeLimit = "wallet.LCInvalidLifeTimeLimitRequired";
    } else if (
        !validator.isDecimal(data.LifeTime, {
            force_decimal: false,
            decimal_digits: "0,8"
        }) &&
        !validator.isNumeric(data.LifeTime)
    ) {
        errors.withdrawLifeTimeLimit = "wallet.errLCInvalidLifeTimeLimit";
    }
    //check timing start date and end date...
    if (data.StartTime != null || data.EndTime != null) {
        //check is not null ...
        if (data.StartTime == null) {
            errors.withdrawStartTime = "wallet.errStartDate";
        } else if (data.EndTime == null) {
            errors.withdrawEndTime = "wallet.errEndDate";
        }
        //check start time is greater then or quals to end time...
        if (data.StartTime != null && data.EndTime != null) {
            if (data.StartTime >= data.EndTime) {
                errors.withdrawStartTime = "wallet.errLessThen";
            }
        }
    }
    return {
        errors,
        isValid: Object.keys(errors).length > 0 ? false : true
    };
};
