/**
 *   Developer : Parth Andhariya
 *   Date : 05-03-2019
 *   Component: Leverge Report action 
 */
import {
    GET_LEVERAGE_REPORT_LIST,
    GET_LEVERAGE_REPORT_LIST_SUCCESS,
    GET_LEVERAGE_REPORT_LIST_FAILURE,
    //added by vishva
    UPGRADE_LOAN,
    UPGRADE_LOAN_SUCCESS,
    UPGRADE_LOAN_FAILURE
} from "../types";
//get action
export const getLeverageReportList = data => ({
    type: GET_LEVERAGE_REPORT_LIST,
    payload: data
});

export const getLeverageReportListSuccess = response => ({
    type: GET_LEVERAGE_REPORT_LIST_SUCCESS,
    payload: response
});

export const getLeverageReportListFailure = error => ({
    type: GET_LEVERAGE_REPORT_LIST_FAILURE,
    payload: error
});
//update loan
export const getUpgradeLoan = data => ({
    type: UPGRADE_LOAN,
    payload: data
});

export const getUpgradeLoanSuccess = response => ({
    type: UPGRADE_LOAN_SUCCESS,
    payload: response
});

export const getUpgradeLoanFailure = error => ({
    type: UPGRADE_LOAN_FAILURE,
    payload: error
});

