/**
 * Created By : Sanjay Rathod
 * Created : 31/01/2019
 * SignIn Email With OTP Actions
 */

import {
    //SignIn With Email
    SIGNIN_WITH_EMAIL,
    SIGNIN_WITH_EMAIL_SUCCESS,
    SIGNIN_WITH_EMAIL_FAILURE,

    //Resend OTP to Email
    SIGNIN_EMAIL_RESEND_OTP,
    SIGNIN_EMAIL_RESEND_OTP_SUCCESS,
    SIGNIN_EMAIL_RESEND_OTP_FAILURE,

    //Verify OTP Email
    SIGNIN_EMAIL_VERIFY_OTP,
    SIGNIN_EMAIL_VERIFY_OTP_SUCCESS,
    SIGNIN_EMAIL_VERIFY_OTP_FAILURE

} from "../types";

/**
 * Redux Action for SignIn with Email
 */
export const signInWithEmail = (request) => ({
    type: SIGNIN_WITH_EMAIL,
    payload: request
});

/**
 * Redux Action for SignIn with Email Success
 */
export const signInWithEmailSuccess = (responce) => ({
    type: SIGNIN_WITH_EMAIL_SUCCESS,
    payload: responce
});

/**
 * Redux Action for SignIn with Email Failure
 */
export const signInWithEmailFailure = (error) => ({
    type: SIGNIN_WITH_EMAIL_FAILURE,
    payload: error
});

/**
 * Redux Action for SignIn Email Resend OTP
 */
export const signInEmailResendOTP = (request) => ({
    type: SIGNIN_EMAIL_RESEND_OTP,
    payload: request
});

/**
 * Redux Action for SignIn Email Resend OTP Success
 */
export const signInEmailResendSuccess = (responce) => ({
    type: SIGNIN_EMAIL_RESEND_OTP_SUCCESS,
    payload: responce
});

/**
 * Redux Action for SignIn Email Resend OTP Failure
 */
export const signInEmailResendFailure = (error) => ({
    type: SIGNIN_EMAIL_RESEND_OTP_FAILURE,
    payload: error
});

/**
 * Redux Action for SignIn Email Verify OTP
 */
export const signInEmailVerifyOTP = (request) => ({
    type: SIGNIN_EMAIL_VERIFY_OTP,
    payload: request
});

/**
 * Redux Action for SignIn Email Verify OTP Success
 */
export const signInEmailVerifySuccess = (responce) => ({
    type: SIGNIN_EMAIL_VERIFY_OTP_SUCCESS,
    payload: responce
});

/**
 * Redux Action for SignIn Email Verify OTP Failure
 */
export const signInEmailVerifyFailure = (error) => ({
    type: SIGNIN_EMAIL_VERIFY_OTP_FAILURE,
    payload: error
});