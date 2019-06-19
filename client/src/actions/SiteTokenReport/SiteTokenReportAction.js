// Actions For Site Token History List By Tejas 11/2/2019

// import types
import {
    GET_SITE_TOKEN_REPORT_LIST,
    GET_SITE_TOKEN_REPORT_LIST_SUCCESS,
    GET_SITE_TOKEN_REPORT_LIST_FAILURE,    
} from "Actions/types";

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