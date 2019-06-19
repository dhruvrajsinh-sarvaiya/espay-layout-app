/* 
    Developer : Salim Deraiya
    Date : 23-11-2018
    File Comment : MyAccount Admin Dashboard Actions
*/
import {
    // For Get Admin
    ADMIN_DASHBOARD,
    ADMIN_DASHBOARD_SUCCESS,
    ADMIN_DASHBOARD_FAILURE,

    // For Add Admin
    ADD_ADMIN_DASHBOARD,
    ADD_ADMIN_DASHBOARD_SUCCESS,
    ADD_ADMIN_DASHBOARD_FAILURE,

} from "../types";

//For Display Admin Data
/**
 * Redux Action To Display Admin Data
 */

export const getAdminData = () => ({
    type: ADMIN_DASHBOARD
});

/**
 * Redux Action To Display Admin Data Success
 */
export const getAdminDataSuccess = (response) => ({
    type: ADMIN_DASHBOARD_SUCCESS,
    payload: response
});

/**
 * Redux Action To Display Admin Data Failure
 */
export const getAdminDataFailure = (error) => ({
    type: ADMIN_DASHBOARD_FAILURE,
    payload: error
});

/**
 * Redux Action To Add Admin Data
 */

export const addAdminData = data => ({
    type: ADD_ADMIN_DASHBOARD,
    payload: data
});

/**
 * Redux Action To Add Admin Data Success
 */
export const addAdminDataSuccess = data => ({
    type: ADD_ADMIN_DASHBOARD_SUCCESS,
    payload: data
});

/**
 * Redux Action To Add Admin Data Failure
 */
export const addAdminDataFailure = error => ({
    type: ADD_ADMIN_DASHBOARD_FAILURE,
    payload: error
});