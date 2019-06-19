import validator from "validator";

module.exports = function validateApiLimitRequest(data) {
    let errors = {};
    //check limit per hour...
    if (validator.isEmpty(data.LimitPerHour)) {
        errors.apiCallLimitHour = "apiWalletErrCode.4211";
    } else if (
        !validator.isNumeric(data.LimitPerHour, { no_symbols: true })
    ) {
        errors.apiCallLimitHour = "wallet.errLCInvalidLimit";
    }
    //check limit per day...
    if (validator.isEmpty(data.LimitPerDay)) {
        errors.apiCallLimitDay = "apiWalletErrCode.4212";
    } else if (
        !validator.isNumeric(data.LimitPerDay, { no_symbols: true })
    ) {
        errors.apiCallLimitDay = "wallet.errLCInvalidLimit";
    }
    //check limit per transaction...
    if (validator.isEmpty(data.LimitPerTransaction)) {
        errors.apiCallLimitTrn = "apiWalletErrCode.4213";
    } else if (
        !validator.isNumeric(data.LimitPerTransaction, { no_symbols: true })
    ) {
        errors.apiCallLimitTrn = "wallet.errLCInvalidLimit";
    }
    //check lifetime limits...
    if (validator.isEmpty(data.LifeTime)) {
        errors.apiCallLifeTimeLimit = "wallet.LCInvalidLifeTimeLimitRequired";
    } else if (
        !validator.isNumeric(data.LifeTime, { no_symbols: true })
    ) {
        errors.apiCallLifeTimeLimit = "wallet.errLCInvalidLifeTimeLimit";
    }
    //check timing start date and end date...
    if (data.StartTime != null || data.EndTime != null) {
        //check is not null ...
        if (data.StartTime == null) {
            errors.apiCallStartTime = "wallet.errStartDate";
        } else if (data.EndTime == null) {
            errors.apiCallEndTime = "wallet.errEndDate";
        }
        //check start time is greater then or quals to end time...
        if (data.StartTime != null && data.EndTime != null) {
            if (data.StartTime >= data.EndTime) {
                errors.apiCallStartTime = "wallet.errLessThen";
            }
        }
    }
    return {
        errors,
        isValid: Object.keys(errors).length > 0 ? false : true
    };
};
