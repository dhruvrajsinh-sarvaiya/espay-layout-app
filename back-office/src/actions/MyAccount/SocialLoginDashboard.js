/* 
    Developer : Salim Deraiya
    Date : 23-11-2018
    File Comment : MyAccount Social Login Dashboard Actions
*/
import {
    SOCIAL_LOGIN_DASHBOARD,
    SOCIAL_LOGIN_DASHBOARD_SUCCESS,
    SOCIAL_LOGIN_DASHBOARD_FAILURE
} from "../types";

//For Display Social Login Data
/**
 * Redux Action To Display Social Login Data
 */

export const getSocialLoginData = () => ({
    type: SOCIAL_LOGIN_DASHBOARD
});

/**
 * Redux Action To Display Social Login Data Success
 */
export const getSocialLoginDataSuccess = (response) => ({
    type: SOCIAL_LOGIN_DASHBOARD_SUCCESS,
    payload: response
});

/**
 * Redux Action To Display Social Login Data Failure
 */
export const getSocialLoginDataFailure = (error) => ({
    type: SOCIAL_LOGIN_DASHBOARD_FAILURE,
    payload: error
});