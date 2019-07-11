/* 
    Developer : Salim Deraiya
    Date : 23-11-2018
    File Comment : MyAccount Language Dashboard Actions
*/
import {
    LANGUAGE_DASHBOARD,
    LANGUAGE_DASHBOARD_SUCCESS,
    LANGUAGE_DASHBOARD_FAILURE
} from "../types";

//For Display Language Data
/**
 * Redux Action To Display Language Data
 */

export const getLanguageData = () => ({
    type: LANGUAGE_DASHBOARD
});

/**
 * Redux Action To Display Language Data Success
 */
export const getLanguageDataSuccess = (response) => ({
    type: LANGUAGE_DASHBOARD_SUCCESS,
    payload: response
});

/**
 * Redux Action To Display Language Data Failure
 */
export const getLanguageDataFailure = (error) => ({
    type: LANGUAGE_DASHBOARD_FAILURE,
    payload: error
});