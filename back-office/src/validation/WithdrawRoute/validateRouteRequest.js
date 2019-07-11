import validator from "validator";
import { isScriptTag, isHtmlTag } from 'Helpers/helpers';
module.exports = function validateRouteRequest(data, TrnType) {
    let errors = {};
    let routeFlag = false;
    let routesError = [];

    // curreny pair
    if (validator.isEmpty(data.CurrencyName)) {
        errors.currency = "wallet.errCurrency";
    }
    // route selection
    if (!data.AvailableRoute.length) {
        errors.selectRoute = "wallet.errSelectRoute";
    }
    //routes
    data.AvailableRoute.forEach((route, index) => {
        let newElement = {};
        if (validator.isEmpty(route.ServiceProDetailId + "")) {
            newElement.ServiceProDetailId = "wallet.errRequired";
            routeFlag = true;
        }
        if (validator.isEmpty(route.ProviderWalletID + "")) {
            newElement.ProviderWalletID = "wallet.errRequired";
            routeFlag = true;
        }
        if (validator.isEmpty(route.AssetName)) {
            newElement.AssetName = "wallet.errRequired";
            routeFlag = true;
        }
        if (validator.isEmpty(route.ConfirmationCount + "")) {
            newElement.ConfirmationCount = "wallet.errRequired";
            routeFlag = true;
        }
        if (isScriptTag(route.AccountNoLen + "")) {
            newElement.AccountNoLen = "my_account.err.scriptTag";
            routeFlag = true;
        }
        if (isHtmlTag(route.AccountNoLen + "")) {
            newElement.AccountNoLen = "my_account.err.htmlTag";
            routeFlag = true;
        }
        if (isScriptTag(route.AccNoStartsWith + "")) {
            newElement.AccNoStartsWith = "my_account.err.scriptTag";
            routeFlag = true;
        }
        if (isHtmlTag(route.AccNoStartsWith + "")) {
            newElement.AccNoStartsWith = "my_account.err.htmlTag";
            routeFlag = true;
        }
        if (isScriptTag(route.AccNoValidationRegex + "")) {
            newElement.AccNoValidationRegex = "my_account.err.scriptTag";
            routeFlag = true;
        }
        if (isHtmlTag(route.AccNoValidationRegex + "")) {
            newElement.AccNoValidationRegex = "my_account.err.htmlTag";
            routeFlag = true;
        }
        //added by parth andhariya   25-04-2019
        if (TrnType === 6) {
            if (validator.isEmpty(route.ConvertAmount + "")) {
                newElement.ConvertAmount = "wallet.errRequired";
                routeFlag = true;
            }
        }
        //added by parth andhariya   25-04-2019
        if (TrnType === 9) {
            if (validator.isEmpty(route.AccountNoLen + "")) {
                newElement.AccountNoLen = "wallet.errRequired";
                routeFlag = true;
            }
            if (validator.isEmpty(route.AccNoStartsWith + "")) {
                newElement.AccNoStartsWith = "wallet.errRequired";
                routeFlag = true;
            }
            if (validator.isEmpty(route.AccNoValidationRegex + "")) {
                newElement.AccNoValidationRegex = "wallet.errRequired";
                routeFlag = true;
            }
        }
        routesError.splice(index, 0, newElement);
    });
    if (routeFlag) {
        errors.routes = routesError;
    }

    return {
        errors,
        isValid: Object.keys(errors).length > 0 ? false : true
    };
};
