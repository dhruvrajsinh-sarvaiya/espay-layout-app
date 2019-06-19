/* 
    Developer : Nishant Vadgama
    Date : 01-02-2019
    File Comment : Admin assets report action
*/
import {
    // list 
    GET_ADMINASSET_REPORT,
    GET_ADMINASSET_REPORT_SUCCESS,
    GET_ADMINASSET_REPORT_FAILURE,
} from "../types";

/* list admin assets report */
export const getAdminAssetReport = (request) => ({
    type: GET_ADMINASSET_REPORT,
    request: request
});
export const getAdminAssetReportSuccess = (response) => ({
    type: GET_ADMINASSET_REPORT_SUCCESS,
    payload: response
});
export const getAdminAssetReportFailure = (error) => ({
    type: GET_ADMINASSET_REPORT_FAILURE,
    payload: error
});
