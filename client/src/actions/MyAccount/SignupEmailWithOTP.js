/**
 * Auther : Salim Deraiya
 * Created : 10/10/2018
 * Signup Email With OTP Actions
 */

import {
    //Signup With Email
    SIGNUP_WITH_EMAIL,
    SIGNUP_WITH_EMAIL_SUCCESS,
    SIGNUP_WITH_EMAIL_FAILURE,

    //Resend OTP to Email
    SIGNUP_EMAIL_RESEND_OTP,
    SIGNUP_EMAIL_RESEND_OTP_SUCCESS,
    SIGNUP_EMAIL_RESEND_OTP_FAILURE,

    //Verify OTP Email
    SIGNUP_EMAIL_VERIFY_OTP,
    SIGNUP_EMAIL_VERIFY_OTP_SUCCESS,
    SIGNUP_EMAIL_VERIFY_OTP_FAILURE,

} from "../types";


/**
 * Redux Action To Signup with Email
 */
export const signUpWithEmail = (data) => ({
    type: SIGNUP_WITH_EMAIL,
    payload: data
});

/**
 * Redux Action To Signup with Email Success
 */
export const signUpWithEmailSuccess = (data) => ({
    type: SIGNUP_WITH_EMAIL_SUCCESS,
    payload: data
});

/**
 * Redux Action To Signup with Email Failure
 */
export const signUpWithEmailFailure = (error) => ({
    type: SIGNUP_WITH_EMAIL_FAILURE,
    payload: error
});

/**
 * Redux Action To Signup Email Resend OTP
 */
export const signUpEmailResendOTP = (data) => ({
    type: SIGNUP_EMAIL_RESEND_OTP,
    payload: data
});

/**
 * Redux Action To Signup Email Resend OTP Success
 */
export const signUpEmailResendSuccess = (data) => ({
    type: SIGNUP_EMAIL_RESEND_OTP_SUCCESS,
    payload: data
});

/**
 * Redux Action To Signup Email Resend OTP Failure
 */
export const signUpEmailResendFailure = (error) => ({
    type: SIGNUP_EMAIL_RESEND_OTP_FAILURE,
    payload: error
});

/**
 * Redux Action To Signup Email Verify OTP
 */
export const signUpEmailVerifyOTP = (data) => ({
    type: SIGNUP_EMAIL_VERIFY_OTP,
    payload: data
});

/**
 * Redux Action To Signup Email Verify OTP Success
 */
export const signUpEmailVerifySuccess = (data) => ({
    type: SIGNUP_EMAIL_VERIFY_OTP_SUCCESS,
    payload: data
});

/**
 * Redux Action To Signup Email Verify OTP Failure
 */
export const signUpEmailVerifyFailure = (error) => ({
    type: SIGNUP_EMAIL_VERIFY_OTP_FAILURE,
    payload: error
});