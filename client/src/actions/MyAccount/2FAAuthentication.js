/**
 * Auther : Salim Deraiya
 * Created : 14/09/2018
 * 2FA Authentication Actions
 */

//Import action types form type.js
import {
  TWO_FA_GOOGLE_AUTHENTICATION,
  TWO_FA_GOOGLE_AUTHENTICATION_SUCCESS,
  TWO_FA_GOOGLE_AUTHENTICATION_FAILURE,
  TWO_FA_SMS_AUTHENTICATION_SUCCESS,
  TWO_FA_SMS_AUTHENTICATION_FAILURE,
  TWO_FA_SMS_AUTHENTICATION,
  SEND_SMS,
  SEND_SMS_SUCCESS,
  SEND_SMS_FAILURE
} from "../types";

/**
 * Redux Action 2FA Google Authentication Success
 */
export const twoFAGoogleAuthenticationSuccess = data => ({
  type: TWO_FA_GOOGLE_AUTHENTICATION_SUCCESS,
  payload: data
});

/**
 * Redux Action 2FA Google Authentication Failure
 */
export const twoFAGoogleAuthenticationFailure = error => ({
  type: TWO_FA_GOOGLE_AUTHENTICATION_FAILURE,
  payload: error
});

/**
 * Redux Action To 2FA Google Authentication
 */
export const twoFAGoogleAuthentication = data => ({
  type: TWO_FA_GOOGLE_AUTHENTICATION,
  payload: data
});

/**
 * Redux Action 2FA Google Authentication Success
 */
export const twoFASMSAuthenticationSuccess = data => ({
  type: TWO_FA_SMS_AUTHENTICATION_SUCCESS,
  payload: data
});

/**
 * Redux Action 2FA Google Authentication Failure
 */
export const twoFASMSAuthenticationFailure = error => ({
  type: TWO_FA_SMS_AUTHENTICATION_FAILURE,
  payload: error
});

/**
 * Redux Action To 2FA Google Authentication
 */
export const twoFASMSAuthentication = data => ({
  type: TWO_FA_SMS_AUTHENTICATION,
  payload: data
});

/**
 * Redux Action Send SMS
 * For SMS Authentication
 */
export const sendSMS = data => ({
  type: SEND_SMS,
  payload: data
});

/**
 * Redux Action Send SMS Success
 * For SMS Authentication
 */
export const sendSMSSuccess = data => ({
  type: SEND_SMS_SUCCESS,
  payload: data
});

/**
 * Redux Action Send SMS Failure
 * For SMS Authentication
 */
export const sendSMSFailure = error => ({
  type: SEND_SMS_FAILURE,
  payload: error
});