// Actions For Site Token Conversion By Tejas 11/2/2019

// import types
import {
    GET_SITE_TOKEN,
    GET_SITE_TOKEN_SUCCESS,
    GET_SITE_TOKEN_FAILURE,
    GET_SITE_TOKEN_CALCULATION,
    GET_SITE_TOKEN_CALCULATION_SUCCESS,
    GET_SITE_TOKEN_CALCULATION_FAILURE,
    SITE_TOKEN_CONVERSION,
    SITE_TOKEN_CONVERSION_SUCCESS,
    SITE_TOKEN_CONVERSION_FAILURE,
    //added by parth andhariya
    GET_BASE_MARKET_CURRENCY,
    GET_BASE_MARKET_CURRENCY_SUCCESS,
    GET_BASE_MARKET_CURRENCY_FAILURE,
} from "Actions/types";

//action for Site Token Conversion and set type for reducers
export const getSiteToken = Data => ({
    type: GET_SITE_TOKEN,
    payload: { Data }
});

//action for set Success and Site Token Conversion and set type for reducers
export const getSiteTokenSuccess = response => ({
    type: GET_SITE_TOKEN_SUCCESS,
    payload: response
});

//action for set failure and error to Site Token Conversion and set type for reducers
export const getSiteTokenFailure = error => ({
    type: GET_SITE_TOKEN_FAILURE,
    payload: error
});


//action for Site Token Conversion Calculation and set type for reducers
export const getSiteTokenCalculation = Data => ({
    type: GET_SITE_TOKEN_CALCULATION,
    payload: { Data }
});

//action for set Success and Site Token Conversion Calculation and set type for reducers
export const getSiteTokenCalculationSuccess = response => ({
    type: GET_SITE_TOKEN_CALCULATION_SUCCESS,
    payload: response
});

//action for set failure and error to Site Token Conversion Calculation and set type for reducers
export const getSiteTokenCalculationFailure = error => ({
    type: GET_SITE_TOKEN_CALCULATION_FAILURE,
    payload: error
});

//action for Site Token Conversion and set type for reducers
export const doSiteTokenConversion = Data => ({
    type: SITE_TOKEN_CONVERSION,
    payload: { Data }
});

//action for set Success and Site Token Conversion and set type for reducers
export const doSiteTokenConversionSuccess = response => ({
    type: SITE_TOKEN_CONVERSION_SUCCESS,
    payload: response
});

//action for set failure and error to Site Token Conversion and set type for reducers
export const doSiteTokenConversionFailure = error => ({
    type: SITE_TOKEN_CONVERSION_FAILURE,
    payload: error
});


//added by parth andhariya 
//action for margin currency call
export const getBaseMarketCurrency = Data => ({
    type: GET_BASE_MARKET_CURRENCY,
    payload: { Data }
});
//action for set margin currency success 
export const getBaseMarketCurrencySuccess = response => ({
    type: GET_BASE_MARKET_CURRENCY_SUCCESS,
    payload: response
});
//action for set margin currency Failure
export const getBaseMarketCurrencyFailure = error => ({
    type: GET_BASE_MARKET_CURRENCY_FAILURE,
    payload: error
});
