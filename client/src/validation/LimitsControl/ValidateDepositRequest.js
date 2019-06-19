import validator from "validator";

module.exports = function validateDepositLimitRequest(data) {
    let errors = {};
    //check limit per hour...
    if (validator.isEmpty(data.LimitPerHour)) {
        errors.depositLimitHour = "apiWalletErrCode.4211";
    } else if (
        !validator.isDecimal(data.LimitPerHour, {
            force_decimal: false,
            decimal_digits: "0,8"
        }) &&
        !validator.isNumeric(data.LimitPerHour)
    ) {
        errors.depositLimitHour = "wallet.errLCInvalidLimit";
    }
    //check limit per day...
    if (validator.isEmpty(data.LimitPerDay)) {
        errors.depositLimitDay = "apiWalletErrCode.4212";
    } else if (
        !validator.isDecimal(data.LimitPerDay, {
            force_decimal: false,
            decimal_digits: "0,8"
        }) &&
        !validator.isNumeric(data.LimitPerDay)
    ) {
        errors.depositLimitDay = "wallet.errLCInvalidLimit";
    }
    //check limit per transaction...
    if (validator.isEmpty(data.LimitPerTransaction)) {
        errors.depositLimitTrn = "apiWalletErrCode.4213";
    } else if (
        !validator.isDecimal(data.LimitPerTransaction, {
            force_decimal: false,
            decimal_digits: "0,8"
        }) &&
        !validator.isNumeric(data.LimitPerTransaction)
    ) {
        errors.depositLimitTrn = "wallet.errLCInvalidLimit";
    }
    //check lifetime limits...
    if (validator.isEmpty(data.LifeTime)) {
        errors.depositLifeTimeLimit = "wallet.LCInvalidLifeTimeLimitRequired";
    } else if (
        !validator.isDecimal(data.LifeTime, {
            force_decimal: false,
            decimal_digits: "0,8"
        }) &&
        !validator.isNumeric(data.LifeTime)
    ) {
        errors.depositLifeTimeLimit = "wallet.errLCInvalidLifeTimeLimit";
    }
    //check timing start date and end date...
    if (data.StartTime != null || data.EndTime != null) {
        //check is not null ...
        if (data.StartTime == null) {
            errors.depositStartTime = "wallet.errStartDate";
        } else if (data.EndTime == null) {
            errors.depositEndTime = "wallet.errEndDate";
        }
        //check start time is greater then or quals to end time...
        if (data.StartTime != null && data.EndTime != null) {
            if (data.StartTime >= data.EndTime) {
                errors.depositStartTime = "wallet.errLessThen";
            }
        }
    }
    return {
        errors,
        isValid: Object.keys(errors).length > 0 ? false : true
    };
};
