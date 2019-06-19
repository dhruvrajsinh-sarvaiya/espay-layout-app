/**
 * Create By Sanjay
 * Created Date 18/03/2019
 * Actions For API Plan Confirguration
 */

import {
    GET_API_PLAN_REQUEST_STATISTIC_COUNT,
    GET_API_PLAN_REQUEST_STATISTIC_COUNT_SUCCESS,
    GET_API_PLAN_REQUEST_STATISTIC_COUNT_FAILURE,

    LIST_FREQUENT_USE,
    LIST_FREQUENT_USE_SUCCESS,
    LIST_FREQUENT_USE_FAILURE,

    LIST_MOST_ACTIVE_IP_ADDRESS,
    LIST_MOST_ACTIVE_IP_ADDRESS_SUCCESS,
    LIST_MOST_ACTIVE_IP_ADDRESS_FAILURE,

    // Added BY Tejas
    GET_HTTP_ERRORS_LIST,
    GET_HTTP_ERRORS_LIST_SUCCESS,
    GET_HTTP_ERRORS_LIST_FAILURE,

    GET_MOST_ACTIVE_IP_ADDRESS_LIST,
    GET_MOST_ACTIVE_IP_ADDRESS_LIST_SUCCESS,
    GET_MOST_ACTIVE_IP_ADDRESS_LIST_FAILURE,


    GET_API_WISE_REPORT,
    GET_API_WISE_REPORT_SUCCESS,
    GET_API_WISE_REPORT_FAILURE
} from "../types";

export const getAPIPlanRequestCount = () => ({
    type: GET_API_PLAN_REQUEST_STATISTIC_COUNT,
});
export const getAPIPlanRequestCountSuccess = (response) => ({
    type: GET_API_PLAN_REQUEST_STATISTIC_COUNT_SUCCESS,
    payload: response,
});
export const getAPIPlanRequestCountFailure = (error) => ({
    type: GET_API_PLAN_REQUEST_STATISTIC_COUNT_FAILURE,
    payload: error,
});

//Action For List Most Active Ip Address
export const listMostActiveIpAddress = () => ({
    type: LIST_MOST_ACTIVE_IP_ADDRESS,
});
export const listMostActiveIpAddressSuccess = (response) => ({
    type: LIST_MOST_ACTIVE_IP_ADDRESS_SUCCESS,
    payload: response,
});
export const listMostActiveIpAddressFailure = (error) => ({
    type: LIST_MOST_ACTIVE_IP_ADDRESS_FAILURE,
    payload: error,
});

//Action For List Frequent Use
export const listFrequentUse = () => ({
    type: LIST_FREQUENT_USE,
});
export const listFrequentUseSuccess = (response) => ({
    type: LIST_FREQUENT_USE_SUCCESS,
    payload: response,
});
export const listFrequentUseFailure = (error) => ({
    type: LIST_FREQUENT_USE_FAILURE,
    payload: error,
});

// Added BY Tejas
//Action For Get http Codes List
export const getHttpErrorCodeList = (Data) => ({
    type: GET_HTTP_ERRORS_LIST,
    payload: { Data },
});
export const getHttpErrorCodeListSuccess = (response) => ({
    type: GET_HTTP_ERRORS_LIST_SUCCESS,
    payload: response,
});
export const getHttpErrorCodeListFailure = (error) => ({
    type: GET_HTTP_ERRORS_LIST_FAILURE,
    payload: error,
});

//Actions For Get API wise Report
export const getAPIWiseReport = (request) => ({
    type: GET_API_WISE_REPORT,
    payload: { request }
});
export const getAPIWiseReportSuccess = (response) => ({
    type: GET_API_WISE_REPORT_SUCCESS,
    payload: response,
});
export const getAPIWiseReportFailure = (error) => ({
    type: GET_API_WISE_REPORT_FAILURE,
    payload: error,
});

// Added BY Tejas
//Action For Most Active Ip Adderss
export const getMostActiveIpAddressReport = (Data) => ({
    type: GET_MOST_ACTIVE_IP_ADDRESS_LIST,
    payload: { Data }
});
export const getMostActiveIpAddressReportSuccess = (response) => ({
    type: GET_MOST_ACTIVE_IP_ADDRESS_LIST_SUCCESS,
    payload: response
});
export const getMostActiveIpAddressReportFailure = (error) => ({
    type: GET_MOST_ACTIVE_IP_ADDRESS_LIST_FAILURE,
    payload: error
});
