/* 
    Developer : Kevin Ladani
    Date : 04-12-2018
    File Comment : MyAccount ChangePassword Dashboard Actions
*/
import {
    CHANGE_PASSWORD_DASHBOARD,
    CHANGE_PASSWORD_DASHBOARD_SUCCESS,
    CHANGE_PASSWORD_DASHBOARD_FAILURE,
} from "../types";

//For ChangePassword Data
/**
 * Redux Action To ChangePassword Data
 */

export const changePasswordData = data => ({
    type: CHANGE_PASSWORD_DASHBOARD,
    payload: data
});

/**
 * Redux Action To ChangePassword Data Success
 */
export const changePasswordDataSuccess = data => ({
    type: CHANGE_PASSWORD_DASHBOARD_SUCCESS,
    payload: data
});

/**
 * Redux Action To Add IPWhitelist Data Failure
 */
export const changePasswordDataFailure = error => ({
    type: CHANGE_PASSWORD_DASHBOARD_FAILURE,
    payload: error
});