import {
    // Get Site Token Calculation
    GET_SITE_TOKEN_CALCULATION,
    GET_SITE_TOKEN_CALCULATION_SUCCESS,
    GET_SITE_TOKEN_CALCULATION_FAILURE,

    // Site Token Conversion
    SITE_TOKEN_CONVERSION,
    SITE_TOKEN_CONVERSION_SUCCESS,
    SITE_TOKEN_CONVERSION_FAILURE,
    
    //For Token History 
    GET_SITE_TOKEN_REPORT_LIST,
    GET_SITE_TOKEN_REPORT_LIST_SUCCESS,
    GET_SITE_TOKEN_REPORT_LIST_FAILURE,
} from '../ActionTypes';

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

//action for Site Token Report List and set type for reducers
export const getSiteTokenReportList = Data => ({
    type: GET_SITE_TOKEN_REPORT_LIST,
    payload: { Data }
});

//action for set Success and Site Token Report List and set type for reducers
export const getSiteTokenReportListSuccess = response => ({
    type: GET_SITE_TOKEN_REPORT_LIST_SUCCESS,
    payload: response
});

//action for set failure and error to Site Token Report List and set type for reducers
export const getSiteTokenReportListFailure = error => ({
    type: GET_SITE_TOKEN_REPORT_LIST_FAILURE,
    payload: error
});