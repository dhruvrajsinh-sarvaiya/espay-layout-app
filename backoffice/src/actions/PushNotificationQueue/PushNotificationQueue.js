/* 
    Developer : Khushbu Badheka
    Date : 08-Jan-2019
    File Actions : Push Notification Queue Module
*/
import {
  //For Display Push Notification Queue
  DISPALY_PUSHNOTIFICATION,
  DISPALY_PUSHNOTIFICATION_SUCCESS,
  DISPALY_PUSHNOTIFICATION_FAILURE,
  DISPALY_RESENDPUSHNOTIFICATION,
  DISPALY_RESENDPUSHNOTIFICATION_SUCCESS,
  DISPALY_RESENDPUSHNOTIFICATION_FAILURE,

} from "../types";

//For Display Push Notification Queue
/**
* Redux Action To Display Push Notification Queue
*/

export const displayPushNotification = requestdata => ({
  type: DISPALY_PUSHNOTIFICATION,
  payload : requestdata
});

/**
* Redux Action To Display Push Notification Queue Success
*/
export const displayPushNotificationSuccess = response => ({
type: DISPALY_PUSHNOTIFICATION_SUCCESS,
payload: response
});

/**
* Redux Action To Display Push Notification Queue Failure
*/
export const displayPushNotificationFailure = error => ({
type: DISPALY_PUSHNOTIFICATION_FAILURE,
payload: error
});

/**
* Redux Action To Display Push Notification Queue Resend Success
*/
export const displayResendPushNotification = response => ({
type: DISPALY_RESENDPUSHNOTIFICATION,
payload: response
});

/**
* Redux Action To Display Push Notification Queue Resend Success
*/
export const displayResendPushNotificationSuccess = response => ({
type: DISPALY_RESENDPUSHNOTIFICATION_SUCCESS,
payload: response
});


/**
* Redux Action To Display Push Notification Queue Resend Success
*/
export const displayPushNotificationResendFailure = response => ({
type: DISPALY_RESENDPUSHNOTIFICATION_FAILURE,
payload: error
});


