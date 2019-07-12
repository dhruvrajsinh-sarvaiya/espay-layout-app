import {
  // Email SignUp
  EMAIL_SIGNUP,

  // Verify Signup Otp
  VERIFY_SIGNUP_OTP,

  // Resend Otp
  RESEND_OTP,

  // Normal Register
  NORMAL_REGISTER,
  NORMAL_REGISTER_SUCCESS,
  NORMAL_REGISTER_FAILURE,

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

  //Resend Confirm Email
  SIGNUP_RESEND_CONFIRM_EMAIL,
  SIGNUP_RESEND_CONFIRM_EMAIL_SUCCESS,
  SIGNUP_RESEND_CONFIRM_EMAIL_FAILURE,

  //Remove Login Data
  REMOVE_LOGIN_DATA,

  SIGNUP_WITH_MOBILE_EMAIL_CLEAR,
} from '../ActionTypes';
import { action } from '../GlobalActions';

export function removeLoginData() {
  return {
    type: REMOVE_LOGIN_DATA,
  }
}

/**
 * Redux action to Generate Otp
 */
export function onGenerateOtp(emailRegisterRequest) {
  return action(EMAIL_SIGNUP, { emailRegisterRequest })
}

/**
 * Redux action to Generate Otp Success
 */
export function onVerifySignUpOTP(emailOtpVerifyRequest) {
  return action(VERIFY_SIGNUP_OTP, { emailOtpVerifyRequest })
}

/**
 * Redux action to Generate Otp Failure
 */
export function onResendOTP(emailOtpResendRequest) {
  return action(RESEND_OTP, { emailOtpResendRequest })
}

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
* Redux Action To Signup with Mobile Email clear
*/
export const signUpWithMobileEmailClear = (error) => ({
  type: SIGNUP_WITH_MOBILE_EMAIL_CLEAR,
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

/**
* Redux Action To Resend Confirm Email
*/
export const resendConfirmationLink = (data) => ({
  type: SIGNUP_RESEND_CONFIRM_EMAIL,
  payload: data
});

/**
* Redux Action To Resend Confirm Email Success
*/
export const resendConfirmationLinkSuccess = (data) => ({
  type: SIGNUP_RESEND_CONFIRM_EMAIL_SUCCESS,
  payload: data
});

/**
* Redux Action To Resend Confirm Email Failure
*/
export const resendConfirmationLinkFailure = (error) => ({
  type: SIGNUP_RESEND_CONFIRM_EMAIL_FAILURE,
  payload: error
});
