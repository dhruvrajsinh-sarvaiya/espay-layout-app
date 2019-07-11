/**
 * Create By : Sanjay Rathod
 * Created Date: 31/01/2019
 * Forgot Confirmation Actions
 */

import {
    FORGOT_CONFIRMATION,
    FORGOT_CONFIRMATION_SUCCESS,
    FORGOT_CONFIRMATION_FAILURE,

    SET_NEW_PASSWORD,
    SET_NEW_PASSWORD_SUCCESS,
    SET_NEW_PASSWORD_FAILURE
} from "../types";


/**
 * Redux Action For Forgot Confirmation
 */
export const forgotConfirmation = (data) => ({
    type: FORGOT_CONFIRMATION,
    payload: data
});

/**
 * Redux Action For Forgot Confirmation Success
 */
export const forgotConfirmationSuccess = (data) => ({
    type: FORGOT_CONFIRMATION_SUCCESS,
    payload: data
});

/**
 * Redux Action For Forgot Confirmation Failure
 */
export const forgotConfirmationFailure = (error) => ({
    type: FORGOT_CONFIRMATION_FAILURE,
    payload: error
});

/**
 * Redux Action For Set New Password 
 */
export const setNewPassword = (data) => ({
    type: SET_NEW_PASSWORD,
    payload: data
});

/**
 * Redux Action For Set New Password Success
 */
export const setNewPasswordSuccess = (data) => ({
    type: SET_NEW_PASSWORD_SUCCESS,
    payload: data
});

/**
 * Redux Action For Set New Password Failure
 */
export const setNewPasswordFailure = (error) => ({
    type: SET_NEW_PASSWORD_FAILURE,
    payload: error
});