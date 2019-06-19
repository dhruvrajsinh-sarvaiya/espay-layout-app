/**
 * Create By Sanjay 
 * Created Date 18/03/2019
 * API Plan Configuration Reducer 
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

    GET_API_WISE_REPORT,
    GET_API_WISE_REPORT_SUCCESS,
    GET_API_WISE_REPORT_FAILURE,

    // Added By Tejas
    GET_MOST_ACTIVE_IP_ADDRESS_LIST,
    GET_MOST_ACTIVE_IP_ADDRESS_LIST_SUCCESS,
    GET_MOST_ACTIVE_IP_ADDRESS_LIST_FAILURE,
} from "Actions/types";

// initial state
const INITIAL_STATE = {
    loading: false,
    APIPlanRequestData: {},
    FrequentUseData: {},
    MostActiveIpAddressData: {},
    TotalCount: 0,
    TotalPages: 0,
    TotalCountIp: 0,
    TotalPagesIp: 0,
    httpErrorsSuccess: [],
    httpErrorsFailure: [],
    httpErrorsLoading: false,
    apiWiseData: {},
    mostActiveAddressFailure: [],
    mostActiveAddressSuccess: [],
    mostActiveAddressLoading: false
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case GET_API_PLAN_REQUEST_STATISTIC_COUNT:
            return {
                ...state,
                loading: true,
            };
        case GET_API_PLAN_REQUEST_STATISTIC_COUNT_SUCCESS:
            return {
                ...state,
                loading: false,
                APIPlanRequestData: action.payload
            };
        case GET_API_PLAN_REQUEST_STATISTIC_COUNT_FAILURE:
            return {
                ...state,
                loading: false,
                APIPlanRequestData: action.payload
            };

        case LIST_FREQUENT_USE:
            return {
                ...state,
                loading: true,
            };
        case LIST_FREQUENT_USE_SUCCESS:
            return {
                ...state,
                loading: false,
                FrequentUseData: action.payload
            };
        case LIST_FREQUENT_USE_FAILURE:
            return {
                ...state,
                loading: false,
                FrequentUseData: action.payload
            };

        case LIST_MOST_ACTIVE_IP_ADDRESS:
            return {
                ...state,
                loading: true,
            };
        case LIST_MOST_ACTIVE_IP_ADDRESS_SUCCESS:
            return {
                ...state,
                loading: false,
                MostActiveIpAddressData: action.payload
            };
        case LIST_MOST_ACTIVE_IP_ADDRESS_FAILURE:
            return {
                ...state,
                loading: false,
                MostActiveIpAddressData: action.payload
            };

        // get Http Errors List
        case GET_HTTP_ERRORS_LIST:
            return { ...state, httpErrorsLoading: true, httpErrorsSuccess: [], httpErrorsFailure: [] };

        // set Data Of get Http Errors List
        case GET_HTTP_ERRORS_LIST_SUCCESS:
            return { ...state, TotalPages: action.payload.PageCount, httpErrorsSuccess: action.payload.Response, httpErrorsLoading: false, TotalCount: action.payload.TotalCount, httpErrorsFailure: [] };

        // Display Error for get Http Errors List failure
        case GET_HTTP_ERRORS_LIST_FAILURE:

            return { ...state, httpErrorsLoading: false, TotalPages: 0, TotalCount: 0, httpErrorsSuccess: [], httpErrorsFailure: action.payload };

        case GET_API_WISE_REPORT:
            return { ...state, loading: true, apiWiseData: {} };

        case GET_API_WISE_REPORT_SUCCESS:
            return { ...state, loading: false, apiWiseData: action.payload };

        case GET_API_WISE_REPORT_FAILURE:
            return { ...state, loading: false, apiWiseData: action.payload };
// get Most Active IP Address
case GET_MOST_ACTIVE_IP_ADDRESS_LIST:
return { ...state, mostActiveAddressLoading: true, mostActiveAddressSuccess: [], mostActiveAddressFailure: [] };



// set Data Of get Most Active IP Address
case GET_MOST_ACTIVE_IP_ADDRESS_LIST_SUCCESS:
return { ...state, TotalPagesIp: action.payload.PageCount, mostActiveAddressSuccess: action.payload.Response, mostActiveAddressLoading: false, TotalCountIp: action.payload.TotalCount, mostActiveAddressFailure: [] };



// Display Error for get Most Active IP Address failure
case GET_MOST_ACTIVE_IP_ADDRESS_LIST_FAILURE:

return { ...state, mostActiveAddressLoading: false, TotalPagesIp: 0, TotalCountIp: 0, mostActiveAddressSuccess: [], mostActiveAddressFailure: action.payload };


        default:
            return { ...state };
    }
};