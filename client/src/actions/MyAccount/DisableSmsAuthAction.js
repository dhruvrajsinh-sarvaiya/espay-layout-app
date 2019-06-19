/**
 * SMS Auth Actions
 */
import {
    //For Disable Send SMS Auth
    DISABLE_SEND_SMSAUTH,
    DISABLE_SEND_SMSAUTH_SUCCESS,
    DISABLE_SEND_SMSAUTH_FAILURE,
  
    //For Disable Submit Send SMS Auth
    DISABLE_SUBMIT_SEND_SMSAUTH,
    DISABLE_SUBMIT_SEND_SMSAUTH_SUCCESS,
    DISABLE_SUBMIT_SEND_SMSAUTH_FAILURE
  } from "../types";
  
  //For Disable Send SMS Auth
  /**
   * Redux Action To Disable Send SMS Auth
   */
  export const sendSmsauthDisable = user => ({
    type: DISABLE_SEND_SMSAUTH,
    payload: user
  });
  
  /**
   * Redux Action To Send SMS Auth Success
   */
  export const sendSmsauthDisableSuccess = user => ({
    type: DISABLE_SEND_SMSAUTH_SUCCESS,
    payload: user
  });
  
  /**
   * Redux Action To Send SMS Auth Failure
   */
  export const sendSmsauthDisableFailure = error => ({
    type: DISABLE_SEND_SMSAUTH_FAILURE,
    payload: error
  });
  
  //For Submit Send SMS Auth.
  /**
   * Redux Action To Submit Send SMS Auth
   */
  export const submitSendSmsauthDisable = user => ({
    type: DISABLE_SUBMIT_SEND_SMSAUTH,
    payload: user
  });
  
  /**
   * Redux Action To Submit Send SMS Auth Success
   */
  export const submitSendSmsauthDisableSuccess = user => ({
    type: DISABLE_SUBMIT_SEND_SMSAUTH_SUCCESS,
    payload: user
  });
  
  /**
   * Redux Action To Submit Send SMS Auth Failure
   */
  export const submitSendSmsauthDisableFailure = error => ({
    type: DISABLE_SUBMIT_SEND_SMSAUTH_FAILURE,
    payload: error
  });
  