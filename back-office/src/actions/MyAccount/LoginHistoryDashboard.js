/* 
    Developer : Kevin Ladani
    Date : 03-12-2018
    File Comment : MyAccount Login History Dashboard Actions
*/
import {
    LIST_LOGINHISTORY_DASHBOARD,
    LIST_LOGINHISTORY_DASHBOARD_SUCCESS,
    LIST_LOGINHISTORY_DASHBOARD_FAILURE
} from "../types";

//For Display Login History Data
/**
 * Redux Action To Display Login History Data
 */

export const getLoginHistoryData = (request) => ({
    type: LIST_LOGINHISTORY_DASHBOARD,
    payload:request
});

/**
 * Redux Action To Display Login History Data Success
 */
export const getLoginHistoryDataSuccess = response => ({
    type: LIST_LOGINHISTORY_DASHBOARD_SUCCESS,
    payload: response
});

/**
 * Redux Action To Display Login History Data Failure
 */
export const getLoginHistoryDataFailure = error => ({
    type: LIST_LOGINHISTORY_DASHBOARD_FAILURE,
    payload: error
});