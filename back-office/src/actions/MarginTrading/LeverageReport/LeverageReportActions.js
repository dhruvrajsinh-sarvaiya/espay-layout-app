/* 
    Developer : Nishant Vadgama
    File Comment : Leverage Report action methods
    Date : 13-09-2019
*/
import {
    GET_LEVERAGE_REPORT,
    GET_LEVERAGE_REPORT_SUCCESS,
    GET_LEVERAGE_REPORT_FAILURE,
} from "../../types";

/* get leverage report */
export const getLeverageReport = (request) => ({
    type: GET_LEVERAGE_REPORT,
    payload: request
});

export const getLeverageReportSuccess = response => ({
    type: GET_LEVERAGE_REPORT_SUCCESS,
    payload: response
});

export const getLeverageReportFailure = error => ({
    type: GET_LEVERAGE_REPORT_FAILURE,
    payload: error
});

