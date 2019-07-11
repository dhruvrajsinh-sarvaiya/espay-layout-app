/* 
    Developer : Parth Andhariya
    Date : 15-04-2019
    File Comment : IP Wise Request report action
*/
import {
    // list 
    GET_IP_WISE_REQUEST_REPORT,
    GET_IP_WISE_REQUEST_REPORT_SUCCESS,
    GET_IP_WISE_REQUEST_REPORT_FAILURE,
} from "../types";
/* list admin assets report */
export const getIPWiseRequestReport = (request) => ({
    type: GET_IP_WISE_REQUEST_REPORT,
    request: request
});
export const getIPWiseRequestReportSuccess = (response) => ({
    type: GET_IP_WISE_REQUEST_REPORT_SUCCESS,
    payload: response
});
export const getIPWiseRequestReportFailure = (error) => ({
    type: GET_IP_WISE_REQUEST_REPORT_FAILURE,
    payload: error
});
