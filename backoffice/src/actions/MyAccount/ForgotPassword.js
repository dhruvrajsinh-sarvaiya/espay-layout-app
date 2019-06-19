/**
 * Created By : Sanjay Rathod
 * Created Date: 31/01/2019
 * Forgot Password Actions
 */

 //Import action types form type.js
 import {
    FORGOT_PASSWORD_SCREEN,
    FORGOT_PASSWORD_SCREEN_SUCCESS,
    FORGOT_PASSWORD_SCREEN_FAILURE
} from '../types';

/**
 * Redux Action Forgot Password Success
 */
export const forgotPasswordScreenSuccess = (data) => ({
    type: FORGOT_PASSWORD_SCREEN_SUCCESS,
    payload: data
});

/**
 * Redux Action Forgot Password Failure
 */
export const forgotPasswordScreenFailure = (error) => ({
    type: FORGOT_PASSWORD_SCREEN_FAILURE,
    payload: error
})

/**
 * Redux Action To Forgot Password
 */
export const forgotScreenPassword = (data) => ({
    type: FORGOT_PASSWORD_SCREEN,
    payload: data
});