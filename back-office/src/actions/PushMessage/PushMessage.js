/*
 * CreatedBy : Megha Kariya
 * Date : 17-01-2019
 * Comment : Push Message action file
 */

/**
 * Display User Actions
 */
import {
  //For Display User
  DISPALY_USER_LIST,
  DISPALY_USER_LIST_SUCCESS,
  DISPALY_USER_LIST_FAILURE,
  SEND_MSG,
  SEND_MSG_SUCCESS,
  SEND_MSG_FAILURE,
} from "../types";

//For Display user
/**
 * Redux Action To Display user List
 */

export const displayUserList = payload => ({
  type: DISPALY_USER_LIST,
  payload:payload
});

/**
 * Redux Action To Display User List Success
 */
export const displayUserListSuccess = response => ({
  type: DISPALY_USER_LIST_SUCCESS,
  payload: response
});

/**
 * Redux Action To Display User List Failure
 */
export const displayUserListFailure = error => ({
  type: DISPALY_USER_LIST_FAILURE,
  payload: error
});

/**
 * Redux Action To Send Message request
 */
export const sendMessageUser = (data) => ({
  type: SEND_MSG,
  payload: data
});

/**
 * Redux Action To Send Message Success
 */
export const sendMessageUserSuccess = response => ({
  type: SEND_MSG_SUCCESS,
  payload: response
});

/**
 * Redux Action To Send Message Failure
 */
export const sendMessageUserFailure = error => ({
  type: SEND_MSG_FAILURE,
  payload: error
});
