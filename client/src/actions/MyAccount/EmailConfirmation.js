/**
 * Auther : Salim Deraiya
 * Created : 11/10/2018
 * Email Confirmation Actions
 */

import {
    EMAIL_CONFIRMATION,
    EMAIL_CONFIRMATION_SUCCESS,
    EMAIL_CONFIRMATION_FAILURE
} from "../types";

/**
 * Redux Action To Email Confirmation
 */
export const emailConfirmation = (data) => ({
    type: EMAIL_CONFIRMATION,
    payload: data
});

/**
 * Redux Action To Email Confirmation Success
 */
export const emailConfirmationSuccess = (data) => ({
    type: EMAIL_CONFIRMATION_SUCCESS,
    payload: data
});

/**
 * Redux Action To Email Confirmation Failure
 */
export const emailConfirmationFailure = (error) => ({
    type: EMAIL_CONFIRMATION_FAILURE,
    payload: error
});