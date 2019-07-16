import {
  // Login History List
  LOGIN_HISTORY_LIST,
  LOGIN_HISTORY_LIST_SUCCESS,
  LOGIN_HISTORY_LIST_FAILURE,

  // Clear Login History
  CLEAR_LOGIN_HISTORY,

  // Login History Widget
  LOGIN_HISTORY_WIDGET_SUCCESS
} from '../ActionTypes';

/**
 * Redux Action To Login History List
 */
export const loginHistoryList = (LoginHistoryReqObj) => ({
  type: LOGIN_HISTORY_LIST,
  payload: LoginHistoryReqObj
});

/**
* Redux Action Login History List Success
*/
export const loginHistoryListSuccess = (list) => ({
  type: LOGIN_HISTORY_LIST_SUCCESS,
  payload: list
});

/**
* Redux Action Login History List Success
*/
export const loginHistoryWidgetSuccess = (list) => ({
  type: LOGIN_HISTORY_WIDGET_SUCCESS,
  payload: list
});

/**
* Redux Action Login History List Failure
*/
export const loginHistoryListFailure = (error) => ({
  type: LOGIN_HISTORY_LIST_FAILURE,
  payload: error
});

export const clearLoginHistoryData = () => ({
  type: CLEAR_LOGIN_HISTORY,
});

