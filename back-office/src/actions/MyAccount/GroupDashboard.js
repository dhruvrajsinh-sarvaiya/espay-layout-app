/* 
    Developer : Salim Deraiya
    Date : 23-11-2018
    File Comment : MyAccount Group Dashboard Actions
*/
import {
    GROUP_DASHBOARD,
    GROUP_DASHBOARD_SUCCESS,
    GROUP_DASHBOARD_FAILURE
} from "../types";

//For Display Group Data
/**
 * Redux Action To Display Group Data
 */

export const getGroupData = () => ({
    type: GROUP_DASHBOARD
});

/**
 * Redux Action To Display Group Data Success
 */
export const getGroupDataSuccess = (response) => ({
    type: GROUP_DASHBOARD_SUCCESS,
    payload: response
});

/**
 * Redux Action To Display Group Data Failure
 */
export const getGroupDataFailure = (error) => ({
    type: GROUP_DASHBOARD_FAILURE,
    payload: error
});