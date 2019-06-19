/* 
    Developer : Salim Deraiya
    Date : 23-11-2018
    File Comment : MyAccount Organization Dashboard Actions
*/
import {
    ORGANIZATION_DASHBOARD,
    ORGANIZATION_DASHBOARD_SUCCESS,
    ORGANIZATION_DASHBOARD_FAILURE
} from "../types";

//For Display Organization Data
/**
 * Redux Action To Display Organization Data
 */

export const getOrganizationData = () => ({
    type: ORGANIZATION_DASHBOARD
});

/**
 * Redux Action To Display Organization Data Success
 */
export const getOrganizationDataSuccess = (response) => ({
    type: ORGANIZATION_DASHBOARD_SUCCESS,
    payload: response
});

/**
 * Redux Action To Display Organization Data Failure
 */
export const getOrganizationDataFailure = (error) => ({
    type: ORGANIZATION_DASHBOARD_FAILURE,
    payload: error
});