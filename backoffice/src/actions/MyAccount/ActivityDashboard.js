/* 
    Developer : Kevin Ladani
    Date : 21-12-2018
    File Comment : MyAccount Activity Dashboard Actions
*/
import {
    ACTIVITY_DASHBOARD,
    ACTIVITY_DASHBOARD_SUCCESS,
    ACTIVITY_DASHBOARD_FAILURE
} from "../types";

//For Display Application Data
/**
 * Redux Action To Display Activity Data
 */

export const getActivityData = () => ({
    type: ACTIVITY_DASHBOARD
});

/**
 * Redux Action To Display Activity Data Success
 */
export const getActivityDataSuccess = (response) => ({
    type: ACTIVITY_DASHBOARD_SUCCESS,
    payload: response
});

/**
 * Redux Action To Display Activity Data Failure
 */
export const getActivityDataFailure = (error) => ({
    type: ACTIVITY_DASHBOARD_FAILURE,
    payload: error
});