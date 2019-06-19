/* 
    Developer : Salim Deraiya
    Date : 23-11-2018
    File Comment : MyAccount Email Provider Dashboard Actions
*/
import {
    EMAIL_PROVIDER_DASHBOARD,
    EMAIL_PROVIDER_DASHBOARD_SUCCESS,
    EMAIL_PROVIDER_DASHBOARD_FAILURE
} from "../types";

//For Display Email Provider Data
/**
 * Redux Action To Display Email Provider Data
 */

export const getEmailProviderData = () => ({
    type: EMAIL_PROVIDER_DASHBOARD
});

/**
 * Redux Action To Display Email Provider Data Success
 */
export const getEmailProviderDataSuccess = (response) => ({
    type: EMAIL_PROVIDER_DASHBOARD_SUCCESS,
    payload: response
});

/**
 * Redux Action To Display Email Provider Data Failure
 */
export const getEmailProviderDataFailure = (error) => ({
    type: EMAIL_PROVIDER_DASHBOARD_FAILURE,
    payload: error
});