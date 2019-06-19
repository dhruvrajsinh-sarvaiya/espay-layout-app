/*
 * Created By : Megha Kariya
 * Date : 15-01-2019
 * Comment : Messaging Queue Action file
 */
// import types
import {
  GET_MESSAGE_QUEUE_LIST,
  GET_MESSAGE_QUEUE_LIST_SUCCESS,
  GET_MESSAGE_QUEUE_LIST_FAILURE,
  RESEND_MESSAGE,
  RESEND_MESSAGE_SUCCESS,
  RESEND_MESSAGE_FAILURE,
} from "Actions/types";

//action for Message Queue List 
export const getMessageQueueList = Data => ({
  type: GET_MESSAGE_QUEUE_LIST,
  payload: { Data }
});

//action for set Success and Message Queue List 
export const getMessageQueueListSuccess = response => ({
  type: GET_MESSAGE_QUEUE_LIST_SUCCESS,
  // payload: response.MessagingQueueObj
  payload: response
});

//action for set failure and error to Message Queue List 
export const getMessageQueueListFailure = error => ({
  type: GET_MESSAGE_QUEUE_LIST_FAILURE,
  payload: error
});

//action for Resend Message List
export const resendMessageUser = Data => ({
  type: RESEND_MESSAGE,
  payload: { Data }
});

//action for set Success and Resend Message List
export const resendMessageUserSuccess = response => ({
  type: RESEND_MESSAGE_SUCCESS,
  payload: response
});

//action for set failure and error to Resend Message List
export const resendMessageUserFailure = error => ({
  type: RESEND_MESSAGE_FAILURE,
  payload: error
});
