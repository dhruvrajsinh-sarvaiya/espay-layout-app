/**
 * Create By : Sanjay Rathod
 * Created Date : 31/01/2019
 * SignIn Mobile With OTP Actions
 */

import {
    //SignIn With Mobile
    SIGNIN_WITH_MOBILE,
    SIGNIN_WITH_MOBILE_SUCCESS,
    SIGNIN_WITH_MOBILE_FAILURE,

    //Resend OTP to Mobile
    SIGNIN_MOBILE_RESEND_OTP,
    SIGNIN_MOBILE_RESEND_OTP_SUCCESS,
    SIGNIN_MOBILE_RESEND_OTP_FAILURE,

    //Verify OTP Mobile
    SIGNIN_MOBILE_VERIFY_OTP,
    SIGNIN_MOBILE_VERIFY_OTP_SUCCESS,
    SIGNIN_MOBILE_VERIFY_OTP_FAILURE

} from "../types";


/**
 * Redux Action for SignIn with Mobile
 */
export const signInWithMobile = (data) => ({
    type: SIGNIN_WITH_MOBILE,
    payload: data
});

/**
 * Redux Action for SignIn with Mobile Success
 */
export const signInWithMobileSuccess = (data) => ({
    type: SIGNIN_WITH_MOBILE_SUCCESS,
    payload: data
});

/**
 * Redux Action for SignIn with Mobile Failure
 */
export const signInWithMobileFailure = (error) => ({
    type: SIGNIN_WITH_MOBILE_FAILURE,
    payload: error
});

/**
 * Redux Action for SignIn Mobile Resend OTP
 */
export const signInMobileResendOTP = (data) => ({
    type: SIGNIN_MOBILE_RESEND_OTP,
    payload: data
});

/**
 * Redux Action for SignIn Mobile Resend OTP Success
 */
export const signInMobileResendSuccess = (data) => ({
    type: SIGNIN_MOBILE_RESEND_OTP_SUCCESS,
    payload: data
});

/**
 * Redux Action for SignIn Mobile Resend OTP Failure
 */
export const signInMobileResendFailure = (error) => ({
    type: SIGNIN_MOBILE_RESEND_OTP_FAILURE,
    payload: error
});

/**
 * Redux Action for SignIn Mobile Verify OTP
 */
export const signInMobileVerifyOTP = (data) => ({
    type: SIGNIN_MOBILE_VERIFY_OTP,
    payload: data
});

/**
 * Redux Action for SignIn Mobile Verify OTP Success
 */
export const signInMobileVerifySuccess = (data) => ({
    type: SIGNIN_MOBILE_VERIFY_OTP_SUCCESS,
    payload: data
});

/**
 * Redux Action for SignIn Mobile Verify OTP Failure
 */
export const signInMobileVerifyFailure = (error) => ({
    type: SIGNIN_MOBILE_VERIFY_OTP_FAILURE,
    payload: error
});