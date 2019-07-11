/**
 * Auther : Salim Deraiya
 * Created : 10/10/2018
 * Normal Registration Actions
 */

import {

    //Normal Registration
    NORMAL_REGISTER,
    NORMAL_REGISTER_SUCCESS,
    NORMAL_REGISTER_FAILURE,

    //Confirmation Link
    RESEND_CONFIRMATION_LINK,
    RESEND_CONFIRMATION_LINK_SUCCESS,
    RESEND_CONFIRMATION_LINK_FAILURE,

} from "../types";


/**
 * Redux Action To Normal Register
 */
export const normalRegister = (data) => ({
    type: NORMAL_REGISTER,
    payload: data
});

/**
 * Redux Action To Normal Register Success
 */
export const normalRegisterSuccess = (data) => ({
    type: NORMAL_REGISTER_SUCCESS,
    payload: data
});

/**
 * Redux Action To Normal Register Failure
 */
export const normalRegisterFailure = (error) => ({
    type: NORMAL_REGISTER_FAILURE,
    payload: error
});

/**
 * Redux Action To Resend Confirmation Link
 */
export const resendConfirmationLink = (data) => ({
    type: RESEND_CONFIRMATION_LINK,
    payload: data
});

/**
 * Redux Action To Resend Confirmation Link Success
 */
export const resendConfirmationLinkSuccess = (data) => ({
    type: RESEND_CONFIRMATION_LINK_SUCCESS,
    payload: data
});

/**
 * Redux Action To Resend Confirmation Link Failure
 */
export const resendConfirmationLinkFailure = (error) => ({
    type: RESEND_CONFIRMATION_LINK_FAILURE,
    payload: error
});