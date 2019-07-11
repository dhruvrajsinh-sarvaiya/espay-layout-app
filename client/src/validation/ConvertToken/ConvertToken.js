import validator from 'validator';

module.exports = function validateConvertTokenRequest(data) {
    let errors = {};
    //Check Required Field...
    if (validator.isEmpty(data.fromCurrency)) {
        errors.fromCurrency = "wallet.errCTFromCurrencyRequired";
    }
    if (validator.isEmpty(data.toCurrency)) {
        errors.toCurrency = "wallet.errCTToCurrencyRequired";
    }
    if (validator.isEmpty(data.address)) {
        errors.address = "wallet.errCTAddressRequired";
    }
    if (validator.isEmpty(data.amount)) {
        errors.amount = "wallet.errCTAmountRequired";
    } else if (validator.contains(data.amount, '-')) {
        errors.amount = "wallet.errCTInvalidAmount";
    } else if (validator.equals(data.amount, '0')) {
        errors.amount = "wallet.errCTInvalidAmount";
    } else if (!validator.isDecimal(data.amount, { force_decimal: false, decimal_digits: '0,8' })) {
        errors.amount = "wallet.errCTInvalidAmount";
    }
    return {
        errors,
        isValid: Object.keys(errors).length > 0 ? false : true
    };
};