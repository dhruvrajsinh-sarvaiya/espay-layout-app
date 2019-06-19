import validator from "validator";

module.exports = function validateAddRouteRequest(data) {
    let errors = {};
    // curreny pair
    if (validator.isEmpty(data.currencyPair)) {
        errors.currencyPair = "wallet.errCurrencyPair";
    }

    if (validator.isEmpty(data.orderType)) {
        errors.orderType = "wallet.errOrderType";
    }

    if (validator.isEmpty(data.trnType)) {
        errors.trnType = "wallet.errTrnType";
    }

    if (validator.isEmpty(data.status)) {
        errors.status = "wallet.errStatus";
    }

    
    if (!data.selectedRoutes.length) {
        errors.selectRoute = "wallet.errSelectRoute";
    }

    return {
        errors,
        isValid: Object.keys(errors).length > 0 ? false : true
    };
};
