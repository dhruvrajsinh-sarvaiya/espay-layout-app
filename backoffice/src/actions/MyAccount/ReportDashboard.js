/* 
    Developer : Salim Deraiya
    Date : 23-11-2018
    File Comment : MyAccount Report Dashboard Actions
*/
import {
    REPORT_DASHBOARD,
    REPORT_DASHBOARD_SUCCESS,
    REPORT_DASHBOARD_FAILURE
} from "../types";

//For Display Report Data
/**
 * Redux Action To Display Report Data
 */

export const getReportData = () => ({
    type: REPORT_DASHBOARD
});

/**
 * Redux Action To Display Report Data Success
 */
export const getReportDataSuccess = (response) => ({
    type: REPORT_DASHBOARD_SUCCESS,
    payload: response
});

/**
 * Redux Action To Display Report Data Failure
 */
export const getReportDataFailure = (error) => ({
    type: REPORT_DASHBOARD_FAILURE,
    payload: error
});