/**
 * Auther : Saloni Rathod
 * Created : 12/03/2018
 * User Confirmation Actions
 */

import {
    USER_CONFIRMATION,
    USER_CONFIRMATION_SUCCESS,
    USER_CONFIRMATION_FAILURE
} from "../types";

/**
 * Redux Action To User Confirmation
 */
export const userConfirmation = (data) => ({
    type: USER_CONFIRMATION,
    payload: data
});

/**
 * Redux Action To User Confirmation Success
 */
export const userConfirmationSuccess = (data) => ({
    type: USER_CONFIRMATION_SUCCESS,
    payload: data
});

/**
 * Redux Action To User Confirmation Failure
 */
export const userConfirmationFailure = (error) => ({
    type: USER_CONFIRMATION_FAILURE,
    payload: error
});