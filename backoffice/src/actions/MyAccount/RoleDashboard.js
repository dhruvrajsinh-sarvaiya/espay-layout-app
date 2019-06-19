/* 
    Developer : Salim Deraiya
    Date : 23-11-2018
    File Comment : MyAccount Role Dashboard Actions
*/
import {
    ROLE_DASHBOARD,
    ROLE_DASHBOARD_SUCCESS,
    ROLE_DASHBOARD_FAILURE
} from "../types";

//For Display Role Data
/**
 * Redux Action To Display Role Data
 */

export const getRoleData = () => ({
    type: ROLE_DASHBOARD
});

/**
 * Redux Action To Display Role Data Success
 */
export const getRoleDataSuccess = (response) => ({
    type: ROLE_DASHBOARD_SUCCESS,
    payload: response
});

/**
 * Redux Action To Display Role Data Failure
 */
export const getRoleDataFailure = (error) => ({
    type: ROLE_DASHBOARD_FAILURE,
    payload: error
});