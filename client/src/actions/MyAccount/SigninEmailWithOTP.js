/**
 * Auther : Salim Deraiya
 * Created : 11/10/2018
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
    SIGNIN_EMAIL_VERIFY_OTP_FAILURE,

} from "../types";


/**
 * Redux Action To SignIn with Email
 */
export const signInWithEmail = (data) => ({
    type: SIGNIN_WITH_EMAIL,
    payload: data
});

/**
 * Redux Action To SignIn with Email Success
 */
export const signInWithEmailSuccess = (data) => ({
    type: SIGNIN_WITH_EMAIL_SUCCESS,
    payload: data
});

/**
 * Redux Action To SignIn with Email Failure
 */
export const signInWithEmailFailure = (error) => ({
    type: SIGNIN_WITH_EMAIL_FAILURE,
    payload: error
});

/**
 * Redux Action To SignIn Email Resend OTP
 */
export const signInEmailResendOTP = (data) => ({
    type: SIGNIN_EMAIL_RESEND_OTP,
    payload: data
});

/**
 * Redux Action To SignIn Email Resend OTP Success
 */
export const signInEmailResendSuccess = (data) => ({
    type: SIGNIN_EMAIL_RESEND_OTP_SUCCESS,
    payload: data
});

/**
 * Redux Action To SignIn Email Resend OTP Failure
 */
export const signInEmailResendFailure = (error) => ({
    type: SIGNIN_EMAIL_RESEND_OTP_FAILURE,
    payload: error
});

/**
 * Redux Action To SignIn Email Verify OTP
 */
export const signInEmailVerifyOTP = (data) => ({
    type: SIGNIN_EMAIL_VERIFY_OTP,
    payload: data
});

/**
 * Redux Action To SignIn Email Verify OTP Success
 */
export const signInEmailVerifySuccess = (data) => ({
    type: SIGNIN_EMAIL_VERIFY_OTP_SUCCESS,
    payload: data
});

/**
 * Redux Action To SignIn Email Verify OTP Failure
 */
export const signInEmailVerifyFailure = (error) => ({
    type: SIGNIN_EMAIL_VERIFY_OTP_FAILURE,
    payload: error
});