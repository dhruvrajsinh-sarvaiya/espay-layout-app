/* 
    Developer : Salim Deraiya
    Date : 23-11-2018
    File Comment : MyAccount User Dashboard Actions
*/
import {
    //For Get User
    USER_DASHBOARD,
    USER_DASHBOARD_SUCCESS,
    USER_DASHBOARD_FAILURE,

    // For Add User
    ADD_USER_DASHBOARD,
    ADD_USER_DASHBOARD_SUCCESS,
    ADD_USER_DASHBOARD_FAILURE,

} from "../types";

//For Display User Data
/**
 * Redux Action To Display User Data
 */

export const getUserData = () => ({
    type: USER_DASHBOARD
});

/**
 * Redux Action To Display User Data Success
 */
export const getUserDataSuccess = (response) => ({
    type: USER_DASHBOARD_SUCCESS,
    payload: response
});

/**
 * Redux Action To Display User Data Failure
 */
export const getUserDataFailure = (error) => ({
    type: USER_DASHBOARD_FAILURE,
    payload: error
});

/**
 * Redux Action To Add User Data
 */

export const addUserData = data => ({
    type: ADD_USER_DASHBOARD,
    payload: data
});

/**
 * Redux Action To Add User Data Success
 */
export const addUserDataSuccess = data => ({
    type: ADD_USER_DASHBOARD_SUCCESS,
    payload: data
});

/**
 * Redux Action To Add User Data Failure
 */
export const addUserDataFailure = error => ({
    type: ADD_USER_DASHBOARD_FAILURE,
    payload: error
});