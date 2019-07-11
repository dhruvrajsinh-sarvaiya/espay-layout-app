/* 
    Developer : Salim Deraiya
    Date : 23-11-2018
    File Comment : MyAccount Setting Dashboard Actions
*/
import {
    SETTING_DASHBOARD,
    SETTING_DASHBOARD_SUCCESS,
    SETTING_DASHBOARD_FAILURE
} from "../types";

//For Display Setting Data
/**
 * Redux Action To Display Setting Data
 */

export const getSettingData = () => ({
    type: SETTING_DASHBOARD
});

/**
 * Redux Action To Display Setting Data Success
 */
export const getSettingDataSuccess = (response) => ({
    type: SETTING_DASHBOARD_SUCCESS,
    payload: response
});

/**
 * Redux Action To Display Setting Data Failure
 */
export const getSettingDataFailure = (error) => ({
    type: SETTING_DASHBOARD_FAILURE,
    payload: error
});