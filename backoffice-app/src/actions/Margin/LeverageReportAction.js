import {
    // Get Leverage Report
    GET_LEVERAGE_REPORT,
    GET_LEVERAGE_REPORT_SUCCESS,
    GET_LEVERAGE_REPORT_FAILURE,

    // Clear Get Leverage Report
    CLEAR_GET_LEVERAGE_REPORT,
} from "../ActionTypes";

// Redux action for Get Leverage Report List 
export const getLeverageReport = (request) => ({
    type: GET_LEVERAGE_REPORT,
    payload: request
});

// Redux action for Get Leverage Report List Success
export const getLeverageReportSuccess = response => ({
    type: GET_LEVERAGE_REPORT_SUCCESS,
    payload: response
});

// Redux action for Get Leverage Report List Failure
export const getLeverageReportFailure = error => ({
    type: GET_LEVERAGE_REPORT_FAILURE,
    payload: error
});

// Redux action for Clear Leverage Report Data
export const clearLeverageReport = () => ({
    type: CLEAR_GET_LEVERAGE_REPORT,
});
