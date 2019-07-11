/* 
    Developer : Salim Deraiya
    Date : 23-11-2018
    File Comment : MyAccount Membership Level Dashboard Actions
*/
import {
    MEMBERSHIP_LEVEL_DASHBOARD,
    MEMBERSHIP_LEVEL_DASHBOARD_SUCCESS,
    MEMBERSHIP_LEVEL_DASHBOARD_FAILURE
} from "../types";

//For Display Membership Level Data
/**
 * Redux Action To Display Membership Level Data
 */

export const getMembershipLevelData = () => ({
    type: MEMBERSHIP_LEVEL_DASHBOARD
});

/**
 * Redux Action To Display Membership Level Data Success
 */
export const getMembershipLevelDataSuccess = (response) => ({
    type: MEMBERSHIP_LEVEL_DASHBOARD_SUCCESS,
    payload: response
});

/**
 * Redux Action To Display Membership Level Data Failure
 */
export const getMembershipLevelDataFailure = (error) => ({
    type: MEMBERSHIP_LEVEL_DASHBOARD_FAILURE,
    payload: error
});