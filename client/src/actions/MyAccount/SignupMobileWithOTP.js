/**
 * Auther : Salim Deraiya
 * Created : 10/10/2018
 * Signup Mobile With OTP Actions
 */

import {
    //Signup With Mobile
    SIGNUP_WITH_MOBILE,
    SIGNUP_WITH_MOBILE_SUCCESS,
    SIGNUP_WITH_MOBILE_FAILURE,

    //Resend OTP to Mobile
    SIGNUP_MOBILE_RESEND_OTP,
    SIGNUP_MOBILE_RESEND_OTP_SUCCESS,
    SIGNUP_MOBILE_RESEND_OTP_FAILURE,

    //Verify OTP Mobile
    SIGNUP_MOBILE_VERIFY_OTP,
    SIGNUP_MOBILE_VERIFY_OTP_SUCCESS,
    SIGNUP_MOBILE_VERIFY_OTP_FAILURE,

} from "../types";


/**
 * Redux Action To Signup with Mobile
 */
export const signUpWithMobile = (data) => ({
    type: SIGNUP_WITH_MOBILE,
    payload: data
});

/**
 * Redux Action To Signup with Mobile Success
 */
export const signUpWithMobileSuccess = (data) => ({
    type: SIGNUP_WITH_MOBILE_SUCCESS,
    payload: data
});

/**
 * Redux Action To Signup with Mobile Failure
 */
export const signUpWithMobileFailure = (error) => ({
    type: SIGNUP_WITH_MOBILE_FAILURE,
    payload: error
});

/**
 * Redux Action To Signup Mobile Resend OTP
 */
export const signUpMobileResendOTP = (data) => ({
    type: SIGNUP_MOBILE_RESEND_OTP,
    payload: data
});

/**
 * Redux Action To Signup Mobile Resend OTP Success
 */
export const signUpMobileResendSuccess = (data) => ({
    type: SIGNUP_MOBILE_RESEND_OTP_SUCCESS,
    payload: data
});

/**
 * Redux Action To Signup Mobile Resend OTP Failure
 */
export const signUpMobileResendFailure = (error) => ({
    type: SIGNUP_MOBILE_RESEND_OTP_FAILURE,
    payload: error
});

/**
 * Redux Action To Signup Mobile Verify OTP
 */
export const signUpMobileVerifyOTP = (data) => ({
    type: SIGNUP_MOBILE_VERIFY_OTP,
    payload: data
});

/**
 * Redux Action To Signup Mobile Verify OTP Success
 */
export const signUpMobileVerifySuccess = (data) => ({
    type: SIGNUP_MOBILE_VERIFY_OTP_SUCCESS,
    payload: data
});

/**
 * Redux Action To Signup Mobile Verify OTP Failure
 */
export const signUpMobileVerifyFailure = (error) => ({
    type: SIGNUP_MOBILE_VERIFY_OTP_FAILURE,
    payload: error
});