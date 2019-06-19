/* 
    Developer : Nishant Vadgama
    Date : 07-02-2019
    File Comment : Charges collected report actions
*/
import {
    GET_CHARGECOLLECTED_REPORT,
    GET_CHARGECOLLECTED_REPORT_SUCCESS,
    GET_CHARGECOLLECTED_REPORT_FAILURE
} from "../types";

/* get a list of charges collected report */
export const getChargeCollectedReport = (request) => ({
    type: GET_CHARGECOLLECTED_REPORT,
    request: request
});
export const getChargeCollectedReportSuccess = (response) => ({
    type: GET_CHARGECOLLECTED_REPORT_SUCCESS,
    payload: response
});
export const getChargeCollectedReportFailure = (error) => ({
    type: GET_CHARGECOLLECTED_REPORT_FAILURE,
    payload: error
});
