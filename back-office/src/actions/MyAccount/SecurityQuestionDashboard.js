/* 
    Developer : Kevin Ladani
    Date : 04-12-2018
    File Comment : MyAccount Security Dashboard Actions
*/
import {
    ADD_SECURITY_QUESTION_DASHBOARD,
    ADD_SECURITY_QUESTION_DASHBOARD_SUCCESS,
    ADD_SECURITY_QUESTION_DASHBOARD_FAILURE,
} from "../types";

//For MyAccount Security Dashboard
/**
 * Redux Action To MyAccount Security Dashboard Data
 */

export const addSecurityQuestionData = data => ({
    type: ADD_SECURITY_QUESTION_DASHBOARD,
    payload: data
});

/**
 * Redux Action To MyAccount Security Dashboard Data Success
 */
export const addSecurityQuestionDataSuccess = data => ({
    type: ADD_SECURITY_QUESTION_DASHBOARD_SUCCESS,
    payload: data
});

/**
 * Redux Action To MyAccount Security Dashboard Data Failure
 */
export const addSecurityQuestionDataFailure = error => ({
    type: ADD_SECURITY_QUESTION_DASHBOARD_FAILURE,
    payload: error
});