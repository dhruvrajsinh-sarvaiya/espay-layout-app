/**
 * Author : Tejas gauswami
 * Created : 28/05/2019
 *  Arbitrage Buy/Sell Form Validation..
*/

import validator from 'validator';

export function validatePrice(data) {
    let errors = {};
    const regexNumeric = /^[0-9]+(\.[0-9]{1,8})?$/;

    if (!validator.matches(data, regexNumeric)) {
        errors.rate = "trade.errTradePriceIsNumber";
    }
    return {
        errors, isValid: Object.keys(errors).length > 0 ? false : true
    };
}

export function validateAmount(data) {
    let errors = {};
    const regexNumeric = /^[0-9]+(\.[0-9]{1,8})?$/;

    if (!validator.matches(data, regexNumeric)) {
        errors.amount = "trade.errTradeAmountIsNumber";
    }

    return {
        errors, isValid: Object.keys(errors).length > 0 ? false : true
    };
}

export function validateTotal(data) {
    let errors = {};
    const regexNumeric = /^[0-9]+(\.[0-9]{1,8})?$/;

    if (!validator.matches(data, regexNumeric)) {
        errors.total = "trade.errTradeTotalIsNumber";
    }

    return {
        errors, isValid: Object.keys(errors).length > 0 ? false : true
    };
}

export function validateQty(data) {
    let errors = {};
    const regexNumeric = /^[0-9]+(\.[0-9]{1,8})?$/;

    if (!validator.matches(data, regexNumeric)) {
        errors.quantity = "trade.errTradeQtyIsNumber";
    }

    return {
        errors, isValid: Object.keys(errors).length > 0 ? false : true
    };
}

export function validateFees(data) {
    let errors = {};
    const regexNumeric = /^[0-9]+(\.[0-9]{1,8})?$/;

    if (!validator.matches(data, regexNumeric)) {
        errors.fees = "trade.errTradeFeesIsNumber";
    }

    return {
        errors, isValid: Object.keys(errors).length > 0 ? false : true
    };
}

export function validateData(data) {
    let errors = {};

    if (data.price === '' || data.price === 0) {
        errors.rate = "trade.errTradePriceRequired";
    } else {
        if (data.amount === '' || data.amount === 0) {
            errors.quantity = "trade.errTradeAmountRequired";
        } else {
            if (data.total === '' || data.total === 0) {
                errors.total = "trade.errTradeTotalRequired";
            }
        }
    }

    if (data.amount === '' || data.amount === 0) {
        errors.quantity = "trade.errTradeAmountRequired";
    } else {
        if (data.total === '' || data.total === 0) {
            errors.total = "trade.errTradeTotalRequired";
        }
    }

    if (data.limitBuy === '' || data.limitBuy === 0) {
        errors.buyLimit = "trade.errTradeLimitRequired";
    }

    return {
        errors, isValid: Object.keys(errors).length > 0 ? false : true
    };
}

export function validateOnlyNumeric(data) {

    const regexNumeric = /^[0-9.]+$/;

    return (!validator.matches(data, regexNumeric)) ? false : true

}