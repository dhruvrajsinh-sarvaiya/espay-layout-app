/**
 * Auther : Salim Deraiya
 * Created : 14/09/2018
 * Forgot Password Actions
 */

 //Import action types form type.js
 import {
    FORGOT_PASSWORD,
    FORGOT_PASSWORD_SUCCESS,
    FORGOT_PASSWORD_FAILURE
} from '../types';

/**
 * Redux Action Forgot Password Success
 */
export const forgotPasswordSuccess = (data) => ({
    type: FORGOT_PASSWORD_SUCCESS,
    payload: data
});

/**
 * Redux Action Forgot Password Failure
 */
export const forgotPasswordFailure = (error) => ({
    type: FORGOT_PASSWORD_FAILURE,
    payload: error
})

/**
 * Redux Action To Forgot Password
 */
export const forgotPassword = (data) => ({
    type: FORGOT_PASSWORD,
    payload: data
});