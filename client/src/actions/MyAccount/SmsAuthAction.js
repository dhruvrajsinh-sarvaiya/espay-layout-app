/**
 * SMS Auth Actions
 */
import {
  //For Send SMS Auth
  SEND_SMSAUTH,
  SEND_SMSAUTH_SUCCESS,
  SEND_SMSAUTH_FAILURE,

  //For Submit Send SMS Auth
  SUBMIT_SEND_SMSAUTH,
  SUBMIT_SEND_SMSAUTH_SUCCESS,
  SUBMIT_SEND_SMSAUTH_FAILURE
} from "../types";

//For Send SMS Auth
/**
 * Redux Action To Send SMS Auth
 */
export const sendSmsauth = user => ({
  type: SEND_SMSAUTH,
  payload: user
});

/**
 * Redux Action To Send SMS Auth Success
 */
export const sendSmsauthSuccess = user => ({
  type: SEND_SMSAUTH_SUCCESS,
  payload: user
});

/**
 * Redux Action To Send SMS Auth Failure
 */
export const sendSmsauthFailure = error => ({
  type: SEND_SMSAUTH_FAILURE,
  payload: error
});

//For Submit Send SMS Auth.
/**
 * Redux Action To Submit Send SMS Auth
 */
export const submitSendSmsauth = user => ({
  type: SUBMIT_SEND_SMSAUTH,
  payload: user
});

/**
 * Redux Action To Submit Send SMS Auth Success
 */
export const submitSendSmsauthSuccess = user => ({
  type: SUBMIT_SEND_SMSAUTH_SUCCESS,
  payload: user
});

/**
 * Redux Action To Submit Send SMS Auth Failure
 */
export const submitSendSmsauthFailure = error => ({
  type: SUBMIT_SEND_SMSAUTH_FAILURE,
  payload: error
});
