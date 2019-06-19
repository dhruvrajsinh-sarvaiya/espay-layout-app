/* 
    Developer : Kevin Ladani
    Date : 21-12-2018
    File Comment : MyAccount Group Dashboard Actions
*/
import {
    GROUP_INFO_DASHBOARD,
    GROUP_INFO_DASHBOARD_SUCCESS,
    GROUP_INFO_DASHBOARD_FAILURE
} from "../types";

//For Display Group Data
/**
 * Redux Action To Display Group Data
 */

export const getGroupInfoData = () => ({
    type: GROUP_INFO_DASHBOARD
});

/**
 * Redux Action To Display Group Data Success
 */
export const getGroupInfoDataSuccess = (response) => ({
    type: GROUP_INFO_DASHBOARD_SUCCESS,
    payload: response
});

/**
 * Redux Action To Display Group Data Failure
 */
export const getGroupInfoDataFailure = (error) => ({
    type: GROUP_INFO_DASHBOARD_FAILURE,
    payload: error
});