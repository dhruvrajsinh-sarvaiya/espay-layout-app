import validator from 'validator';

module.exports = function validateWithdrawRequest(data, IsWhitelisting, WithdrawalDailyLimit, AvailableBalance, minWithdraw, maxWithdraw) {
    let errors = {};
    //validate address
    if (validator.isEmpty(data.address, { ignore_whitespace: true })) {
        errors.address = "wallet.errWDaddressRequired";
    } else if (data.address.trim().length === 0) {
        errors.address = "wallet.errWDaddressRequired";
    } else if (validator.isNumeric(data.address)) {
        errors.address = "wallet.errWDinvalidAddress";
    } else if (validator.isAlpha(data.address)) {
        errors.address = "wallet.errWDinvalidAddress";
    }
    // else if (!/^[0-9A-Za-z?=]+$/.test(data.address)) {
    //     errors.address = "wallet.errWDinvalidAddress";
    // }
    else if (!validator.matches(data.address,/^[0-9A-Za-z?=]+$/)) {
        errors.address = "wallet.errWDinvalidAddress";
    }

    // if whitelist is enable 
    if (!IsWhitelisting) {
        // validate label
        if (validator.isEmpty(data.label, { ignore_whitespace: true })) {
            errors.label = "wallet.errWDlabelRequired";
        } else if (data.label.trim().length === 0) {
            errors.label = "wallet.errWDlabelRequired";
        }
    }
    // validate amount
    if (!validator.isNumeric(data.amount) && !validator.isFloat(data.amount)) {
        errors.amount = "wallet.errWDamountRequired";
    } else if (validator.contains(data.amount, '-')) {
        errors.amount = "wallet.errWDInvalidAmount";
    } else if (validator.equals(data.amount, '0') || data.amount == 0) {
        errors.amount = "wallet.errWDInvalidAmount";
    } else if (!validator.isDecimal(data.amount, { force_decimal: false, decimal_digits: '0,8' })) {
        errors.amount = "wallet.errWDInvalidAmount";
    } else if (parseFloat(data.amount) > parseFloat(WithdrawalDailyLimit) && WithdrawalDailyLimit != 0) {
        errors.amount = "wallet.errWDLessthenLimit";
    } else if (parseFloat(data.amount) > parseFloat(AvailableBalance)) {
        errors.amount = "wallet.errWDLessthenBalance";
    } else if (parseFloat(data.amount) > parseFloat(maxWithdraw) && maxWithdraw != 0) {
        errors.amount = "wallet.errWDMaxWithdraw";
    } else if (parseFloat(data.amount) < parseFloat(minWithdraw) && minWithdraw != 0) {
        errors.amount = "wallet.errWDMinWithdraw";
    }

    return {
        errors,
        isValid: Object.keys(errors).length > 0 ? false : true
    };
};