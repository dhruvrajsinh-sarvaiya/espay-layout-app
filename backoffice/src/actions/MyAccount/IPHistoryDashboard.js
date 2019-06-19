/* 
    Developer : Kevin Ladani
    Date : 03-12-2018
    File Comment : MyAccount IPHistory Dashboard Actions
*/
import {
    LIST_IPHISTORY_DASHBOARD,
    LIST_IPHISTORY_DASHBOARD_SUCCESS,
    LIST_IPHISTORY_DASHBOARD_FAILURE
} from "../types";

//For Display IPHistory Data
/**
 * Redux Action To Display IPHistory Data
 */

export const getIPHistoryData = (data) => ({
    type: LIST_IPHISTORY_DASHBOARD,
    payload:data
});

/**
 * Redux Action To Display IPHistory Data Success
 */
export const getIPHistoryDataSuccess = response => ({
    type: LIST_IPHISTORY_DASHBOARD_SUCCESS,
    payload: response
});

/**
 * Redux Action To Display IPHistory Data Failure
 */
export const getIPHistoryDataFailure = error => ({
    type: LIST_IPHISTORY_DASHBOARD_FAILURE,
    payload: error
});