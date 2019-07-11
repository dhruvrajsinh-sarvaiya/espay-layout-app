/* 
    Developer : Kevin Ladani
    Date : 21-12-2018
    File Comment : MyAccount PhoneNumber Dashboard Actions
*/
import {
    PHONE_NUMBER_DASHBOARD,
    PHONE_NUMBER_DASHBOARD_SUCCESS,
    PHONE_NUMBER_DASHBOARD_FAILURE
} from "../types";

//For Display Application Data
/**
 * Redux Action To Display PhoneNumber Data
 */

export const getPhoneNumberData = () => ({
    type: PHONE_NUMBER_DASHBOARD
});

/**
 * Redux Action To Display PhoneNumber Data Success
 */
export const getPhoneNumberDataSuccess = (response) => ({
    type: PHONE_NUMBER_DASHBOARD_SUCCESS,
    payload: response
});

/**
 * Redux Action To Display PhoneNumber Data Failure
 */
export const getPhoneNumberDataFailure = (error) => ({
    type: PHONE_NUMBER_DASHBOARD_FAILURE,
    payload: error
});