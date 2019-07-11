/* 
    Developer : Kevin Ladani
    Date : 04-12-2018
    File Comment : MyAccount Dashboard Actions
*/
import {
    // For Get Personal Information
    GET_PERSONAL_INFO,
    GET_PERSONAL_INFO_SUCCESS,
    GET_PERSONAL_INFO_FAILURE,

    // For Update Personal Information
    EDIT_PERSONAL_INFO,
    EDIT_PERSONAL_INFO_SUCCESS,
    EDIT_PERSONAL_INFO_FAILURE,

} from "../types";

//For Display Personal Info Data
/**
 * Redux Action To Display Personal Info Data
 */

export const getPersonalInfoData = () => ({
    type: GET_PERSONAL_INFO
});

/**
 * Redux Action To Display Personal Info Data Success
 */
export const getPersonalInfoDataSuccess = (response) => ({
    type: GET_PERSONAL_INFO_SUCCESS,
    payload: response
});

/**
 * Redux Action To Display Personal Info Data Failure
 */
export const getPersonalInfoDataFailure = (error) => ({
    type: GET_PERSONAL_INFO_FAILURE,
    payload: error
});

/**
 * Redux Action To Edit Personal Info Data
 */

export const editPersonalInfoData = data => ({
    type: EDIT_PERSONAL_INFO,
    payload: data
});

/**
 * Redux Action To Edit Personal Info Data Success
 */
export const editPersonalInfoDataSuccess = data => ({
    type: EDIT_PERSONAL_INFO_SUCCESS,
    payload: data
});

/**
 * Redux Action To Edit Personal Info Data Failure
 */
export const editPersonalInfoDataFailure = error => ({
    type: EDIT_PERSONAL_INFO_FAILURE,
    payload: error
});